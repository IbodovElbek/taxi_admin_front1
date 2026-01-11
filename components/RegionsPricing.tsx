import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, MapPin, DollarSign, Clock } from 'lucide-react';
import { api } from "../api";
import { RegionPricingResponse, Regions, ServiceType } from '@/app/types/types';

export default function TaxiPricingAdmin() {
  const [regions, setRegions] = useState<Regions[]>([]);

  const [serviceTypeId, setserviceTypeId] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Regions | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isnull, setIsnull] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [regionData, setRegionData] = useState<RegionPricingResponse | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);

  const [formData, setFormData] = useState({
    region_id: 0,
    service_type_id: 1,
    base_fare: 5000,
    per_km_rate: 2000,
    per_minute_rate: 500,
    minimum_fare: 8000,
    peak_hours_multiplier: 1.2,
    peak_hours_start: "07:00",
    peak_hours_end: "09:00",
    peak_hours_evening_start: "17:00",
    peak_hours_evening_end: "19:00",
    night_multiplier: 1.5,
    weekend_multiplier: 1.1
  });

  // Mock regions data - bu yerda API dan kelishi kerak
  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      const regions = await api.getAdminRegions();
      setRegions(regions.regions);
    } catch (error) {
      console.error("Failed to load regions:", error);
    }
  }
  const handleRegionSelect = async (region: Regions) => {
    setFormData({
      region_id: region.id,
      service_type_id: 0,
      base_fare: 0,
      per_km_rate: 0,
      per_minute_rate: 0,
      minimum_fare: 0,
      peak_hours_multiplier: 0,
      peak_hours_start: "07:00",
      peak_hours_end: "09:00",
      peak_hours_evening_start: "17:00",
      peak_hours_evening_end: "19:00",
      night_multiplier: 1.2,
      weekend_multiplier: 1.4
    });
    setSelectedRegion(region);
    setSuccess(false);
    setError('');
    setLoading(true);

    try {
      const data = await api.getAdminRegionPricings(region.id);

      console.log('API dan kelgan ma\'lumot:', data); // Debug uchun
      setRegionData(data);
      setServices(data.services || []);

      const defaultPricing = data.pricings && data.pricings.length > 0
        ? data.pricings[0]
        : null;
      if (data.pricings[0] === undefined) {
        setIsnull(true);
      }
      if (defaultPricing) {
        setFormData({
          region_id: region.id,
          service_type_id: defaultPricing.service_type_id,
          base_fare: defaultPricing.base_fare,
          per_km_rate: defaultPricing.per_km_rate,
          per_minute_rate: defaultPricing.per_minute_rate,
          minimum_fare: defaultPricing.minimum_fare,
          peak_hours_multiplier: defaultPricing.peak_hours_multiplier,
          peak_hours_start: defaultPricing.peak_hours_start,
          peak_hours_end: defaultPricing.peak_hours_end,
          peak_hours_evening_start: defaultPricing.peak_hours_evening_start,
          peak_hours_evening_end: defaultPricing.peak_hours_evening_end,
          night_multiplier: defaultPricing.night_multiplier,
          weekend_multiplier: defaultPricing.weekend_multiplier
        });
        setIsnull(false);
      }
    } catch (err) {
      setError('Region ma\'lumotlarini yuklashda xatolik yuz berdi');
      console.error('API xatoligi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceTypeId = parseInt(e.target.value);
    setserviceTypeId(serviceTypeId);

    // Tanlangan service type uchun pricing ma'lumotlarini topish
    const selectedPricing = regionData?.services.find(p => p.id === serviceTypeId);
    const selectedPricing2 = regionData?.pricings.find(p => p.service_type_id === Number(serviceTypeId));

    console.log('Tanlangan service type ID:', serviceTypeId);
    console.log('Topilgan pricing ma\'lumotlari:', selectedPricing2);

    if (selectedPricing) {
      setIsnull(selectedPricing2 === null);
      setFormData(prev => ({
        ...prev,
        service_type_id: serviceTypeId,
        base_fare: selectedPricing2?.base_fare ?? 0,
        per_km_rate: selectedPricing2?.per_km_rate ?? 0,
        per_minute_rate: selectedPricing2?.per_minute_rate ?? 0,
        minimum_fare: selectedPricing2?.minimum_fare ?? 0,
        peak_hours_multiplier: selectedPricing2?.peak_hours_multiplier ?? 1,
        peak_hours_start: selectedPricing2?.peak_hours_start ?? "",
        peak_hours_end: selectedPricing2?.peak_hours_end ?? "",
        peak_hours_evening_start: selectedPricing2?.peak_hours_evening_start ?? "",
        peak_hours_evening_end: selectedPricing2?.peak_hours_evening_end ?? "",
        night_multiplier: selectedPricing2?.night_multiplier ?? 1,
        weekend_multiplier: selectedPricing2?.weekend_multiplier ?? 1,
      }));
    }
  };


  const handleInputChange = (e: { target: { name: any; value: any; type: any; }; }) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Bu yerda API ga so'rov yuboriladi
      console.log('Yuborilayotgan ma\'lumot:', formData);

      // Mock API call
      const response = await api.adminCreateRegionPricing(formData);
      console.log('API javobi:', response);
      setResponse(response.message);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(`${err}`);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Bu yerda API ga so'rov yuboriladi
      console.log('Yuborilayotgan ma\'lumot:', formData);

      // Mock API call
      const response = await api.adminUpdateRegionPricing(formData);
      console.log('API javobi:', response);
      setResponse(response.message);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(`${err}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white rounded-lg">
      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Regions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="mr-2 text-blue-600" size={24} />
                Regionlar
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionSelect(region)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedRegion?.id === region.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{region.name}</h3>
                        <p className="text-sm text-gray-600">{region.city}</p>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: region.color }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {!selectedRegion ? (
                <div className="text-center py-12">
                  <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 text-lg">
                    Narx belgilash uchun regionni tanlang
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {selectedRegion.name} - Narx sozlamalari
                  </h2>
                  {/* Success Message */}
                  {response && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      {response}
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                      <AlertCircle className="mr-2" size={20} />
                      {error}
                    </div>
                  )}

                  {/* Service Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xizmat turi
                    </label>
                    <select
                      name="service_type_id"
                      value={formData.service_type_id}
                      onChange={handleServiceTypeChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!services || services.length === 0}
                    >
                      {services && services.length > 0 ? (
                        services.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))
                      ) : (
                        <option value="">Xizmat turlari yuklanmoqda...</option>
                      )}
                    </select>
                  </div>

                  {/* Base Pricing */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="mr-2 text-blue-600" size={20} />
                      Asosiy narxlar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Boshlang'ich narx (so'm)
                        </label>
                        <input
                          type="number"
                          name="base_fare"
                          value={formData.base_fare}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimal narx (so'm)
                        </label>
                        <input
                          type="number"
                          name="minimum_fare"
                          value={formData.minimum_fare}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Km uchun narx (so'm)
                        </label>
                        <input
                          type="number"
                          name="per_km_rate"
                          value={formData.per_km_rate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daqiqa uchun narx (so'm)
                        </label>
                        <input
                          type="number"
                          name="per_minute_rate"
                          value={formData.per_minute_rate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Peak Hours */}
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock className="mr-2 text-amber-600" size={20} />
                      Rush soat sozlamalari
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ertalabki boshlanish
                        </label>
                        <input
                          type="time"
                          name="peak_hours_start"
                          value={formData.peak_hours_start}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ertalabki tugash
                        </label>
                        <input
                          type="time"
                          name="peak_hours_end"
                          value={formData.peak_hours_end}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kechki boshlanish
                        </label>
                        <input
                          type="time"
                          name="peak_hours_evening_start"
                          value={formData.peak_hours_evening_start}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kechki tugash
                        </label>
                        <input
                          type="time"
                          name="peak_hours_evening_end"
                          value={formData.peak_hours_evening_end}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rush soat koeffitsienti
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="peak_hours_multiplier"
                        value={formData.peak_hours_multiplier}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Multipliers */}
                  <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-4">
                      Qo'shimcha koeffitsientlar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tungi koeffitsient
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="night_multiplier"
                          value={formData.night_multiplier}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dam olish koeffitsienti
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="weekend_multiplier"
                          value={formData.weekend_multiplier}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={isnull ? handleSubmit : handleUpdateSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saqlanmoqda...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={20} />
                        {isnull ? "Narxlarni saqlash" : "Narxlarni yangilash"}
                      </>

                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}