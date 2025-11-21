"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api,  UpdateDriverRequest, BalanceUpdateRequest, BalanceResponse } from "../../api";
import Swal from "sweetalert2";
import { Driver, ServiceType } from "../types/types";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showAddDriver, setShowAddDriver] = useState(false);
  
  // Edit driver state
  const [showEditDriver, setShowEditDriver] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateDriverRequest>({});
  const [services, setservices] = useState <ServiceType[] | null>([]);
  const [selectedservice, setselectedservice] = useState <ServiceType | null>(null);

  // NEW: Balance management state
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceDriver, setBalanceDriver] = useState<Driver | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<string>("");
  const [balanceReason, setBalanceReason] = useState<string>("");
  const [balanceOperation, setBalanceOperation] = useState<"add" | "deduct">("add");
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [formData, setFormData] = useState({
    service_type_id:1,
    phone_number: "",
    email: "",
    full_name: "",
    password: "",
    license_number: "",
    car_model: "",
    car_color: "",
    car_number: "",
    car_year: 0,
    documents_verified: false,
    is_verified: false,
    driver_balance:0,
    commission_rate: 0.2,
  });

  // API'dan haydovchilarni yuklash
  useEffect(() => {
    fetchDrivers();
  }, []);
const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>,is_create:boolean) => {
  const serviceTypeId = parseInt(e.target.value);
  is_create?setFormData((prev) => ({ ...prev, service_type_id: serviceTypeId })):
  setEditFormData((prev) => ({ ...prev, service_type_id: serviceTypeId }));
  console.log('Tanlangan service type ID:', serviceTypeId);
};
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get_all_drivers();
      console.log("API Response:", response);

      let driversArray : Driver[];
      setservices(response.services || null);
      if (Array.isArray(response.drivers)) {
        driversArray = response.drivers;
      }else {
        console.warn("Unexpected API response format:", response);
        driversArray = [];
      }

      console.log("✅ Parsed JSON Data:", driversArray);
      setDrivers(driversArray);
    } catch (err) {
      console.error("Haydovchilarni yuklashda xatolik:", err);
      setError("Haydovchilarni yuklashda xatolik yuz berdi");
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const safeDrivers = Array.isArray(drivers) ? drivers : [];

  const filteredDrivers = safeDrivers.filter((driver) => {
    const matchesFilter =
      filterStatus === "all" || driver.status === filterStatus;
    // API strukturasiga mos ravishda search qilish
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      driver.user?.full_name?.toLowerCase().includes(searchText) ||
      driver.user?.phone_number?.includes(searchText) ||
      driver.user?.email?.toLowerCase().includes(searchText) ||
      driver.car_model?.toLowerCase().includes(searchText) ||
      driver.car_number?.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      online: "bg-blue-100 text-blue-700",
      offline: "bg-red-100 text-red-700",
      busy: "bg-yellow-100 text-yellow-700",
    };

    const labels = {
      active: "Faol",
      inactive: "Nofaol",
      online: "Onlayn",
      offline: "Oflayn",
      busy: "Band",
    };

    return {
      style: styles[status as keyof typeof styles] || styles.inactive,
      label: labels[status as keyof typeof labels] || status,
    };
  };

  const [creating, setCreating] = useState(false);

  // FIXED: Create driver with proper error handling
  const createDriver = async () => {
    if (
      !formData.full_name ||
      !formData.phone_number ||
      !formData.license_number
    ) {
      Swal.fire({
        icon: "warning",
        title: "Ma'lumotlar to'liq emas!",
        text: "Barcha majburiy maydonlarni to'ldiring!",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setCreating(true);
      console.log("Creating driver with data:", formData);

      await api.create_driver(formData);

      // SUCCESS: Show success message
      Swal.fire({
        icon: "success",
        title: "Muvaffaqiyatli!",
        text: "Haydovchi muvaffaqiyatli qo'shildi!",
        confirmButtonText: "OK",
      });

      await fetchDrivers(); // haydovchilar ro'yxatini yangilash
      setShowAddDriver(false);

      // formani tozalash
      setFormData({
        service_type_id:1,
        phone_number: "",
        email: "",
        full_name: "",
        password: "",
        license_number: "",
        car_model: "",
        car_color: "",
        car_number: "",
        car_year: 0,
        driver_balance:0,
        commission_rate: 0.2,
        documents_verified: false,
        is_verified: false,
      });
    } catch (error) {
      console.error("Driver creation error:", error);
      
      // ERROR: Show error message
      Swal.fire({
        icon: "error",
        title: "Xatolik yuz berdi!",
        text: error instanceof Error ? error.message : "Haydovchi qo'shishda xatolik yuz berdi!",
        confirmButtonText: "OK",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setEditFormData({
      service_type_id: driver.service_type_id || 1,
      full_name: driver.user?.full_name || "",
      email: driver.user?.email || "",
      phone_number: driver.user?.phone_number || "",
      license_number: driver.license_number || "",
      car_model: driver.car_model || "",
      car_color: driver.car_color || "",
      car_number: driver.car_number || "",
      car_year: driver.car_year || new Date().getFullYear(),
      commission_rate: driver.commission_rate || 0.2,
      status: driver.status || "active",
      documents_verified: driver.documents_verified || false,
      is_verified: driver.is_verified || false,
    });
    setShowEditDriver(true);
  };

  const updateDriver = async () => {
    if (!editingDriver) return;

    // Validation
    if (!editFormData.full_name || !editFormData.phone_number || !editFormData.license_number) {
      Swal.fire({
        icon: "warning",
        title: "Ma'lumotlar to'liq emas!",
        text: "Barcha majburiy maydonlarni to'ldiring!",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Updating driver:", editingDriver.id, editFormData);

      await api.update_driver(editingDriver.id, editFormData);

      Swal.fire({
        icon: "success",
        title: "Yangilandi!",
        text: "Haydovchi ma'lumotlari muvaffaqiyatli yangilandi!",
        confirmButtonText: "OK",
      });

      await fetchDrivers();
      setShowEditDriver(false);
      setEditingDriver(null);
      setEditFormData({});
    } catch (error) {
      console.error("Driver update error:", error);
      
      Swal.fire({
        icon: "error",
        title: "Yangilashda xatolik!",
        text: error instanceof Error ? error.message : "Haydovchi ma'lumotlarini yangilashda xatolik yuz berdi!",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // NEW: Balance Management Functions
  const handleBalanceClick = (driver: Driver) => {
    setBalanceDriver(driver);
    setBalanceAmount("");
    setBalanceReason("");
    setBalanceOperation("add");
    setShowBalanceModal(true);
  };

  const handleBalanceUpdate = async () => {
    if (!balanceDriver || !balanceAmount) {
      Swal.fire({
        icon: "warning",
        title: "Ma'lumotlar to'liq emas!",
        text: "Miqdorni kiriting!",
        confirmButtonText: "OK",
      });
      return;
    }

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Noto'g'ri miqdor!",
        text: "Musbat raqam kiriting!",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setBalanceLoading(true);

      const requestData: BalanceUpdateRequest = {
        amount,
        description: balanceReason || "No reason provided"
      };


      let response: BalanceResponse;
      let operationText = "";

      if (balanceOperation === "add") {
        response = await api.addDriverBalance(balanceDriver.id, requestData);
        operationText = "qo'shildi";
      } else {
        response = await api.deductDriverBalance(balanceDriver.id, requestData);
        operationText = "ayirildi";
      }

      Swal.fire({
        icon: "success",
        title: "Muvaffaqiyatli!",
        html: `
          <p>Haydovchi balansiga <strong>${amount.toLocaleString()} so'm</strong> ${operationText}!</p>
          <p><small>Yangi balans: <strong>${response.new_balance?.toLocaleString()} so'm</strong></small></p>
        `,
        confirmButtonText: "OK",
      });

      await fetchDrivers(); // haydovchilar ro'yxatini yangilash
      setShowBalanceModal(false);
      setBalanceDriver(null);
      setBalanceAmount("");
      setBalanceReason("");

    } catch (error) {
      console.error("Balance update error:", error);
      
      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: error instanceof Error ? error.message : "Balance yangilashda xatolik yuz berdi!",
        confirmButtonText: "OK",
      });
    } finally {
      setBalanceLoading(false);
    }
  };

  // Toggle driver status
  const toggleDriverStatus = async (driver: Driver) => {
    try {
      const result = await Swal.fire({
        title: "Holatni o'zgartirish",
        text: `${driver.user?.full_name} ning holatini o'zgartirmoqchimisiz?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ha, o'zgartirish",
        cancelButtonText: "Bekor qilish",
      });

      if (result.isConfirmed) {
        await api.toggle_driver_status(driver.id);
        
        Swal.fire({
          icon: "success",
          title: "Holat o'zgartirildi!",
          text: "Haydovchi holati muvaffaqiyatli o'zgartirildi!",
          confirmButtonText: "OK",
        });

        await fetchDrivers();
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      
      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: "Haydovchi holatini o'zgartirishda xatolik yuz berdi!",
        confirmButtonText: "OK",
      });
    }
  };

  // Verify driver
  const verifyDriver = async (driver: Driver, isVerified: boolean) => {
    try {
      const result = await Swal.fire({
        title: isVerified ? "Haydovchini tasdiqlash" : "Tasdiqni bekor qilish",
        text: `${driver.user?.full_name}ni ${isVerified ? "tasdiqlaysizmi" : "tasdiqdan chiqaraysizmi"}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: isVerified ? "Ha, tasdiqlash" : "Ha, bekor qilish",
        cancelButtonText: "Bekor qilish",
      });

      if (result.isConfirmed) {
        await api.verify_driver(driver.id, isVerified);
        
        Swal.fire({
          icon: "success",
          title: "Muvaffaqiyatli!",
          text: `Haydovchi ${isVerified ? "tasdiqlandi" : "tasdiqdan chiqarildi"}!`,
          confirmButtonText: "OK",
        });

        await fetchDrivers();
      }
    } catch (error) {
      console.error("Verify driver error:", error);
      
      Swal.fire({
        icon: "error",
        title: "Xatolik!",
        text: "Haydovchini tasdiqlashda xatolik yuz berdi!",
        confirmButtonText: "OK",
      });
    }
  };

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDriverDetails(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.phone_number &&
      formData.email &&
      formData.full_name &&
      formData.password &&
      formData.license_number &&
      formData.car_model &&
      formData.car_color &&
      formData.car_number &&
      formData.car_year &&
      formData.commission_rate
    );
  };

  if (loading && drivers.length === 0) {
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
                  <p className="text-gray-600">Haydovchilar yuklanmoqda...</p>
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
                    onClick={fetchDrivers}
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
                  Haydovchilar Boshqaruvi
                </h1>
                <p className="text-gray-600">
                  Barcha haydovchilarni boshqaring va ularning faoliyatini
                  kuzatib boring
                </p>
              </div>
              <button
                onClick={() => setShowAddDriver(true)}
                className="bg-[#1E2A38] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap animate-slide-up"
              >
                <i className="ri-user-add-line"></i>
                Yangi Haydovchi
              </button>
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
                      {safeDrivers.filter((d) => d.status === "active").length}
                    </p>
                    <p className="text-sm text-gray-600">Faol Haydovchilar</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-shield-check-line text-blue-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {safeDrivers.filter((d) => d.is_verified).length}
                    </p>
                    <p className="text-sm text-gray-600">Tasdiqlangan</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="ri-time-line text-yellow-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {safeDrivers.filter((d) => !d.is_verified).length}
                    </p>
                    <p className="text-sm text-gray-600">Tasdiq Kutilmoqda</p>
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
                      {safeDrivers.length}
                    </p>
                    <p className="text-sm text-gray-600">Jami Haydovchilar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 animate-slide-up">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {["all", "active", "inactive", "online", "offline"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 whitespace-nowrap ${
                          filterStatus === status
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
                          : status === "online"
                          ? "Onlayn"
                          : "Oflayn"}
                      </button>
                    )
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Haydovchi nomi, telefon yoki email qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-2 pl-10 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
                  />
                  <i className="ri-search-line text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </div>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrivers.map((driver, index) => {
                const statusBadge = getStatusBadge(driver.status);
                return (
                  <div
                    key={driver.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#1E2A38] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {driver.user?.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase() || "ND"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {driver.user?.full_name || "Noma'lum"}
                          </h3>
                          <p className="text-sm text-gray-500">#{driver.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {driver.is_verified && (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="ri-shield-check-fill text-green-600"></i>
                          </div>
                        )}
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
                          {driver.user?.phone_number || "Ma'lumot yo'q"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span
                          className="font-medium text-gray-800 truncate max-w-32"
                          title={driver.user?.email || "Ma'lumot yo'q"}
                        >
                          {driver.user?.email || "Ma'lumot yo'q"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reyting:</span>
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-400"></i>
                          <span className="font-medium text-gray-800">
                            {driver.rating || "0.0"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Sayohatlar:
                        </span>
                        <span className="font-medium text-gray-800">
                          {driver.total_trips || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mashina:</span>
                        <span className="font-medium text-gray-800">
                          {driver.car_model} ({driver.car_color})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Raqam:</span>
                        <span className="font-medium text-gray-800">
                          {driver.car_number}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Yili:</span>
                        <span className="font-medium text-gray-800">
                          {driver.car_year}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Balance:</span>
                        <span className="font-bold text-green-600">
                          {driver.balance_formatted || "0 so'm"}
                        </span>
                      </div>
                    </div>

                    {/* Actions - UPDATED with Balance button */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleViewDetails(driver)}
                        className="flex-1 min-w-[70px] bg-[#F4F6F8] text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 text-xs font-medium"
                      >
                        <i className="ri-eye-line mr-1"></i>
                        Batafsil
                      </button>
                      
                      <button
                        onClick={() => handleEditDriver(driver)}
                        className="flex-1 min-w-[70px] bg-blue-50 text-blue-700 py-2 px-2 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-105 text-xs font-medium"
                      >
                        <i className="ri-edit-line mr-1"></i>
                        Tahrir
                      </button>
                      
                      {/* NEW: Balance Button */}
                      <button
                        onClick={() => handleBalanceClick(driver)}
                        className="flex-1 min-w-[70px] bg-green-50 text-green-700 py-2 px-2 rounded-lg hover:bg-green-100 transition-all duration-200 transform hover:scale-105 text-xs font-medium"
                      >
                        <i className="ri-money-dollar-circle-line mr-1"></i>
                        Balance
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDrivers.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-line text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Haydovchilar topilmadi
                </h3>
                <p className="text-gray-600">
                  Qidiruv shartlaringizga mos haydovchilar mavjud emas
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* NEW: Balance Management Modal */}
      {showBalanceModal && balanceDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Balance Boshqaruvi
              </h3>
              <button
                onClick={() => {
                  setShowBalanceModal(false);
                  setBalanceDriver(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <i className="ri-close-line text-gray-500"></i>
              </button>
            </div>

            {/* Driver Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#1E2A38] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {balanceDriver.user?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "ND"}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {balanceDriver.user?.full_name || "Noma'lum"}
                  </h4>
                  <p className="text-sm text-gray-600">#{balanceDriver.id}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Joriy Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  {balanceDriver.balance_formatted || "0 so'm"}
                </p>
              </div>
            </div>

            {/* Operation Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amal turi
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBalanceOperation("add")}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    balanceOperation === "add"
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <i className="ri-add-circle-line mr-2"></i>
                  Pul Qo'shish
                </button>
                <button
                  onClick={() => setBalanceOperation("deduct")}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    balanceOperation === "deduct"
                      ? "bg-red-100 text-red-700 border-2 border-red-300"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <i className="ri-subtract-line mr-2"></i>
                  Pul Ayirish
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miqdor (so'm) *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Miqdorni kiriting"
              />
            </div>

            {/* Reason Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sabab (ixtiyoriy)
              </label>
              <input
                type="text"
                value={balanceReason}
                onChange={(e) => setBalanceReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Misal: Bonus to'lov, Jarima, va h.k."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleBalanceUpdate}
                disabled={balanceLoading || !balanceAmount}
                className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed ${
                  balanceOperation === "add"
                    ? "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
                    : "bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400"
                }`}
              >
                {balanceLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Bajarilmoqda...
                  </div>
                ) : (
                  <>
                    <i className={`mr-2 ${balanceOperation === "add" ? "ri-add-circle-line" : "ri-subtract-line"}`}></i>
                    {balanceOperation === "add" ? "Pul Qo'shish" : "Pul Ayirish"}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowBalanceModal(false);
                  setBalanceDriver(null);
                }}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {showDriverDetails && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Haydovchi Tafsilotlari
              </h3>
              <button
                onClick={() => setShowDriverDetails(false)}
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
                        {selectedDriver.user?.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "ND"}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        {selectedDriver.user?.full_name || "Noma'lum"}
                      </h5>
                      <p className="text-sm text-gray-600">
                        #{selectedDriver.id}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <i className="ri-star-fill text-yellow-400"></i>
                        <span className="text-sm font-medium">
                          {selectedDriver.rating || "0.0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Telefon:</span>
                      <p className="font-medium">
                        {selectedDriver.user?.phone_number || "Ma'lumot yo'q"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">
                        {selectedDriver.user?.email || "Ma'lumot yo'q"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Guvohnoma:</span>
                      <p className="font-medium">
                        {selectedDriver.license_number || "Ma'lumot yo'q"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Holati:</span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ml-2 ${
                          getStatusBadge(selectedDriver.status).style
                        }`}
                      >
                        {getStatusBadge(selectedDriver.status).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  Transport Vositasi
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Model:</span>
                    <p className="font-medium">
                      {selectedDriver.car_model || "Ma'lumot yo'q"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Rangi:</span>
                    <p className="font-medium">
                      {selectedDriver.car_color || "Ma'lumot yo'q"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Davlat raqami:
                    </span>
                    <p className="font-medium">
                      {selectedDriver.car_number || "Ma'lumot yo'q"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Yili:</span>
                    <p className="font-medium">
                      {selectedDriver.car_year || "Ma'lumot yo'q"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Komissiya:</span>
                    <p className="font-medium">
                      {selectedDriver.commission_rate}%
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
                        Jami Balance:
                      </span>
                      <p className="font-medium">
                        {selectedDriver.balance_formatted || 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Jami sayohatlar:
                      </span>
                      <p className="font-medium">
                        {selectedDriver.total_trips || 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Jami daromad:
                      </span>
                      <p className="font-medium">
                        {selectedDriver.total_earnings || 0} so'm
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Reyting:</span>
                      <p className="font-medium">
                        {selectedDriver.rating || "0.0"} / 5.0
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditDriver && editingDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                Haydovchi Ma'lumotlarini Tahrirlash
              </h3>
              <button
                onClick={() => {
                  setShowEditDriver(false);
                  setEditingDriver(null);
                  setEditFormData({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-gray-500 text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-4 lg:space-y-6">
                <h4 className="font-semibold text-gray-800 text-base lg:text-lg">
                  Shaxsiy Ma'lumotlar
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To'liq ism *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.full_name || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, full_name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Ism Familya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon raqam *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone_number || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phone_number: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="example@mail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guvohnoma raqami *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.license_number || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, license_number: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="ABC123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Holat
                  </label>
                  <select
                    value={editFormData.status || "active"}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, status: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="active">Faol</option>
                    <option value="inactive">Nofaol</option>
                    <option value="online">Onlayn</option>
                    <option value="offline">Oflayn</option>
                    <option value="busy">Band</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <h4 className="font-semibold text-gray-800 text-base lg:text-lg">
                  Transport Vositasi
                </h4>
                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xizmat turi
                    </label>
                 <select
                  name="service_type_id"
                  value={editFormData.service_type_id}
                  onChange={(e) => handleServiceTypeChange(e, false)}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mashina modeli
                  </label>
                  <input
                    type="text"
                    value={editFormData.car_model || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, car_model: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Chevrolet Cobalt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mashina rangi
                  </label>
                  <input
                    type="text"
                    value={editFormData.car_color || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, car_color: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Oq"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mashina raqami
                  </label>
                  <input
                    type="text"
                    value={editFormData.car_number || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, car_number: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="01 A 123 BC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mashina yili
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={editFormData.car_year || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, car_year: Number(e.target.value) })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Komissiya (0.0-1.0)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={editFormData.commission_rate || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, commission_rate: Number(e.target.value) })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="0.20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Misol: 0.20 = 20%
                  </p>
                </div>
                  {/* ✅ Checkbox */}
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={editFormData.documents_verified || false}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        documents_verified: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <label className="ml-2 text-sm text-gray-700">
                    Document tekshirildi?
                  </label>
                </div>
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={editFormData.is_verified || false}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        is_verified: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <label className="ml-2 text-sm text-gray-700">
                    Driver tekshirildi?
                  </label>
                </div>
                
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
              <button
                onClick={updateDriver}
                disabled={loading}
                className="flex-1 bg-[#1E2A38] text-white py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Yangilanmoqda..." : "Saqlash"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditDriver(false);
                  setEditingDriver(null);
                  setEditFormData({});
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                Yangi Haydovchi Qo'shish
              </h3>
              <button
                onClick={() => setShowAddDriver(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-gray-500 text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-4 lg:space-y-6">
                <h4 className="font-semibold text-gray-800 text-base lg:text-lg">
                  Shaxsiy Ma'lumotlar
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To'liq ism *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Ism Familya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon raqam *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone_number: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="example@mail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parol *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Parol kiriting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guvohnoma raqami *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.license_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        license_number: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="ABC123456"
                  />
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <h4 className="font-semibold text-gray-800 text-base lg:text-lg">
                  Transport Vositasi
                </h4>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xizmat turi
                    </label>
                 <select
                  name="service_type_id"
                  value={formData.service_type_id}
                  onChange={(e) => handleServiceTypeChange(e, true)}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mashina modeli *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.car_model}
                    onChange={(e) =>
                      setFormData({ ...formData, car_model: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Chevrolet Cobalt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mashina rangi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.car_color}
                    onChange={(e) =>
                      setFormData({ ...formData, car_color: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Oq"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mashina raqami *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.car_number}
                    onChange={(e) =>
                      setFormData({ ...formData, car_number: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="01 A 123 BC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mashina yili *
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    required
                    value={formData.car_year || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        car_year: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Komissiya (0.0-1.0) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    required
                    value={formData.commission_rate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commission_rate: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="0.20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Misol: 0.20 = 20%
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boshlang`ich summasi` *
                  </label>
                  <input
                    type="number"
                    min="24000"
                    step={"1000"}
                    required
                    value={formData.driver_balance || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        driver_balance: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="24000"
                  />
                </div>
                {/* ✅ Checkbox */}
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={formData.documents_verified || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documents_verified: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <label className="ml-2 text-sm text-gray-700">
                    Document tekshirildi?
                  </label>
                </div>
                
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    checked={formData.is_verified || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_verified: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  <label className="ml-2 text-sm text-gray-700">
                    Driver tekshirildi?
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
              <button
                onClick={createDriver}
                disabled={creating}
                className="flex-1 bg-[#1E2A38] text-white py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {creating ? "Yaratilmoqda..." : "Haydovchi Qo'shish"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddDriver(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
              >
                Bekor qilish
              </button>
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