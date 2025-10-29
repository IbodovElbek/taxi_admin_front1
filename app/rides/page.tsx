'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

const ridesData = [
  {
    id: 'R001',
    rider: 'Ahmad Karimov',
    driver: 'Jasur Toshev',
    pickup: 'Toshkent shahri, Amir Temur ko\'chasi',
    dropoff: 'Yunusobod tumani, Bog\'ishamol ko\'chasi',
    fare: '15,000',
    status: 'completed',
    date: '2024-01-15 14:30',
    type: 'Standard'
  },
  {
    id: 'R002',
    rider: 'Malika Saidova',
    driver: 'Bobur Rahmonov',
    pickup: 'Mirzo Ulug\'bek tumani, Universitet ko\'chasi',
    dropoff: 'Chilonzor tumani, Bunyodkor ko\'chasi',
    fare: '22,000',
    status: 'in-progress',
    date: '2024-01-15 15:45',
    type: 'Comfort'
  },
  {
    id: 'R003',
    rider: 'Dilshod Ergashev',
    driver: 'Otabek Nazarov',
    pickup: 'Shayxontohur tumani, Navoi ko\'chasi',
    dropoff: 'Sergeli tumani, Qatortol ko\'chasi',
    fare: '35,000',
    status: 'cancelled',
    date: '2024-01-15 12:15',
    type: 'Business'
  },
  {
    id: 'R004',
    rider: 'Nigora Abdullayeva',
    driver: 'Sanjar Umarov',
    pickup: 'Olmazor tumani, Fairuz ko\'chasi',
    dropoff: 'Yakkasaroy tumani, Pushkin ko\'chasi',
    fare: '18,000',
    status: 'pending',
    date: '2024-01-15 16:00',
    type: 'Standard'
  },
  {
    id: 'R005',
    rider: 'Bekzod Qodirov',
    driver: 'Aziz Jurayev',
    pickup: 'Bektemir tumani, Zulfiyaxonim ko\'chasi',
    dropoff: 'Mirobod tumani, Abdulla Qodiriy ko\'chasi',
    fare: '28,000',
    status: 'completed',
    date: '2024-01-15 11:20',
    type: 'Comfort'
  }
];

