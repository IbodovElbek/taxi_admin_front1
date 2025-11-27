'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { api } from '../../api';
import type { PaymentAnalyticsResponse, PaymentHistoryItem } from '../types/types';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('payments');
  const [paymentData, setPaymentData] = useState<PaymentAnalyticsResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Sana state'lari
  const [dateFrom, setDateFrom] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // 30 kun oldin
    return date.toISOString().split('T')[0];
  });
  
  const [dateTo, setDateTo] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0]; // Bugun
  });

  // Ma'lumotlarni yuklash
  useEffect(() => {
    if (dateFrom && dateTo) {
      loadData();
    }
  }, [dateFrom, dateTo]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching data with dates:', { dateFrom, dateTo });
      const data = await api.fetchPaymentAnalytics(dateFrom, dateTo);
      console.log('Received data:', data);
      
      setPaymentData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Xatolik yuz berdi';
      setError(errorMessage);
      console.error('Error loading data:', err);
      console.error('Date range:', { dateFrom, dateTo });
    } finally {
      setIsLoading(false);
    }
  };

  // Export funksiyasi
  const handleExport = async () => {
    if (!dateFrom || !dateTo) {
      setError('Iltimos, sana oralig\'ini tanlang');
      return;
    }

    try {
      setIsExporting(true);
      const blob = await api.exportPaymentAnalytics(dateFrom, dateTo);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-analytics-${dateFrom}-to-${dateTo}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Export qilishda xatolik yuz berdi');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Date From o'zgarishi
  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    // Agar dateTo dateFrom dan kichik bo'lsa, dateTo ni yangilash
    if (dateTo && value > dateTo) {
      setDateTo(value);
    }
  };

  // Date To o'zgarishi
  const handleDateToChange = (value: string) => {
    // Faqat dateFrom dan katta yoki teng bo'lsa qabul qilish
    if (value >= dateFrom) {
      setDateTo(value);
    } else {
      setError('Tugash sanasi boshlanish sanasidan kichik bo\'lmasligi kerak');
    }
  };

  // Tez sana tanlash funksiyalari
  const setQuickDate = (days: number) => {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - days);
    
    setDateFrom(fromDate.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  };

  // Qidiruv filtri
  const filteredPayments = paymentData?.payment_history.filter(payment => 
    payment.trip_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.service_type_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    };

    const labels = {
      completed: 'Yakunlangan',
      pending: 'Kutilmoqda',
      failed: 'Muvaffaqiyatsiz',
      refunded: 'Qaytarilgan'
    };

    return { 
      style: styles[status as keyof typeof styles] || styles.pending,
      label: labels[status as keyof typeof labels] || status
    };
  };

  const getMethodBadge = (method: string) => {
    const styles = {
      cash: 'bg-green-100 text-green-700',
      card: 'bg-blue-100 text-blue-700',
      wallet: 'bg-purple-100 text-purple-700',
      bank_transfer: 'bg-orange-100 text-orange-700'
    };

    const labels = {
      cash: 'Naqd',
      card: 'Karta',
      wallet: 'Hamyon',
      bank_transfer: 'Bank o\'tkazma'
    };

    return { 
      style: styles[method as keyof typeof styles] || styles.cash,
      label: labels[method as keyof typeof labels] || method
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('uz-UZ');
  };

  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />
        <main className="pt-20 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">To'lovlar va Daromadlar</h1>
                <p className="text-gray-600">To'lovlarni boshqaring va haydovchilarning daromadlarini kuzatib boring</p>
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                {/* Quick Date Buttons */}
                

                {/* Date Inputs */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boshlanish sanasi
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => handleDateFromChange(e.target.value)}
                      max={dateTo}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tugash sanasi
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => handleDateToChange(e.target.value)}
                      min={dateFrom}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={isExporting || isLoading}
                  className="bg-[#1E2A38] text-white px-4 py-2 rounded-lg hover:bg-[#2a3a4d] transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <i className={`${isExporting ? 'ri-loader-4-line animate-spin' : 'ri-download-line'}`}></i>
                  {isExporting ? 'Yuklanmoqda...' : 'Export'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <i className="ri-error-warning-line"></i>
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-auto">
                  <i className="ri-close-line"></i>
                </button>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <i className="ri-loader-4-line text-4xl text-gray-400 animate-spin mb-4"></i>
                  <p className="text-gray-600">Yuklanmoqda...</p>
                </div>
              </div>
            ) : paymentData ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <i className="ri-money-dollar-circle-line text-green-600 text-2xl"></i>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{formatCurrency(paymentData.summary.total_fare)}</p>
                        <p className="text-sm text-gray-600">Jami Daromad (so'm)</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <i className="ri-percent-line text-blue-600 text-2xl"></i>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{formatCurrency(paymentData.summary.total_commission)}</p>
                        <p className="text-sm text-gray-600">Jami Komissiya (so'm)</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <i className="ri-wallet-3-line text-purple-600 text-2xl"></i>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{paymentData.summary.total_payments_count}</p>
                        <p className="text-sm text-gray-600">Jami To'lovlar</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Range Info */}
                {paymentData.summary.date_from && paymentData.summary.date_to && (
                  <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <i className="ri-calendar-line"></i>
                    <span>
                      Davr: {formatDate(paymentData.summary.date_from)} - {formatDate(paymentData.summary.date_to)}
                    </span>
                  </div>
                )}

                {/* Payments Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('payments')}
                      className={`px-6 py-4 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                        activeTab === 'payments'
                          ? 'border-b-2 border-[#1E2A38] text-[#1E2A38]'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      To'lovlar Tarixi
                      <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {paymentData.payment_history.length}
                      </span>
                    </button>
                  </div>

                  {/* Search */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Sayohat raqami, yo'lovchi, haydovchi yoki xizmat turini qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="w-5 h-5 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                        <i className="ri-search-line text-gray-400"></i>
                      </div>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      {filteredPayments.length === 0 ? (
                        <div className="text-center py-12">
                          <i className="ri-file-list-line text-4xl text-gray-300 mb-4"></i>
                          <p className="text-gray-500">
                            {searchTerm ? 'Hech qanday natija topilmadi' : 'To\'lovlar mavjud emas'}
                          </p>
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800">Sayohat</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800">Yo'lovchi</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800">Haydovchi</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800">Xizmat</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800">Summa</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800">Komissiya</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800">Usul</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-800">Holati</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredPayments.map((payment) => {
                              const statusBadge = getStatusBadge(payment.payment_status);
                              const methodBadge = getMethodBadge(payment.payment_method);
                              return (
                                <tr key={payment.trip_number} className="hover:bg-gray-50">
                                  <td className="py-4 px-2">
                                    <div className="font-semibold text-gray-800">#{payment.trip_number}</div>
                                    <div className="text-sm text-gray-500">{formatDate(payment.completed_at)}</div>
                                    <div className="text-xs text-gray-400">{payment.pickup_region_name}</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="font-medium text-gray-800">{payment.customer_name}</div>
                                    <div className="text-xs text-gray-500">ID: {payment.customer_id}</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="font-medium text-gray-800">{payment.driver_name}</div>
                                    <div className="text-xs text-gray-500">ID: {payment.driver_id}</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="text-sm text-gray-800">{payment.service_type_name}</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="font-semibold text-gray-800">{formatCurrency(payment.total_fare)} so'm</div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <div className="font-medium text-gray-800">{formatCurrency(payment.commission_amount)} so'm</div>
                                    <div className="text-xs text-gray-500">
                                      {payment.total_fare > 0 ? 
                                        `${((payment.commission_amount / payment.total_fare) * 100).toFixed(1)}%` 
                                        : '0%'
                                      }
                                    </div>
                                  </td>
                                  <td className="py-4 px-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${methodBadge.style}`}>
                                      {methodBadge.label}
                                    </span>
                                  </td>
                                  <td className="py-4 px-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.style}`}>
                                      {statusBadge.label}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            {/* Footer */}
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
                        <span className="text-gray-600">admin@taxigo.uz</span>
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
                    2024 <span className="font-['Pacifico']">TaxiGo</span> Admin Panel. Barcha huquqlar himoyalangan.
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
          </div>
        </main>
      </div>
    </div>
  );
}