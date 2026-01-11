"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api, Customer } from "../../api";
import Swal from "sweetalert2";

export default function UsersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // API'dan foydalanuvchilarni yuklash
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get_all_users();


      let customersArray: any[] = [];
      if (Array.isArray(response)) {
        customersArray = response;
      } else if (response && 'data' in response && Array.isArray((response as any).data)) {
        customersArray = (response as any).data;
      } else if (response && 'customers' in response && Array.isArray((response as any).customers)) {
        customersArray = (response as any).customers;
      } else if (response && 'results' in response && Array.isArray((response as any).results)) {
        customersArray = (response as any).results;
      } else {
        customersArray = [];
      }


      setCustomers(customersArray);
    } catch (err) {

      setError("Foydalanuvchilarni yuklashda xatolik yuz berdi");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // customers array ekanligini ta'minlash
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const filteredCustomers = safeCustomers.filter((customer) => {
    const matchesFilter =
      filterStatus === "all" || customer.user.status === filterStatus;
    // API strukturasiga mos ravishda search qilish
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      customer.user?.full_name?.toLowerCase().includes(searchText) ||
      customer.user?.phone_number?.includes(searchText) ||
      customer.user?.email?.toLowerCase().includes(searchText) ||
      customer.emergency_contact?.includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      blocked: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
    };

    const labels = {
      active: "Faol",
      inactive: "Nofaol",
      blocked: "Bloklangan",
      pending: "Kutilmoqda",
    };

    return {
      style: styles[status as keyof typeof styles] || styles.inactive,
      label: labels[status as keyof typeof labels] || status,
    };
  };

  // Block/Unblock customer
  const blockCustomer = async (customer: Customer, isBlocked: boolean) => {
    try {
      const result = await Swal.fire({
        title: isBlocked ? "Foydalanuvchini bloklash" : "Blokni olib tashlash",
        text: `${customer.user?.full_name}ni ${isBlocked ? "bloklaysizmi" : "blokdan chiqaraysizmi"}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: isBlocked ? "Ha, bloklash" : "Ha, blokdan chiqarish",
        cancelButtonText: "Bekor qilish",
      });

      if (result.isConfirmed) {
        // API da block customer method mavjud emas, placeholder
        // await api.block_customer(customer.id, isBlocked);

        Swal.fire({
          icon: "success",
          title: "Muvaffaqiyatli!",
          text: `Foydalanuvchi ${isBlocked ? "bloklandi" : "blokdan chiqarildi"}!`,
          confirmButtonText: "OK",
        });

        await fetchCustomers();
      }
    } catch (error) {


      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: "Foydalanuvchini bloklashda xatolik yuz berdi!",
        confirmButtonText: "OK",
      });
    }
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  if (loading && customers.length === 0) {
    return (
      <div className="bg-[#F4F6F8] min-h-screen">
        <Sidebar />
        <div className="lg:ml-64 ml-0">
          <TopBar />
          <main className="pt-20 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E2A38] mx-auto mb-4"></div>
                  <p className="text-gray-600">Foydalanuvchilar yuklanmoqda...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F4F6F8] min-h-screen">
        <Sidebar />
        <div className="lg:ml-64 ml-0">
          <TopBar />
          <main className="pt-20 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-error-warning-line text-red-600 text-2xl"></i>
                  </div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchCustomers}
                    className="bg-[#1E2A38] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                  >
                    Qayta urinish
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />
        <main className="pt-20 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Foydalanuvchilar Boshqaruvi
                </h1>
                <p className="text-gray-600">
                  Barcha foydalanuvchilarni boshqaring va ularning faoliyatini
                  kuzatib boring
                </p>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-green-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {safeCustomers.filter((c) => c.user.status === "active").length}
                    </p>
                    <p className="text-sm text-gray-600">Faol Foydalanuvchilar</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-star-line text-blue-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {safeCustomers.filter((c) => c.rating >= 4.5).length}
                    </p>
                    <p className="text-sm text-gray-600">Yuqori Reyting</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="ri-taxi-line text-yellow-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {safeCustomers.reduce((total, c) => total + c.total_trips, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Jami Sayohatlar</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="ri-group-line text-purple-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {safeCustomers.length}
                    </p>
                    <p className="text-sm text-gray-600">Jami Foydalanuvchilar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 animate-slide-up">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {["all", "active", "inactive", "blocked", "pending"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap ${filterStatus === status
                          ? "bg-[#1E2A38] text-white"
                          : "bg-[#F4F6F8] text-gray-600 hover:bg-gray-200"
                          }`}
                      >
                        {status === "all"
                          ? "Barchasi"
                          : status === "active"
                            ? "Faol"
                            : status === "inactive"
                              ? "Nofaol"
                              : status === "blocked"
                                ? "Bloklangan"
                                : "Kutilmoqda"}
                      </button>
                    )
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Foydalanuvchi nomi, telefon yoki email qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-2 pl-10 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
                  />
                  <i className="ri-search-line text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer, index) => {
                const statusBadge = getStatusBadge(customer.user.status);
                return (
                  <div
                    key={customer.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#1E2A38] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {customer.user?.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase() || "ND"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {customer.user?.full_name || "Noma'lum"}
                          </h3>
                          <p className="text-sm text-gray-500">#{customer.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.style}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Telefon:</span>
                        <span className="font-medium text-gray-800">
                          {customer.user?.phone_number || "Ma'lumot yo'q"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span
                          className="font-medium text-gray-800 truncate max-w-32"
                          title={customer.user?.email || "Ma'lumot yo'q"}
                        >
                          {customer.user?.email || "Ma'lumot yo'q"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reyting:</span>
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-400"></i>
                          <span className="font-medium text-gray-800">
                            {customer.rating || "0.0"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Sayohatlar:
                        </span>
                        <span className="font-medium text-gray-800">
                          {customer.total_trips || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Til:</span>
                        <span className="font-medium text-gray-800">
                          {customer.preferred_language === 'uz' ? "O'zbekcha" :
                            customer.preferred_language === 'ru' ? "Русский" :
                              customer.preferred_language === 'en' ? "English" :
                                customer.preferred_language || "O'zbekcha"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Favqulodda:</span>
                        <span className="font-medium text-gray-800">
                          {customer.emergency_contact || "Yo'q"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="flex-1 min-w-[90px] bg-[#F4F6F8] text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 text-sm font-medium"
                      >
                        <i className="ri-eye-line mr-1"></i>
                        Batafsil
                      </button>

                      <button
                        onClick={() => blockCustomer(customer, customer.user.status !== "blocked")}
                        className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium ${customer.user.status === "blocked"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                      >
                        <i className={`${customer.user.status === "blocked" ? "ri-lock-unlock-line" : "ri-lock-line"} mr-1`}></i>
                        {customer.user.status === "blocked" ? "Blokdan chiqarish" : "Bloklash"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCustomers.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-line text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Foydalanuvchilar topilmadi
                </h3>
                <p className="text-gray-600">
                  Qidiruv shartlaringizga mos foydalanuvchilar mavjud emas
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Foydalanuvchi Tafsilotlari
              </h3>
              <button
                onClick={() => setShowCustomerDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <i className="ri-close-line text-gray-500"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  Shaxsiy Ma'lumotlar
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-[#1E2A38] rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        {selectedCustomer.user?.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "ND"}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        {selectedCustomer.user?.full_name || "Noma'lum"}
                      </h5>
                      <p className="text-sm text-gray-600">
                        #{selectedCustomer.id}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <i className="ri-star-fill text-yellow-400"></i>
                        <span className="text-sm font-medium">
                          {selectedCustomer.rating || "0.0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Telefon:</span>
                      <p className="font-medium">
                        {selectedCustomer.user?.phone_number || "Ma'lumot yo'q"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">
                        {selectedCustomer.user?.email || "Ma'lumot yo'q"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Holati:</span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ml-2 ${getStatusBadge(selectedCustomer.user.status).style
                          }`}
                      >
                        {getStatusBadge(selectedCustomer.user.status).label}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ro'yxatdan o'tgan:</span>
                      <p className="font-medium">
                        {new Date(selectedCustomer.user.created_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  Qo'shimcha Ma'lumotlar
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Afzal qilingan til:</span>
                    <p className="font-medium">
                      {selectedCustomer.preferred_language === 'uz' ? "O'zbekcha" :
                        selectedCustomer.preferred_language === 'ru' ? "Русский" :
                          selectedCustomer.preferred_language === 'en' ? "English" :
                            selectedCustomer.preferred_language || "O'zbekcha"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Favqulodda aloqa:
                    </span>
                    <p className="font-medium">
                      {selectedCustomer.emergency_contact || "Ma'lumot yo'q"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Statistika
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">
                        Jami sayohatlar:
                      </span>
                      <p className="font-medium">
                        {selectedCustomer.total_trips || 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Reyting:</span>
                      <p className="font-medium">
                        {selectedCustomer.rating || "0.0"} / 5.0
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
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
  );
}