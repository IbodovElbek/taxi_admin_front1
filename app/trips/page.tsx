'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function TripsPage() {
  // Form states
  const [customerPhone, setCustomerPhone] = useState('');
  const [regionId, setRegionId] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [estimatedDistance, setEstimatedDistance] = useState('');

  // Data states
  const [regions, setRegions] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fetchingTrips, setFetchingTrips] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);

  // 🔹 Toast helper
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // 🔹 Fetch regions, services & trips
  useEffect(() => {
    fetchInitialData();
    fetchTrips();
  }, []);

 const fetchInitialData = async () => {
  try {
    console.log('🔍 Fetching regions and services...');
    
    const [regionsData] = await Promise.all([
      api.getRegions(),
      
    ]);

    console.log('✅ Regions received:', regionsData);

    const servicesData=[{
      "id":1,
      "name":"Economy"
    },
  {
      "id":2,
      "name":"Buisness"
    },
  {
      "id":3,
      "name":"Premium"
    },]
    setRegions(regionsData || []);
    setServices(servicesData || []);
    
    if (servicesData?.length > 0) {
      setServiceTypeId(servicesData[0].id.toString());
    }
  } catch (err: any) {
    console.error('❌ Fetch error:', err);
    showToast('error', err?.message || 'Failed to load regions or services');
  }
};

  const fetchTrips = async () => {
    try {
      setFetchingTrips(true);
      const tripsData = await api.getAllAdminTrips({ limit: 20, offset: 0 });
      setTrips(tripsData || []);
    } catch (err: any) {
      console.error('Trips fetch error:', err);
      showToast('error', err?.message || 'Failed to load trips');
    } finally {
      setFetchingTrips(false);
    }
  };

  // 🔹 Auto-fill pickup address
  useEffect(() => {
    const selectedRegion = regions.find((r) => r.id === Number(regionId));
    setPickupAddress(selectedRegion ? selectedRegion.name : '');
  }, [regionId, regions]);

  // 🔹 Validation
  const canSubmit = () =>
    customerPhone.trim() &&
    regionId &&
    pickupAddress.trim() &&
    destinationAddress.trim() &&
    serviceTypeId &&
    !loading;

  // 🔹 Create Manual Trip
  const handleSubmit = async () => {
    if (!canSubmit()) return;
    
    setLoading(true);
    try {
      const payload = {
        customer_phone: customerPhone.trim(),
        region_id: Number(regionId),
        pickup_address: pickupAddress.trim(),
        destination_address: destinationAddress.trim(),
        service_type_id: Number(serviceTypeId),
        admin_notes: adminNotes.trim() || undefined,
        estimated_distance_km: estimatedDistance ? Number(estimatedDistance) : undefined,
      };

      const response = await api.createManualTrip(payload);
      
      showToast('success', response.message || 'Trip successfully created!');
      
      // Reset form
      setCustomerPhone('');
      setRegionId('');
      setPickupAddress('');
      setDestinationAddress('');
      setAdminNotes('');
      setEstimatedDistance('');
      if (services.length > 0) setServiceTypeId(services[0].id.toString());

      // Refresh trip list
      await fetchTrips();
    } catch (err: any) {
      console.error('Create trip error:', err);
      const msg = err?.message || 'Failed to create trip';
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 View Trip Details
  const handleViewTrip = async (tripId: number) => {
    try {
      const tripDetails = await api.getTripById(tripId);
      setSelectedTrip(tripDetails);
      setShowTripDetails(true);
    } catch (err: any) {
      console.error('Get trip details error:', err);
      showToast('error', err?.message || 'Failed to load trip details');
    }
  };

  // 🔹 Format Date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // 🔹 Get Status Badge Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />
        <main className="pt-20 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Title */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Trip Request</h1>
                <p className="text-gray-600">Manually create and view trip requests</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100 space-y-6 mb-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+998901234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full p-3 border border-gray-300 appearance-none  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter destination address"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={serviceTypeId}
                  onChange={(e) => setServiceTypeId(e.target.value)}
                  className="w-full p-3 border border-gray-300 appearance-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                   <option value="">Select service Type</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Distance (km) - Optional
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={estimatedDistance}
                  onChange={(e) => setEstimatedDistance(e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes (optional)</label>
                <textarea
                  placeholder="Enter any notes for the driver"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                  className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors ${
                    canSubmit() ? 'bg-[#1E2A38] hover:bg-opacity-90' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {loading && (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25"></circle>
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="opacity-75"
                      ></path>
                    </svg>
                  )}
                  <span>Request Trip</span>
                </button>
              </div>
            </div>

            {/* 🔹 Trips Table */}
            <div className="bg-white rounded-[12px] p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Trips</h2>

              {fetchingTrips ? (
                <div className="text-center text-gray-500 py-8">Loading trips...</div>
              ) : trips.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No trips found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="p-3 border-b text-left">ID</th>
                        <th className="p-3 border-b text-left">Customer</th>
                        <th className="p-3 border-b text-left">Pickup</th>
                        <th className="p-3 border-b text-left">Destination</th>
                        <th className="p-3 border-b text-left">Service</th>
                        <th className="p-3 border-b text-left">Status</th>
                        <th className="p-3 border-b text-left">Created At</th>
                        <th className="p-3 border-b text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-gray-50">
                          <td className="p-3 border-b font-medium">{trip.id}</td>
                          <td className="p-3 border-b">{trip.customer_phone}</td>
                          <td className="p-3 border-b max-w-[150px] truncate">{trip.pickup_address}</td>
                          <td className="p-3 border-b max-w-[150px] truncate">{trip.destination_address}</td>
                          <td className="p-3 border-b">{trip.service_type?.name || '-'}</td>
                          <td className="p-3 border-b">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(trip.status)}`}>
                              {trip.status || 'unknown'}
                            </span>
                          </td>
                          <td className="p-3 border-b text-gray-600">
                            {formatDate(trip.created_at)}
                          </td>
                          <td className="p-3 border-b text-center">
                            <button
                              onClick={() => handleViewTrip(trip.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Trip Details Modal */}
        {showTripDetails && selectedTrip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[12px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Trip Details - #{selectedTrip.id}</h3>
                <button
                  onClick={() => setShowTripDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Trip Number</p>
                    <p className="font-medium">{selectedTrip.trip_number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedTrip.status)}`}>
                      {selectedTrip.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer Phone</p>
                    <p className="font-medium">{selectedTrip.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="font-medium">{selectedTrip.service_type?.name || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Pickup Address</p>
                    <p className="font-medium">{selectedTrip.pickup_address}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Destination Address</p>
                    <p className="font-medium">{selectedTrip.destination_address}</p>
                  </div>
                  {selectedTrip.admin_notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Admin Notes</p>
                      <p className="font-medium">{selectedTrip.admin_notes}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Estimated Distance</p>
                    <p className="font-medium">{selectedTrip.estimated_distance_km ? `${selectedTrip.estimated_distance_km} km` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Actual Distance</p>
                    <p className="font-medium">{selectedTrip.actual_distance_km ? `${selectedTrip.actual_distance_km} km` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Fare</p>
                    <p className="font-medium">{selectedTrip.total_fare ? `$${selectedTrip.total_fare}` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Commission</p>
                    <p className="font-medium">{selectedTrip.commission_amount ? `$${selectedTrip.commission_amount}` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">{formatDate(selectedTrip.created_at)}</p>
                  </div>
                  {selectedTrip.completed_at && (
                    <div>
                      <p className="text-sm text-gray-500">Completed At</p>
                      <p className="font-medium">{formatDate(selectedTrip.completed_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div
            className={`fixed right-6 top-6 z-50 p-4 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="font-medium">{toast.message}</div>
              <button onClick={() => setToast(null)} className="ml-3 opacity-80 hover:opacity-100">
                ✕
              </button>
            </div>
          </div>
        )}
         <footer className="mt-12 lg:mt-16 bg-white rounded-xl shadow-sm border border-gray-100 mx-6">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FFD100] rounded-lg flex items-center justify-center">
                  <i className="ri-taxi-fill text-[#1E2A38] text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 font-['Pacifico']">
                  TaxiGo
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Professional taxi xizmati boshqaruv tizimi. Har bir sayohatni
                oson va xavfsiz boshqaring.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                Tezkor Havolalar
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                  >
                    Sayohatlar
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                  >
                    Haydovchilar
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                  >
                    Foydalanuvchilar
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                  >
                    Hisobotlar
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                Qollab-quvvatlash
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                  >
                    Yordam markazi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                  >
                    API Hujjatlari
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                  >
                    Texnik qo\'llab-quvvatlash
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                  >
                    Bog\'lanish
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Aloqa</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <i className="ri-phone-line text-gray-500"></i>
                  <span className="text-gray-600">+998 71 234-56-78</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-mail-line text-gray-500"></i>
                  <span className="text-gray-600">admin@taxigo.uz</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-map-pin-line text-gray-500"></i>
                  <span className="text-gray-600">Toshkent, O\'zbekiston</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 lg:mt-8 pt-4 lg:pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              2024 <span className="font-[\'Pacifico\']">TaxiGo</span> Admin
              Panel. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-gray-500 hover:text-[#1E2A38] transition-colors"
              >
                <i className="ri-facebook-line text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#1E2A38] transition-colors"
              >
                <i className="ri-twitter-line text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#1E2A38] transition-colors"
              >
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#1E2A38] transition-colors"
              >
                <i className="ri-telegram-line text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
      
    </div>
    
  );
}