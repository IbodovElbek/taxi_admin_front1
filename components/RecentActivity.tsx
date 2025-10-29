'use client';

import { useState, useEffect } from 'react';
import { api, Trip } from '../api';
import Swal from 'sweetalert2';
import { 
  RefreshCw, 
  Car, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Navigation,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical
} from 'lucide-react';

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export default function RecentActivity() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 3,
    totalItems: 0
  });

  useEffect(() => {
    loadRecentTrips();
  }, []);

  const loadRecentTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getRecentTrips(20); // Load more data for pagination
      
      let tripsData: Trip[] = [];
      
      if (Array.isArray(response)) {
        tripsData = response;
      } else if (response && response.trips && Array.isArray(response.trips)) {
        tripsData = response.trips;
      } else if (response && response.data && Array.isArray(response.data)) {
        tripsData = response.data;
      } else if (response && Array.isArray(response.results)) {
        tripsData = response.results;
      } else {
        console.error('Unexpected API response format:', response);
        throw new Error('Ma\'lumotlar noto\'g\'ri formatda keldi');
      }
      
      setTrips(tripsData);
      setPagination(prev => ({
        ...prev,
        totalItems: tripsData.length,
        currentPage: 1
      }));
    } catch (err) {
      console.error('Recent trips yuklashda xatolik:', err);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadRecentTrips();
    setRefreshing(false);
  };

  const getTripIcon = (status: Trip['status'], tripType: Trip['trip_type']) => {
    const iconClass = "w-5 h-5";
    
    if (status === 'completed') return <CheckCircle className={`${iconClass} text-green-600`} />;
    if (status === 'cancelled') return <XCircle className={`${iconClass} text-red-600`} />;
    if (status === 'in_progress') return <Car className={`${iconClass} text-blue-600`} />;
    if (status === 'pending') return <Clock className={`${iconClass} text-yellow-600`} />;
    return <Navigation className={`${iconClass} text-gray-600`} />;
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'in_progress':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: Trip['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return styles[status] || styles.pending;
  };

  const getStatusText = (status: Trip['status']) => {
    const statusTexts = {
      completed: 'Yakunlangan',
      in_progress: 'Jarayonda',
      cancelled: 'Bekor qilingan',
      pending: 'Kutilmoqda'
    };
    return statusTexts[status] || status;
  };

  const getTripTypeText = (tripType: Trip['trip_type']) => {
    const typeTexts = {
      point_to_point: 'Nuqtadan nuqtaga',
      rental: 'Ijaraga olish',
      delivery: 'Yetkazib berish'
    };
    return typeTexts[tripType] || tripType;
  };

  const getTripTypeIcon = (tripType: Trip['trip_type']) => {
    switch (tripType) {
      case 'point_to_point':
        return <Navigation className="w-4 h-4" />;
      case 'rental':
        return <Car className="w-4 h-4" />;
      case 'delivery':
        return <Package className="w-4 h-4" />;
      default:
        return <Navigation className="w-4 h-4" />;
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Hozir';
    if (diffInMinutes < 60) return `${diffInMinutes} daq oldin`;
    if (diffInHours < 24) return `${diffInHours} soat oldin`;
    if (diffInDays < 7) return `${diffInDays} kun oldin`;
    
    return date.toLocaleDateString('uz-UZ', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

 const showTripDetails = async (trip: Trip) => {
  try {
    const fullTripData = await api.getTripById(trip.id);
    
    // Ma'lumotlarni tekshirish va default qiymatlar berish
    const customer = fullTripData.customer || { name: 'Noma\'lum', phone: 'Noma\'lum' };
    const driver = fullTripData.driver || { name: 'Tayinlanmagan', phone: 'Noma\'lum', car_number: 'Noma\'lum' };
    
    const statusActions = trip.status === 'pending' || trip.status === 'in_progress' 
      ? `
        <div class="flex gap-3 justify-center mt-6 pt-4 border-t">
          <button id="completeTrip" class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Yakunlash
          </button>
          <button id="cancelTrip" class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            Bekor qilish
          </button>
        </div>
      ` : '';

    await Swal.fire({
      title: `<div class="flex items-center gap-3 text-gray-800">
        <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path>
        </svg>
        Safari #${trip.trip_number}
      </div>`,
      html: `
        <div class="text-left space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
          <!-- Customer & Driver Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                <h4 class="font-semibold text-blue-800">Mijoz ma'lumotlari</h4>
              </div>
              <div class="space-y-2">
                <p class="text-sm"><span class="font-medium text-gray-700">Ism:</span> <span class="text-gray-900">${customer.name}</span></p>
                <p class="text-sm"><span class="font-medium text-gray-700">Telefon:</span> <span class="text-blue-700 font-mono">${customer.phone}</span></p>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"></path>
                </svg>
                <h4 class="font-semibold text-green-800">Haydovchi ma'lumotlari</h4>
              </div>
              <div class="space-y-2">
                <p class="text-sm"><span class="font-medium text-gray-700">Ism:</span> <span class="text-gray-900">${driver.name}</span></p>
                <p class="text-sm"><span class="font-medium text-gray-700">Telefon:</span> <span class="text-green-700 font-mono">${driver.phone}</span></p>
                <p class="text-sm"><span class="font-medium text-gray-700">Mashina:</span> <span class="text-green-800 font-bold">${driver.car_number}</span></p>
              </div>
            </div>
          </div>
          
          <!-- Route Info -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <h4 class="font-semibold text-purple-800">Marshrut ma'lumotlari</h4>
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-xs font-medium text-gray-600 mb-1">Boshlang'ich nuqta</p>
                  <p class="text-sm text-gray-900">${fullTripData.pickup_address || 'Aniqlanmagan'}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-xs font-medium text-gray-600 mb-1">Maqsad</p>
                  <p class="text-sm text-gray-900">${fullTripData.destination_address || 'Aniqlanmagan'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Qolgan qismlar ham xuddi shunday... -->
          
          ${statusActions}
        </div>
        
        <style>
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        </style>
      `,
      // qolgan kodlar...
    });
  } catch (error) {
    console.error('Trip details error:', error); // Debug uchun
    Swal.fire({
      icon: 'error',
      title: 'Xatolik!',
      text: 'Safari ma\'lumotlarini yuklashda xatolik yuz berdi!',
      confirmButtonText: 'Yaxshi'
    });
  }
};

  // Pagination logic
  const getCurrentPageData = () => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return trips.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);
  const currentPageData = getCurrentPageData();

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const LoadingComponent = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">So'nggi Faoliyat</h3>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ErrorComponent = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">So'nggi Faoliyat</h3>
        <button 
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Qayta yuklash
        </button>
      </div>
      <div className="text-center py-12">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Xatolik yuz berdi</h4>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
        <button 
          onClick={refreshData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Qayta urinish
        </button>
      </div>
    </div>
  );

  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent />;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">So'nggi Faoliyat</h3>
              <p className="text-sm text-gray-600">{trips.length} ta safari mavjud</p>
            </div>
          </div>
          <button 
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Yangilash</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!Array.isArray(trips) || trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Faoliyat topilmadi</h4>
            <p className="text-gray-600 max-w-md mx-auto">
              Hozircha hech qanday safari faoliyati mavjud emas. Yangi safarilar paydo bo'lishi bilanoq bu yerda ko'rsatiladi.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {currentPageData.map((trip, index) => (
                <div 
                  key={trip.id} 
                  className="group relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-lg transform hover:scale-[1.02]"
                  onClick={() => showTripDetails(trip)}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${getStatusColor(trip.status)} shadow-sm group-hover:shadow-md transition-all duration-300`}>
                      {getTripIcon(trip.status, trip.trip_type)}
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                          Safari #{trip.trip_number}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(trip.status)}`}>
                          {getStatusText(trip.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{trip.customer.name}</span>
                        <span className="text-gray-400">→</span>
                        <MapPin className="w-4 h-4 flex-shrink-0 text-red-500" />
                      
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{getRelativeTime(trip.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTripTypeIcon(trip.trip_type)}
                          <span className="hidden sm:inline">{getTripTypeText(trip.trip_type)}</span>
                        </div>
                        {/* <div className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          <span className="font-mono">{trip.driver.car_number}</span>
                        </div> */}
                      </div>
                    </div>
                    
                    {/* Price & Actions */}
                    <div className="text-right flex-shrink-0 space-y-2">
                      {trip.total_fare && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 group-hover:text-blue-900">
                            {trip.total_fare.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">so'm</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-blue-600 font-medium">Batafsil</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effect Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {trips.length > pagination.itemsPerPage && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {pagination.itemsPerPage * (pagination.currentPage - 1) + 1}-{Math.min(pagination.itemsPerPage * pagination.currentPage, pagination.totalItems)} / {pagination.totalItems} ta safari
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        pagination.currentPage === i + 1
                          ? 'bg-gray-200  text-white shadow-sm'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}