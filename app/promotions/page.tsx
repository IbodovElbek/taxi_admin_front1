'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

const promotionsData = [
  {
    id: 'P001',
    name: 'Yangi Foydalanuvchilar Uchun',
    code: 'YANGI50',
    discountType: 'percentage',
    discountValue: 50,
    minAmount: '10000',
    maxDiscount: '25000',
    usageLimit: 1000,
    used: 245,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: 'Birinchi sayohatga 50% chegirma'
  },
  {
    id: 'P002',
    name: 'Hafta Oxiri Aksiyasi',
    code: 'WEEKEND20',
    discountType: 'percentage',
    discountValue: 20,
    minAmount: '15000',
    maxDiscount: '15000',
    usageLimit: 500,
    used: 156,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    description: 'Shanba va yakshanba kunlari 20% chegirma'
  },
  {
    id: 'P003',
    name: 'Bahor Festivali',
    code: 'BAHOR2024',
    discountType: 'fixed',
    discountValue: 5000,
    minAmount: '20000',
    maxDiscount: '5000',
    usageLimit: 2000,
    used: 1890,
    status: 'expired',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    description: 'Bahor bayramiga maxsus 5000 so\'m chegirma'
  },
  {
    id: 'P004',
    name: 'Premium Foydalanuvchilar',
    code: 'PREMIUM30',
    discountType: 'percentage',
    discountValue: 30,
    minAmount: '25000',
    maxDiscount: '20000',
    usageLimit: 100,
    used: 45,
    status: 'paused',
    startDate: '2024-01-10',
    endDate: '2024-06-10',
    description: 'Premium foydalanuvchilar uchun 30% chegirma'
  }
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(promotionsData);
  const [showCreatePromo, setShowCreatePromo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPromotions = promotions.filter(promo => {
    const matchesFilter = filterStatus === 'all' || promo.status === filterStatus;
    const matchesSearch = promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-red-100 text-red-700'
    };
    
    const labels = {
      active: 'Faol',
      paused: 'To\'xtatilgan',
      expired: 'Muddati o\'tgan'
    };
    
    return { 
      style: styles[status as keyof typeof styles] || styles.active,
      label: labels[status as keyof typeof labels] || status
    };
  };

  const togglePromoStatus = (promoId: string, newStatus: string) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === promoId ? {...promo, status: newStatus} : promo
    ));
  };

  const handleCreatePromo = (promoData: any) => {
    const newPromo = {
      id: `P${String(promotions.length + 1).padStart(3, '0')}`,
      ...promoData,
      used: 0,
      status: 'active'
    };
    setPromotions(prev => [...prev, newPromo]);
    setShowCreatePromo(false);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />
        <main className="pt-20 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Aksiyalar va Chegirmalar</h1>
                <p className="text-gray-600">Aksiyalarni boshqaring va yangi chegirma kodlari yarating</p>
              </div>
              <button 
                onClick={() => setShowCreatePromo(true)}
                className="bg-[#1E2A38] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-add-line"></i>
                </div>
                Yangi Aksiya
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-coupon-line text-green-600 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{promotions.filter(p => p.status === 'active').length}</p>
                    <p className="text-sm text-gray-600">Faol Aksiyalar</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-price-tag-line text-blue-600 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{promotions.reduce((sum, p) => sum + p.used, 0)}</p>
                    <p className="text-sm text-gray-600">Jami Foydalanilgan</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-pause-line text-yellow-600 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{promotions.filter(p => p.status === 'paused').length}</p>
                    <p className="text-sm text-gray-600">To'xtatilgan</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-time-line text-red-600 text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{promotions.filter(p => p.status === 'expired').length}</p>
                    <p className="text-sm text-gray-600">Muddati O'tgan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {['all', 'active', 'paused', 'expired'].map((status) => (
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
                       status === 'active' ? 'Faol' :
                       status === 'paused' ? 'To\'xtatilgan' : 'Muddati o\'tgan'}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Aksiya nomi yoki kodi qidirish..."
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

            {/* Promotions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPromotions.map((promo) => {
                const statusBadge = getStatusBadge(promo.status);
                const usagePercent = getUsagePercentage(promo.used, promo.usageLimit);
                return (
                  <div key={promo.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{promo.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{promo.description}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-mono text-sm">
                            {promo.code}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.style}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#FFD100]">
                          {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `${promo.discountValue.toLocaleString()} so'm`}
                        </div>
                      </div>
                    </div>

                    {/* Usage Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Foydalanish</span>
                        <span className="text-sm font-medium text-gray-800">{promo.used} / {promo.usageLimit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#00C853] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{usagePercent}% ishlatilgan</span>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Minimal summa:</span>
                        <p className="font-medium text-gray-800">{parseInt(promo.minAmount).toLocaleString()} so'm</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Maksimal chegirma:</span>
                        <p className="font-medium text-gray-800">{parseInt(promo.maxDiscount).toLocaleString()} so'm</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Boshlanish:</span>
                        <p className="font-medium text-gray-800">{promo.startDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tugash:</span>
                        <p className="font-medium text-gray-800">{promo.endDate}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-[#F4F6F8] text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap">
                        Tahrirlash
                      </button>
                      {promo.status === 'active' ? (
                        <button 
                          onClick={() => togglePromoStatus(promo.id, 'paused')}
                          className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          To'xtatish
                        </button>
                      ) : promo.status === 'paused' ? (
                        <button 
                          onClick={() => togglePromoStatus(promo.id, 'active')}
                          className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Faollashtirish
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Create Promotion Modal */}
      {showCreatePromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Yangi Aksiya Yaratish</h3>
              <button 
                onClick={() => setShowCreatePromo(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-close-line text-gray-500"></i>
                </div>
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const promoData = {
                name: formData.get('name'),
                code: formData.get('code'),
                description: formData.get('description'),
                discountType: formData.get('discountType'),
                discountValue: parseInt(formData.get('discountValue') as string),
                minAmount: formData.get('minAmount'),
                maxDiscount: formData.get('maxDiscount'),
                usageLimit: parseInt(formData.get('usageLimit') as string),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate')
              };
              handleCreatePromo(promoData);
            }}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aksiya nomi</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Masalan: Yangi foydalanuvchilar uchun"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aksiya kodi</label>
                    <input 
                      type="text" 
                      name="code"
                      required
                      placeholder="YANGI50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
                  <textarea 
                    name="description"
                    placeholder="Aksiya haqida qisqacha ma'lumot"
                    className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chegirma turi</label>
                    <select 
                      name="discountType"
                      className="w-full p-3 border border-gray-300 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Foiz (%)</option>
                      <option value="fixed">Aniq summa (so'm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chegirma miqdori</label>
                    <input 
                      type="number" 
                      name="discountValue"
                      required
                      placeholder="50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foydalanish limiti</label>
                    <input 
                      type="number" 
                      name="usageLimit"
                      required
                      placeholder="1000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimal summa (so'm)</label>
                    <input 
                      type="number" 
                      name="minAmount"
                      placeholder="10000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maksimal chegirma (so'm)</label>
                    <input 
                      type="number" 
                      name="maxDiscount"
                      placeholder="25000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Boshlanish sanasi</label>
                    <input 
                      type="date" 
                      name="startDate"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tugash sanasi</label>
                    <input 
                      type="date" 
                      name="endDate"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button 
                  type="submit"
                  className="flex-1 bg-[#1E2A38] text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                >
                  Aksiya Yaratish
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreatePromo(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors whitespace-nowrap"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}