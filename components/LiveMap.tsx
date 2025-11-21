'use client'

import {
  Circle,
  Map,
  Placemark,
  Polygon,
  YMaps,
  useYMaps,
  SearchControl,
  ZoomControl,
  GeolocationControl,
} from "@pbe/react-yandex-maps";
import { useState, useEffect } from "react";
import { v4 } from "uuid";
import {
  Button,
  ColorPicker,
  Divider,
  Input,
  Modal,
  Select,
  Typography,
  Card,
  Space,
  Badge,
  Tag,
  message
} from "antd";
import styled, { keyframes } from "styled-components";
import {
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { api } from "../api";
import { CreateRegionRequest } from "@/types";
import { Coordinate, RegionCenter, Regions } from "@/app/types/types";
import { AlertCircle, Trash2Icon } from "lucide-react";



type CoordinatesType = [number, number];;

interface IMapClickEvent {
  get: (key: string) => CoordinatesType;
}

interface IGeometry {
  getCoordinates: () => CoordinatesType;
}

interface IPlacemark {
  geometry: IGeometry;
}

interface IDragEvent {
  get: (key: string) => IPlacemark;
}

interface IPolygons {
  id: string;
  coords: CoordinatesType[];
  name: string;
  color: string;
}

interface IAddress {
  location: string;
  route: string;
}



interface Region {
  id: string;
  name: string;
  city: string;
  country: string;
  boundary_coordinates: number[][];
  center_latitude: number;
  center_longitude: number;
  timezone: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}





const calculatePolygonCenter = (coordinates: CoordinatesType[]): { lat: number; lng: number } => {
  if (!coordinates || coordinates.length === 0) {
    return { lat: 0, lng: 0 };
  }

  let latSum = 0;
  let lngSum = 0;

  coordinates.forEach(([lat, lng]) => {  // Array destructuring
    latSum += lat;
    lngSum += lng;
  });

  return {
    lat: latSum / coordinates.length,
    lng: lngSum / coordinates.length
  };
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Styled Components
const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1700px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.div`
  padding: 24px 32px;
  text-align: center;
  
  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: black;
  }
  
  p {
    margin: 8px 0 0 0;
    font-size: 16px;
    color: gray;
  }
`;

const MapSection = styled.div`
  display: flex;
  gap: 24px;
  padding: 32px;
  min-height: 600px;
  
  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const MapContainer = styled.div`
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const StyledMap = styled(Map)`
  width: 100%;
  height: 900px;
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const Sidebar = styled(Card)`
  width: 380px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  animation: ${slideIn} 0.6s ease-out;
  
  @media (max-width: 1200px) {
    width: 100%;
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const AddressCard = styled.div`
  background: #1e2a38e2;
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease-out;
  
  .address-item {
    margin: 8px 0;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(10px);
    font-weight: 500;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  
  .empty-icon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
  
  h3 {
    color: #999;
    margin-bottom: 8px;
  }
  
  p {
    color: #bbb;
    font-size: 14px;
  }
`;

const CustomMapStyles = styled.div`
  .ymaps-2-1-79-zoom__button {
    width: 50px !important;
    height: 50px !important;
  }
  .ymaps-2-1-79-searchbox {
    width: 500px !important;
    height: 60px !important;
  }
  .ymaps-2-1-79-searchbox-input__input {
    font-size: 20px !important;
  }
`;

const ControlSection = styled.div`
  margin-bottom: 24px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ActionButton = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &.primary {
    background: #1E2A38;
    color: white;
    border: none;
    
    &:hover {
      background: #1e2a38a5;
      color: white;
    }
  }

  &.center {
    background: #ff7b7b;
    color: white;
    border: none;
    
    &:hover {
      background: #ff6b6b;
      color: white;
    }
  }
`;

const StyledSelect = styled(Select)`
  width: 100%;
  
  .ant-select-selector {
    border-radius: 8px;
    border: 2px solid #e8e8e8;
    height: 44px;
    
    &:hover {
      border-color: #667eea;
    }
  }
  
  .ant-select-focused .ant-select-selector {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const PolygonTag = styled(Tag)`
  margin: 4px;
  padding: 4px 12px;
  border-radius: 16px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
    
    .ant-modal-title {
      color: #1E2A38;
      font-weight: 600;
    }
  }
`;

const CENTER = [41.311081, 69.240562]; // Toshkent markazi
const ZOOM = 12;
const DEFAULT_POLYGON_COLOR = "#bdbebd";

// Asosiy component
const GeocodeMapComponent = () => {
  const [polygonCoords, setPolygonCoords] = useState<Coordinate[]>([]);
  const [polygonCenter, setPolygonCenter] = useState<RegionCenter | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [polygonName, setPolygonName] = useState("");
  const [polygonColor, setPolygonColor] = useState(DEFAULT_POLYGON_COLOR);
  const [polygons, setPolygons] = useState<Regions[]>([]);
  const [selectedPolygonId, setSelectedPolygonId] = useState<number | null>(null);
  const [markerCoords, setMarkerCoords] = useState<CoordinatesType | null>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');

  const ymaps = useYMaps(["geocode"]);

  const formattedCoordinates = markerCoords
    ? `${markerCoords[0]?.toFixed(6)}, ${markerCoords[1]?.toFixed(6)}`
    : null;

  const selectedPolygon = polygons.find(
    (poly) => poly.id === selectedPolygonId
  );

  // Ma'lumotlarni yuklash
  useEffect(() => {
  if (mapLoaded) {
    loadRegions();
  }
}, [mapLoaded]);

const loadRegions = async () => {
  try {
    const regions = await api.getAdminRegions();
    console.log("Regions", regions);
    
    const formattedPolygons: Regions[] = regions.regions.map(region => {
      // String formatdagi koordinatalarni parse qilish
      let coords: number[][];
      if (typeof region.boundary_coordinates === 'string') {
        coords = JSON.parse(region.boundary_coordinates);
      } else {
        coords = region.boundary_coordinates;
      }

      // Koordinatalar allaqachon [lat, lng] formatida
      // Faqat type assertion kerak
      const boundary_coordinates = coords as CoordinatesType[];

      return {
        id: region.id,
        boundary_coordinates: boundary_coordinates,
        name: region.name,
        country: region.country,
        city: region.city,
        center_latitude: region.center_latitude,  
        center_longitude: region.center_longitude,
        timezone: region.timezone,
        is_active: region.is_active,
        color: DEFAULT_POLYGON_COLOR
      };
    });
    
    console.warn("Loaded regions:", formattedPolygons);
    setPolygons(formattedPolygons);

  } catch (error) {
    console.error('Error loading regions:', error);
  }
};

  const handleClickMap = (e: IMapClickEvent) => {
  const coords = e.get("coords") as CoordinatesType;

  if (!coords) return;

  if (isDrawing) {
    console.warn("Adding coord:", coords);
    setPolygonCoords((prev) => [...prev, coords]);
  } else if (isEditing && selectedPolygonId) {
    insertPointOnPolygon(coords);
  } else {
    setMarkerCoords(coords);
    getAddressByCoords(coords);

    const polygonContainingMarker = polygons.find((poly) =>
      isPointInPolygon(coords, poly.boundary_coordinates)
    );

    setDeliveryStatus(
      polygonContainingMarker
        ? `Falls within the taxi zone: ${polygonContainingMarker.name}`
        : "Outside the delivery zone"
    );
  }
};

  // Nuqta poligon ichida yoki yo'qligini tekshirish
  const isPointInPolygon = (point: CoordinatesType, polygon: CoordinatesType[]) => {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

  // Koordinata → manzil
  function getAddressByCoords(coords: CoordinatesType) {
    if (!ymaps) return;

    ymaps
      ?.geocode(coords)
      .then((result: any) => {
        const firstGeoObject = result.geoObjects.get(0);

        if (firstGeoObject) {
          const location = String(firstGeoObject.getAddressLine());
          const route = String(firstGeoObject.properties.get("name"));

          setAddress({ location, route });
        }
      })
      .catch((error: unknown) => {
        console.log("Ошибка геокодирования", error);
        setAddress(null);
      });
  }

  // Poligon markazini hisoblash
  const handleCalculateCenter = async () => {
  if (polygonCoords.length < 3) {
    message.warning('Markaz hisoblash uchun kamida 3 ta nuqta kerak');
    return;
  }

  const center = calculatePolygonCenter(polygonCoords);
  const region_data = await getLocationName(center.lat, center.lng);
  
  const region_data_str: RegionCenter = {
    country: region_data?.country || "Noma'lum",
    city: region_data?.city || region_data?.town || "Noma'lum",
    latitude: center.lat,
    longitude: center.lng,
  };

  console.warn("Region center:", region_data_str);
  setPolygonCenter(region_data_str);
  message.success('Poligon markazi hisoblandi!');
};
interface OpenCageAddress {
  country?: string;
  city?: string;
  town?: string;
  state?: string;
  postcode?: string;
}

const getLocationName = async (lat: number, lon: number): Promise<OpenCageAddress | null> => {
  try {
    const apiKey = "bb4b843346844ce89251dea6f1c33e29";
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&language=en`
    );

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const components = data.results[0].components;
      console.warn("response",components);
      
      console.log("Davlat:", components.country);
      console.log("Shahar:", components.city || components.town);
      return components;
    }

    return null;
  } catch (error) {
    console.error("Reverse geocoding xatosi:", error);
    return null;
  }
};



  // Poligon saqlash
  const handleSaveNewPolygon = async () => {
    if (polygonCoords.length >= 3 && polygonCenter) {
      // API ga jo'natish
      setIsLoading(true);
      try {

        const regionData: CreateRegionRequest = {
          name: polygonName,
          city: polygonCenter.city,
          country:polygonCenter.country,
          boundary_coordinates: polygonCoords,
          center_latitude: polygonCenter.latitude,
          center_longitude: polygonCenter.longitude,
          timezone: "Asia/Tashkent"
        };
        console.warn("fhtfh",regionData);
        

        const createdRegion = await api.create_region(regionData);
        setResponse('Yangi hudud muvaffaqiyatli yaratildi!');
        const newPolygon: Regions = {
          id: createdRegion.region_id,
          boundary_coordinates: polygonCoords,
          name: polygonName,
          city: polygonCenter.city,
          country: polygonCenter.country,
          center_latitude: polygonCenter.latitude,
          center_longitude: polygonCenter.longitude,
          timezone: "Asia/Tashkent",
          is_active: true,
          color: polygonColor
        };
        
        setPolygons((prev) => [...prev, newPolygon]);
        message.success('Hudud API ga saqlandi!');
      } catch (error) {
        setError(`${error}`);
        console.error('Error saving polygon:', error);
        message.error('API da xatolik yuz berdi');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Lokal saqlash
      // const newPolygon = {
      //   id: v4(),
      //   boundary_coordinates: polygonCoords,
      //     name: polygonName,
      //     city: "Tashkent",
      //     country: "Uzbekistan",
      //     center_latitude: 0.0,
      //     center_longitude: 0.0,
      //     timezone: "Asia/Tashkent",
      //     is_active: true,
      //     color: polygonColor
      // };
      
      // setPolygons((prev) => [...prev, newPolygon]);
      message.success('Hudud lokal saqlandi');
    }
    
    setPolygonCoords([]);
    setPolygonCenter(null);
  };

  const handleStartDrawing = () => {
    setPolygonCoords([]);
    setPolygonCenter(null);
    setIsDrawing(true);
  };
  
  const handleFinishDrawing = () => {
    setIsDrawing(false);
    handleSaveNewPolygon();
  };

  const handleStartEditing = () => {
    if (selectedPolygonId) setIsEditing(true);
  };
  const handleFinishEditing = () => {
    try{
      if (!selectedPolygonId) return;
      const polygonToUpdate = polygons.find(poly => poly.id === selectedPolygonId);
      if (!polygonToUpdate) return;
      const updateData: CreateRegionRequest = {
        name: polygonToUpdate.name,
        city: polygonToUpdate.city,
        country: polygonToUpdate.country,
        boundary_coordinates: polygonToUpdate.boundary_coordinates,
        center_latitude: polygonToUpdate.center_latitude,
        center_longitude: polygonToUpdate.center_longitude,
        timezone: polygonToUpdate.timezone,
        is_active: polygonToUpdate.is_active,
      };
      const res= api.update_reion(selectedPolygonId, updateData);
      console.warn("Updated region:",res);
      setResponse('Polygon updated successfully!');
    }
    catch (error) {
      console.error('Error updating polygon:', error);
      setError(`${error}`);
    }
    setIsEditing(false);
  };
  const handleDeletePolygon = async () => {
    try {
    const res= await api.delete_region(selectedPolygonId!);
    console.warn("Deleted region:",res);
    setPolygons((prev) => prev.filter((poly) => poly.id !== selectedPolygonId)); 
    setIsEditing(false);
    setResponse('Polygon deleted successfully!');
    } catch (error) {
      setError(`${error}`);
      console.error('Error deleting polygon:', error);
    }
  };

  const handleDragPoint = (index: number, event: IDragEvent) => {
  if (!isEditing || !selectedPolygonId) return;

  const newCoords = event.get("target").geometry.getCoordinates() as CoordinatesType;

  setPolygons((prev) =>
    prev.map((poly) =>
      poly.id === selectedPolygonId
        ? {
            ...poly,
            boundary_coordinates: poly.boundary_coordinates.map((coord, i) =>
              i === index ? newCoords : coord
            )
          }
        : poly
    )
  );
};

const insertPointOnPolygon = (clickCoords: CoordinatesType) => {
  if (!selectedPolygonId || !selectedPolygon) return;

  let minDistance = Infinity;
  let insertIndex = -1;

  for (let i = 0; i < selectedPolygon.boundary_coordinates.length; i++) {
    const p1 = selectedPolygon.boundary_coordinates[i];
    const p2 = selectedPolygon.boundary_coordinates[(i + 1) % selectedPolygon.boundary_coordinates.length];
    const distance = pointToSegmentDistance(clickCoords, p1, p2);

    if (distance < minDistance) {
      minDistance = distance;
      insertIndex = i + 1;
    }
  }

  if (insertIndex !== -1) {
    setPolygons((prev) =>
      prev.map((poly) =>
        poly.id === selectedPolygonId
          ? {
              ...poly,
              boundary_coordinates: [
                ...poly.boundary_coordinates.slice(0, insertIndex),
                clickCoords,
                ...poly.boundary_coordinates.slice(insertIndex)
              ]
            }
          : poly
      )
    );
  }
};

const pointToSegmentDistance = (
  point: CoordinatesType,
  segmentStart: CoordinatesType,
  segmentEnd: CoordinatesType
) => {
  const [pointX, pointY] = point;
  const [startX, startY] = segmentStart;
  const [endX, endY] = segmentEnd;

  const A = pointX - startX;
  const B = pointY - startY;
  const C = endX - startX;
  const D = endY - startY;

  const dot = A * C + B * D;
  const lenSquare = C * C + D * D;
  let param = -1;

  if (lenSquare !== 0) param = dot / lenSquare;

  let xx, yy;
  if (param < 0) {
    xx = startX;
    yy = startY;
  } else if (param > 1) {
    xx = endX;
    yy = endY;
  } else {
    xx = startX + param * C;
    yy = startY + param * D;
  }

  const dx = pointX - xx;
  const dy = pointY - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

  return (
    <MainContainer>
      <ContentWrapper>
        <Header>
          <h1>🗺️Interactive Taxi Map</h1>
          <p>Create Taxi zones and validate addresses</p>
        </Header>

        <MapSection>
          
          <Sidebar>
            {address ? (
              <AddressCard>
                <div className="address-item">
                  <EnvironmentOutlined /> {address.location}
                </div>
                <div className="address-item">
                  📍 {address.route}
                </div>
                <div className="address-item">
                  🌐 {formattedCoordinates}
                </div>
                <div className="address-item">
                  {deliveryStatus}
                </div>
              </AddressCard>
            ) : (
              <EmptyState>
                <EnvironmentOutlined className="empty-icon" />
                <h3>Select a point on the map</h3>
                <p>Click on the map to get location information</p>
                {/* Success Message */}
                  {response && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      {response }
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                      <AlertCircle className="mr-2" size={20} />
                      {error}
                    </div>
                  )}
              </EmptyState>
            )}

            <ControlSection>
              <div className="section-title">
                <PlusOutlined /> Creating polygons
              </div>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <ActionButton
                  className="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    handleStartDrawing();
                    setIsModalOpen(true);
                  }}
                  disabled={isDrawing || isEditing}
                >
                  Start drawing
                </ActionButton>
                
                <ActionButton
                  className="center"
                  icon={<AimOutlined />}
                  onClick={handleCalculateCenter}
                  disabled={!isDrawing || polygonCoords.length < 3 || polygonCenter !== null}
                >
                  {polygonCenter ? 'Центр установлен' : 'Установить центр'}
                </ActionButton>
                
                <ActionButton
                  icon={<SaveOutlined />}
                  onClick={handleFinishDrawing}
                  disabled={!isDrawing}
                  loading={isLoading}
                >
                  Finish drawing
                </ActionButton>
              </Space>
            </ControlSection>

            <Divider />

            <ControlSection>
              <div className="section-title">
                <EditOutlined /> Editing
              </div>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <ActionButton
                  icon={<EditOutlined />}
                  onClick={handleStartEditing}
                  disabled={isEditing || isDrawing || !selectedPolygonId}
                >
                  Start editing
                </ActionButton>
                
                <ActionButton
                  icon={<SaveOutlined />}
                  onClick={handleFinishEditing}
                  disabled={!isEditing}
                >
                  Finish editing
                </ActionButton>
                <ActionButton
                  icon={<Trash2Icon/>}
                  onClick={handleDeletePolygon}
                  disabled={!isEditing}
                >
                  Delete Polygon
                </ActionButton>
                {/* ✅ Checkbox */}
                {selectedPolygon && (
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      checked={selectedPolygon?.is_active ?? true}
                      onChange={(e) => {
                        const isActive = e.target.checked;
                        setPolygons((prev) =>
                          prev.map((poly) =>
                            poly.id === selectedPolygonId
                              ? { ...poly, is_active: isActive }
                              : poly
                          )
                        );
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />

                    <label className="ml-2 text-sm text-gray-700">
                      Is Active?
                    </label>
                  </div>
                )}

                <StyledSelect
                  placeholder="Выберите полигон"
                  onChange={(id) => setSelectedPolygonId(id)}
                  options={polygons.map((poly) => ({
                    value: poly.id,
                    label: poly.name
                  }))}
                />
              </Space>
            </ControlSection>

            {polygons.length > 0 && (
              <>
                <Divider />
                <ControlSection>
                  <div className="section-title">
                    📋 Created zones ({polygons.length})
                  </div>
                  <div>
                    {polygons.map((poly) => (
                      <Polygon
                        key={poly.id}
                        geometry={[poly.boundary_coordinates]} // poly.coords emas!
                        options={{
                          fillColor: poly.color,
                          strokeColor:
                            poly.id === selectedPolygonId && isEditing
                              ? "#FF0000"
                              : "#0000FF",
                          opacity: 0.5,
                          strokeWidth: 5,
                          strokeStyle: "shortdash",
                          interactivityModel: "default#transparent"
                        }}
                      />
                    ))}
                  </div>
                </ControlSection>
              </>
            )}
          </Sidebar>

          <MapContainer>
            <StyledMap
              defaultState={{
                center: CENTER,
                zoom: ZOOM,
                controls: []
              }}
              onClick={(e: IMapClickEvent) => handleClickMap(e)}
              onLoad={() => setMapLoaded(true)} // Map yuklanganda
              options={{
                suppressMapOpenBlock: true,
              }}
            >
              {/* Map Controls */}
              <SearchControl 
                options={{ 
                  position: { right: 10, top: 10 },
                  float: 'right',
                  floatIndex: 100,
                  size: "large",
                  noPlacemark: true
                }} 
              />
              <ZoomControl 
                options={{ 
                  position: { left: 10, bottom: 350 }, // pastroqqa tushiradi
                  size: "large" // kattaroq qiladi
                }} 
              />
              <GeolocationControl 
                options={{ 
                  float: 'left',
                  floatIndex: 100 
                }} 
              />

              {isDrawing && polygonCoords.length > 0 && (
                <Polygon
                  geometry={[polygonCoords]}
                  options={{
                    fillColor: polygonColor,
                    strokeColor: "#0000FF",
                    opacity: 0.5,
                    strokeWidth: 5,
                    strokeStyle: "shortdash"
                  }}
                />
              )}

              {mapLoaded && polygons.map((poly) => (
                <Polygon
                  key={poly.id}
                  geometry={[poly.boundary_coordinates]}
                  options={{
                    fillColor: poly.color,
                    strokeColor:
                      poly.id === selectedPolygonId && isEditing
                        ? "#FF0000"
                        : "#0000FF",
                    opacity: 0.5,
                    strokeWidth: 5,
                    strokeStyle: "shortdash",
                    interactivityModel: "default#transparent"
                  }}
                />
              ))}


              {mapLoaded && isDrawing &&
                polygonCoords.map((coord, index) => (
                  <Circle
                    key={index}
                    geometry={[coord, 15]}
                    options={{
                      fillColor: "#000000",
                      strokeColor: "#000000",
                      strokeWidth: 3,
                      draggable: false
                    }}
                  />
                ))}

              {/* Poligon markazi */}
              {mapLoaded && isDrawing && polygonCenter && (
                <Circle
                  geometry={[polygonCenter, 50]}
                  options={{
                    fillColor: "#FF0000",
                    strokeColor: "#FFFFFF",
                    strokeWidth: 4,
                    draggable: false
                  }}
                />
              )}

              {mapLoaded && isEditing &&
              selectedPolygon?.boundary_coordinates.map((coord, index) => ( // coords emas!
                <Circle
                  key={index}
                  geometry={[coord, 50]}
                  options={{
                    fillColor: "#0000FF",
                    strokeColor: "#FF0000",
                    strokeWidth: 3,
                    draggable: true
                  }}
                  onDrag={(e: IDragEvent) => handleDragPoint(index, e)}
                />
              ))}

              {mapLoaded && markerCoords && <Placemark geometry={markerCoords} />}
            </StyledMap>
          </MapContainer>
        </MapSection>

        <StyledModal
          title="🎨 Задайте имя и цвет полигона"
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => {
            setIsModalOpen(false);
            handleFinishDrawing();
          }}
        >
          <Input
            placeholder="Имя полигона"
            value={polygonName}
            onChange={(e) => setPolygonName(e.target.value)}
            style={{ 
              marginBottom: "10px",
              borderRadius: 8,
              height: 40 
            }}
          />
          <ColorPicker
            value={polygonColor}
            onChange={(e) => setPolygonColor(e.toHexString())}
            size="large"
          />
        </StyledModal>
      </ContentWrapper>
    </MainContainer>
  );
};

// Export qilinadigan component
export default function GeocodeMap() {
  return (
    <YMaps query={{ apikey: "480bd99f-58bd-473b-8e54-0972e1fadefa", lang: "en_US" }}>
      <GeocodeMapComponent />
    </YMaps>
  );
}