export default function RidesPage() {
  const [rides, setRides] = useState(ridesData);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  const filteredRides = rides.filter(ride => {
    const matchesFilter = filterStatus === 'all' || ride.status === filterStatus;
    const matchesSearch = ride.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    
    const labels = {
      completed: 'Yakunlangan',
      'in-progress': 'Jarayonda',
      pending: 'Kutilmoqda',
      cancelled: 'Bekor qilingan'
    };
    
    return { 
      style: styles[status as keyof typeof styles] || styles.pending,
      label: labels[status as keyof typeof labels] || status
    };
  };

  const handleCancelRide = (rideId: string) => {
    setRides(prev => prev.map(ride => 
      ride.id === rideId ? {...ride, status: 'cancelled'} : ride
    ));
  };

  const handleViewDetails = (ride: any) => {
    setSelectedRide(ride);
    setShowRideDetails(true);
  };

  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />
        <main className="pt-20 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Sayohatlar Boshqaruvi</h1>
              <p className="text-gray-600">Barcha sayohatlarni boshqaring va kuzatib boring</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        filterStatus === status
                          ? 'bg-[#1E2A38] text-white'
                          : 'bg-[#F4F6F8] text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? 'Barchasi' : 
                       status === 'pending' ? 'Kutilmoqda' :
                       status === 'in-progress' ? 'Jarayonda' :
                       status === 'completed' ? 'Yakunlangan' : 'Bekor qilingan'}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Sayohat, haydovchi yoki yo'lovchi qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-2 pl-10 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <div className="w-5 h-5 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                    <i className="ri-search-line text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Rides Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F4F6F8]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Sayohat ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Yo'lovchi</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Haydovchi</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Yo'nalish</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Narx</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Holati</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRides.map((ride) => {
                      const statusBadge = getStatusBadge(ride.status);
                      return (
                        <tr key={ride.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-800">{ride.id}</div>
                            <div className="text-sm text-gray-500">{ride.date}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{ride.rider}</div>
                            <div className="text-sm text-gray-500">{ride.type}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{ride.driver}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-800 max-w-xs truncate">{ride.pickup}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">→ {ride.dropoff}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-800">{ride.fare} so'm</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.style}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleViewDetails(ride)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-eye-line"></i>
                                </div>
                              </button>
                              {ride.status === 'in-progress' && (
                                <button 
                                  onClick={() => handleCancelRide(ride.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <i className="ri-close-line"></i>
                                  </div>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

           <footer className="mt-12 lg:mt-16 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FFD100] rounded-lg flex items-center justify-center">
                      <i className="ri-taxi-fill text-[#1E2A38] text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 font-['Pacifico']">TaxiGo</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Professional taxi xizmati boshqaruv tizimi. Har bir sayohatni oson va xavfsiz boshqaring.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Tezkor Havolalar</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-[#1E2A38] transition-colors">Sayohatlar</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#1E2A38] transition-colors">Haydovchilar</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#1E2A38] transition-colors">Foydalanuvchilar</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#1E2A38] transition-colors">Hisobotlar</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Qo'llab-quvvatlash</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-[#1E2A38] transition-colors">Yordam markazi</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#1E2A38] transition-colors">API Hujjatlari</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#1E2A38] transition-colors">Texnik qo'llab-quvvatlash</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-[#1E2A38] transition-colors">Bog'lanish</a></li>
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
                      <span className="text-gray-600">shohjaxon@taxigo.uz</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-map-pin-line text-gray-500"></i>
                      <span className="text-gray-600">Toshkent, O'zbekiston</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 lg:mt-8 pt-4 lg:pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm text-center md:text-left">
                  2024 <span className="font-[`Pacifico`]">TaxiGo</span> Admin Panel. Barcha huquqlar himoyalangan.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-gray-500 hover:text-[#1E2A38] transition-colors">
                    <i className="ri-facebook-line text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#1E2A38] transition-colors">
                    <i className="ri-twitter-line text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#1E2A38] transition-colors">
                    <i className="ri-instagram-line text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#1E2A38] transition-colors">
                    <i className="ri-telegram-line text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      

      {/* Ride Details Modal */}
      {showRideDetails && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Sayohat Tafsilotlari</h3>
              <button 
                onClick={() => setShowRideDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-close-line text-gray-500"></i>
                </div>
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Sayohat Ma'lumotlari</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Sayohat ID:</span>
                      <p className="font-medium">{(selectedRide as any).id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Sana va Vaqt:</span>
                      <p className="font-medium">{(selectedRide as any).date}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Sayohat Turi:</span>
                      <p className="font-medium">{(selectedRide as any).type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Holati:</span>
                      <p className="font-medium">{getStatusBadge((selectedRide as any).status).label}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">To'lov Ma'lumotlari</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Narx:</span>
                      <p className="font-medium text-lg">{(selectedRide as any).fare} so'm</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">To'lov usuli:</span>
                      <p className="font-medium">Naqd</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Yo'nalish</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 font-medium">Boshlang'ich nuqta</p>
                      <p className="text-gray-800">{(selectedRide as any).pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-red-700 font-medium">Yakuniy nuqta</p>
                      <p className="text-gray-800">{(selectedRide as any).dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Yo'lovchi</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{(selectedRide as any).rider}</p>
                    <p className="text-sm text-gray-500">Telefon: +998 90 123 45 67</p>
                    <p className="text-sm text-gray-500">Reyting: 4.8 ⭐</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Haydovchi</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{(selectedRide as any).driver}</p>
                    <p className="text-sm text-gray-500">Telefon: +998 91 234 56 78</p>
                    <p className="text-sm text-gray-500">Reyting: 4.9 ⭐</p>
                    <p className="text-sm text-gray-500">Mashina: Chevrolet Cobalt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}