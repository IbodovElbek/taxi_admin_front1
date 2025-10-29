
'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

const areas = [
  { id: 1, name: 'Shahar markazi', baseFare: 3500, perKmRate: 1500, color: '#1E2A38' },
  { id: 2, name: 'Aeroport hududi', baseFare: 5000, perKmRate: 2000, color: '#1E2A38' },
  { id: 3, name: 'Universitet hududi', baseFare: 3000, perKmRate: 1200, color: '#1E2A38' },
  { id: 4, name: 'Savdo markazlari', baseFare: 3200, perKmRate: 1300, color: '#1E2A38' },
  { id: 5, name: 'Turar joy hududi', baseFare: 2800, perKmRate: 1100, color: '#1E2A38' }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('pricing');
  const [pricingSettings, setPricingSettings] = useState({
    baseFare: 3000,
    perKmRate: 1200,
    perMinuteRate: 200,
    minimumFare: 5000,
    commissionRate: 15,
    surgeMultiplier: 1.5,
    cancellationFee: 2000
  });

  const [areaSettings, setAreaSettings] = useState(areas);
  const [showAddArea, setShowAddArea] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'TaxiGo',
    supportEmail: 'support@taxigo.uz',
    supportPhone: '+998712345678',
    workingHours: '24/7',
    maxWaitTime: 10,
    autoAcceptTime: 30,
    allowCashPayment: true,
    allowCardPayment: true,
    allowWalletPayment: true
  });

  const handleAddArea = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newArea = {
      id: areaSettings.length + 1,
      name: formData.get('areaName'),
      baseFare: parseInt(formData.get('baseFare')),
      perKmRate: parseInt(formData.get('perKmRate')),
      color: formData.get('color') || '#1E2A38'
    };
    setAreaSettings((prev) => [...prev, newArea]);
    setShowAddArea(false);
    alert(`${newArea.name} hududi qo'shildi!`);
  };

  const handlePricingUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedPricing = {
      baseFare: parseInt(formData.get('baseFare')),
      perKmRate: parseInt(formData.get('perKmRate')),
      perMinuteRate: parseInt(formData.get('perMinuteRate')),
      minimumFare: parseInt(formData.get('minimumFare')),
      commissionRate: parseInt(formData.get('commissionRate')),
      surgeMultiplier: parseFloat(formData.get('surgeMultiplier')),
      cancellationFee: parseInt(formData.get('cancellationFee'))
    };
    setPricingSettings(updatedPricing);
    alert('Narx sozlamalari saqlandi!');
  };

  const handleGeneralUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedGeneral = {
      companyName: formData.get('companyName'),
      supportEmail: formData.get('supportEmail'),
      supportPhone: formData.get('supportPhone'),
      workingHours: formData.get('workingHours'),
      maxWaitTime: parseInt(formData.get('maxWaitTime')),
      autoAcceptTime: parseInt(formData.get('autoAcceptTime')),
      allowCashPayment: formData.get('allowCashPayment') === 'on',
      allowCardPayment: formData.get('allowCardPayment') === 'on',
      allowWalletPayment: formData.get('allowWalletPayment') === 'on'
    };
    setGeneralSettings(updatedGeneral);
    alert('Umumiy sozlamalar saqlandi!');
  };

  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />
        <main className="pt-20 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Tizim Sozlamalari</h1>
              <p className="text-gray-600">Ilovaning asosiy sozlamalarini boshqaring</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-slide-up">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap border-b-2 ${
                    activeTab === 'pricing'
                      ? 'border-[#1E2A38] text-[#1E2A38]'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Narx Sozlamalari
                </button>
                <button
                  onClick={() => setActiveTab('areas')}
                  className={`px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap border-b-2 ${
                    activeTab === 'areas'
                      ? 'border-[#1E2A38] text-[#1E2A38]'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Hududiy Narxlar
                </button>
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap border-b-2 ${
                    activeTab === 'general'
                      ? 'border-[#1E2A38] text-[#1E2A38]'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Umumiy Sozlamalar
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap border-b-2 ${
                    activeTab === 'notifications'
                      ? 'border-[#1E2A38] text-[#1E2A38]'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Bildirishnoma Sozlamalari
                </button>
                <button
                  onClick={() => setActiveTab('backup')}
                  className={`px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap border-b-2 ${
                    activeTab === 'backup'
                      ? 'border-[#1E2A38] text-[#1E2A38]'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Zaxira Nusxa
                </button>
              </div>

              <div className="p-8">
                {activeTab === 'areas' && (
                  <div className="animate-fade-in">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Hududiy Narxlash</h3>
                        <p className="text-gray-600">Har bir hudud uchun alohida narxlar belgilang</p>
                      </div>
                      <button
                        onClick={() => setShowAddArea(true)}
                        className="bg-[#1E2A38] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
                      >
                        Yangi Hudud Qo'shish
                      </button>
                    </div>

                    {/* Interactive Map */}
                    <div className="mb-8 bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Hududlar Xaritasi</h4>
                      <div className="h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg relative overflow-hidden">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95887.55!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2sus!4v1635959000000!5m2!1sen!2sus"
                          width="100%"
                          height="384"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="rounded-lg"
                        ></iframe>

                        {/* Area Markers */}
                        <div className="absolute inset-0 pointer-events-none">
                          {areaSettings.map((area, index) => (
                            <div
                              key={area.id}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                              style={{
                                left: `${20 + index * 15}%`,
                                top: `${30 + index * 10}%`
                              }}
                            >
                              <div
                                className="w-6 h-6 rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer hover:scale-125 transition-transform duration-200"
                                style={{ backgroundColor: area.color }}
                                title={`${area.name}: ${area.baseFare.toLocaleString()} so'm`}
                              ></div>
                              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-sm whitespace-nowrap">
                                {area.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Areas Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {areaSettings.map((area) => (
                        <div
                          key={area.id}
                          className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                          style={{ borderTopColor: area.color, borderTopWidth: '4px' }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: area.color }}
                            ></div>
                            <h4 className="font-semibold text-gray-800">{area.name}</h4>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Boshlang'ich tarif:</span>
                              <span className="font-medium text-gray-800">{area.baseFare.toLocaleString()} so'm</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Kilometrga:</span>
                              <span className="font-medium text-gray-800">{area.perKmRate.toLocaleString()} so'm</span>
                            </div>

                            <div className="pt-3 border-t border-gray-200">
                              <div className="text-sm text-gray-600 mb-2">5 km uchun namuna:</div>
                              <div className="font-semibold text-lg text-green-600">
                                {(area.baseFare + 5 * area.perKmRate).toLocaleString()} so'm
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button className="flex-1 bg-[#F4F6F8] text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm">
                              Tahrirlash
                            </button>
                            <button className="bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm">
                              O'chirish
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'pricing' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Narx Belgilash Sozlamalari</h3>
                    <form onSubmit={handlePricingUpdate}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h4 className="font-semibold text-gray-800 text-lg">Asosiy Narxlar</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Boshlang'ich tarif (so'm)</label>
                            <input
                              type="number"
                              name="baseFare"
                              defaultValue={pricingSettings.baseFare}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Har bir sayohat uchun boshlang'ich to'lov</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kilometrga narx (so'm)</label>
                            <input
                              type="number"
                              name="perKmRate"
                              defaultValue={pricingSettings.perKmRate}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Har bir kilometr uchun qo'shimcha to'lov</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Daqiqaga narx (so'm)</label>
                            <input
                              type="number"
                              name="perMinuteRate"
                              defaultValue={pricingSettings.perMinuteRate}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Kutish vaqti uchun daqiqaga to'lov</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimal tarif (so'm)</label>
                            <input
                              type="number"
                              name="minimumFare"
                              defaultValue={pricingSettings.minimumFare}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Eng kam to'lov miqdori</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h4 className="font-semibold text-gray-800 text-lg">Qo'shimcha Sozlamalar</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Komissiya foizi (%)</label>
                            <input
                              type="number"
                              name="commissionRate"
                              defaultValue={pricingSettings.commissionRate}
                              min="0"
                              max="50"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Haydovchi daromadidan olinadigan komissiya</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Surge koeffitsienti</label>
                            <input
                              type="number"
                              name="surgeMultiplier"
                              step="0.1"
                              min="1"
                              max="5"
                              defaultValue={pricingSettings.surgeMultiplier}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Yuqori talabda narx ko'paytmasi</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bekor qilish jarimi (so'm)</label>
                            <input
                              type="number"
                              name="cancellationFee"
                              defaultValue={pricingSettings.cancellationFee}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Sayohatni bekor qilish uchun jarime</p>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="font-medium text-blue-800 mb-2">Hisob-kitob namunasi</h5>
                            <div className="text-sm text-blue-700 space-y-1">
                              <p>5 km masofaga sayohat:</p>
                              <p>• Boshlang'ich: {pricingSettings.baseFare.toLocaleString()} so'm</p>
                              <p>• Masofa: {(5 * pricingSettings.perKmRate).toLocaleString()} so'm</p>
                              <p>• <strong>Jami: {(pricingSettings.baseFare + 5 * pricingSettings.perKmRate).toLocaleString()} so'm</strong></p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          className="bg-[#1E2A38] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                        >
                          Sozlamalarni Saqlash
                        </button>
                        <button
                          type="button"
                          className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors whitespace-nowrap"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'general' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Umumiy Tizim Sozlamalari</h3>
                    <form onSubmit={handleGeneralUpdate}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h4 className="font-semibold text-gray-800 text-lg">Kompaniya Ma'lumotlari</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kompaniya nomi</label>
                            <input
                              type="text"
                              name="companyName"
                              defaultValue={generalSettings.companyName}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Support email</label>
                            <input
                              type="email"
                              name="supportEmail"
                              defaultValue={generalSettings.supportEmail}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Support telefon</label>
                            <input
                              type="tel"
                              name="supportPhone"
                              defaultValue={generalSettings.supportPhone}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ish vaqti</label>
                            <input
                              type="text"
                              name="workingHours"
                              defaultValue={generalSettings.workingHours}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h4 className="font-semibold text-gray-800 text-lg">Sayohat Sozlamalari</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maksimal kutish vaqti (daqiqa)</label>
                            <input
                              type="number"
                              name="maxWaitTime"
                              defaultValue={generalSettings.maxWaitTime}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Avtomatik qabul vaqti (soniya)</label>
                            <input
                              type="number"
                              name="autoAcceptTime"
                              defaultValue={generalSettings.autoAcceptTime}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-4">
                            <h5 className="font-medium text-gray-700">To'lov usullari</h5>

                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="allowCashPayment"
                                name="allowCashPayment"
                                defaultChecked={generalSettings.allowCashPayment}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="allowCashPayment" className="text-sm font-medium text-gray-700">
                                Naqd to'lovni ruxsat berish
                              </label>
                            </div>

                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="allowCardPayment"
                                name="allowCardPayment"
                                defaultChecked={generalSettings.allowCardPayment}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="allowCardPayment" className="text-sm font-medium text-gray-700">
                                Karta to'lovni ruxsat berish
                              </label>
                            </div>

                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id="allowWalletPayment"
                                name="allowWalletPayment"
                                defaultChecked={generalSettings.allowWalletPayment}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor="allowWalletPayment" className="text-sm font-medium text-gray-700">
                                Hamyon to'lovni ruxsat berish
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          className="bg-[#1E2A38] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                        >
                          Sozlamalarni Saqlash
                        </button>
                        <button
                          type="button"
                          className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors whitespace-nowrap"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Bildirishnoma Sozlamalari</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h4 className="font-semibold text-gray-800 text-lg">Email Bildirishnomalari</h4>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-800">Yangi foydalanuvchi ro'yxati</h5>
                              <p className="text-sm text-gray-600">Yangi haydovchi yoki yo'lovchi ro'yxatdan o'tganda</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-800">To'lov muammolari</h5>
                              <p className="text-sm text-gray-600">To'lovda xatolik yuz berganda</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-800">Kunlik hisobotlar</h5>
                              <p className="text-sm text-gray-600">Har kuni oxirida statistik ma'lumot</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-semibold text-gray-800 text-lg">SMS Bildirishnomalari</h4>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-800">Hujjat tasdiqlash</h5>
                              <p className="text-sm text-gray-600">Haydovchi hujjatlari tasdiqlanganda</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-800">Favqulodda holat</h5>
                              <p className="text-sm text-gray-600">Tizimda jiddiy muammo yuz berganda</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-800">Haftalik xulosalar</h5>
                              <p className="text-sm text-gray-600">Hafta yakunida umumiy ma'lumot</p>
                            </div>
                            <input type="checkbox" className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                      <button className="bg-[#1E2A38] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap">
                        Sozlamalarni Saqlash
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'backup' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Zaxira Nusxa va Ma'lumotlar</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h4 className="font-semibold text-gray-800 text-lg">Avtomatik Zaxira</h4>

                        <div className="space-y-4">
                          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-shield-check-line text-white"></i>
                                </div>
                              </div>
                              <h5 className="font-semibold text-green-800">Kunlik zaxira faol</h5>
                            </div>
                            <p className="text-green-700 text-sm">Oxirgi zaxira: Bugun 03:00 da</p>
                            <p className="text-green-700 text-sm">Keyingi zaxira: Ertaga 03:00 da</p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                              <label className="text-sm text-gray-700">Kunlik zaxira nusxa</label>
                            </div>
                            <div className="flex items-center gap-3">
                              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                              <label className="text-sm text-gray-700">Haftalik to'liq zaxira</label>
                            </div>
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="w-4 h-4 text-blue-600" />
                              <label className="text-sm text-gray-700">Oylik arxiv zaxira</label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-700 mb-3">Qo'lda zaxira yaratish</h5>
                          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                            Hozir zaxira yaratish
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="font-semibold text-gray-800 text-lg">Ma'lumotlar Eksporti</h4>

                        <div className="space-y-4">
                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-group-line text-blue-600"></i>
                                </div>
                              </div>
                              <span className="font-medium">Foydalanuvchilar ma'lumoti</span>
                            </div>
                            <div className="w-5 h-5 flex items-center justify-center">
                              <i className="ri-download-line text-gray-400"></i>
                            </div>
                          </button>

                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-car-line text-green-600"></i>
                                </div>
                              </div>
                              <span className="font-medium">Sayohatlar tarixi</span>
                            </div>
                            <div className="w-5 h-5 flex items-center justify-center">
                              <i className="ri-download-line text-gray-400"></i>
                            </div>
                          </button>

                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-money-dollar-circle-line text-purple-600"></i>
                                </div>
                              </div>
                              <span className="font-medium">Moliyaviy hisobotlar</span>
                            </div>
                            <div className="w-5 h-5 flex items-center justify-center">
                              <i className="ri-download-line text-gray-400"></i>
                            </div>
                          </button>

                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <i className="ri-settings-line text-orange-600"></i>
                                </div>
                              </div>
                              <span className="font-medium">Tizim sozlamalari</span>
                            </div>
                            <div className="w-5 h-5 flex items-center justify-center">
                              <i className="ri-download-line text-gray-400"></i>
                            </div>
                          </button>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex gap-3">
                            <div className="w-5 h-5 flex items-center justify-center text-yellow-600">
                              <i className="ri-warning-line"></i>
                            </div>
                            <div>
                              <h6 className="font-medium text-yellow-800">Xavfsizlik eslatmasi</h6>
                              <p className="text-yellow-700 text-sm mt-1">
                                Eksport qilingan ma'lumotlarni xavfsiz joyda saqlang va uchinchi shaxslar bilan bo'lishmang.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add Area Modal */}
                {showAddArea && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md animate-scale-in">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">Yangi Hudud Qo'shish</h3>
                        <button
                          onClick={() => setShowAddArea(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <i className="ri-close-line text-gray-500 text-xl"></i>
                        </button>
                      </div>

                      <form onSubmit={handleAddArea}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hudud nomi</label>
                            <input
                              type="text"
                              name="areaName"
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              placeholder="Masalan: Metro stantsiyasi"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Boshlang'ich tarif (so'm)</label>
                            <input
                              type="number"
                              name="baseFare"
                              required
                              min="1000"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              placeholder="3000"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kilometrga narx (so'm)</label>
                            <input
                              type="number"
                              name="perKmRate"
                              required
                              min="500"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              placeholder="1200"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hudud rangi</label>
                            <div className="flex gap-3">
                              <input
                                type="color"
                                name="color"
                                defaultValue="#1E2A38"
                                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                              />
                              <input
                                type="text"
                                name="colorHex"
                                placeholder="#1E2A38"
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            type="submit"
                            className="flex-1 bg-[#1E2A38] text-white py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
                          >
                            Hudud Qo'shish
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddArea(false)}
                            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
                          >
                            Bekor qilish
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }

          .animate-slide-up {
            animation: slideUp 0.6s ease-out;
          }

          .animate-scale-in {
            animation: scaleIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
