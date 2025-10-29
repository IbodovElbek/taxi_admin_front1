"use client";

import { useState, useEffect, SetStateAction } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import KPICard from "../../components/KPICard";
import DashboardChart from "../../components/DashboardChart";
import TaxiGoMap from "../../components/LiveMap";
import RecentActivity from "../../components/RecentActivity";
import Login from "../login/Login";
import { api } from "../../api";
import Swal from "sweetalert2";

export default function Home() {
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showSendAlert, setShowSendAlert] = useState(false);
  const [showCreatePromo, setShowCreatePromo] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [showManagePayments, setShowManagePayments] = useState(false);
  const [activeDrivers, setActiveDrivers] = useState(247);
  const [totalRides, setTotalRides] = useState(1247);
  const [ongoingRides, setOngoingRides] = useState(86);
  const [cancelledRides, setCancelledRides] = useState(23);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: "",
    email: "",
    full_name: "",
    password: "",
    license_number: "",
    car_model: "",
    car_color: "",
    car_number: "",
    car_year: 0,
    commission_rate: 0.2,
  });

  const [creating, setCreating] = useState(false);
  const [alertFormValid, setAlertFormValid] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem("taxigo_authenticated");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://6a65d6763965.ngrok-free.app/api/v1/admin/drivers",
        {
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Haydovchilarni olishda xatolik");
      const data = await res.json();
      setDrivers(data?.drivers || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Yangi haydovchi yaratish
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
        phone_number: "",
        email: "",
        full_name: "",
        password: "",
        license_number: "",
        car_model: "",
        car_color: "",
        car_number: "",
        car_year: 0,
        commission_rate: 0.2,
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

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleLogin = (userData: any) => {
    localStorage.setItem("taxigo_authenticated", "true");
    localStorage.setItem("taxigo_user", JSON.stringify(userData));
    setIsAuthenticated(true);
  };

 if (checkingAuth) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="relative w-24 h-24">
        {[...Array(8)].map((_, index) => {
          const colors = [
            'bg-gray-800', 
            'bg-gray-700', 
            'bg-gray-600',
            'bg-gray-500',
            'bg-gray-400',
            'bg-gray-300', 
            'bg-gray-200',
            'bg-gray-100'
          ];
          
          return (
            <div
              key={index}
              className={`absolute w-2 h-6 rounded-xl ${colors[index]}`}
              style={{
                top: '9px',
                left: '50%',
                transformOrigin: '50% 39px',
                transform: `translateX(-50%) rotate(${index * 45}deg)`,
                animation: `fadeInOut 1.2s linear infinite ${index * 0.15}s`
              }}
            />
          );
        })}
      </div>
      
      <style>{`
        @keyframes fadeInOut {
          0%, 39% { opacity: 0.4; }
          40%, 60% { opacity: 1; }
          61%, 100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

  const validateDriverForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const vehicleModel = formData.get("vehicleModel") as string;
    const vehiclePlate = formData.get("vehiclePlate") as string;

    const isValid =
      firstName?.trim() &&
      lastName?.trim() &&
      phone?.trim() &&
      vehicleModel?.trim() &&
      vehiclePlate?.trim();
    setAlertFormValid(!!isValid);
    return isValid;
  };

  const handleAddDriver = (driverData: any) => {
    setActiveDrivers((prev) => prev + 1);
    setShowAddDriver(false);
    // Success animation
    const successNotification = document.createElement("div");
    successNotification.className =
      "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in";
    successNotification.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="ri-check-line text-xl"></i>
        <span>Haydovchi ${driverData.firstName} ${driverData.lastName} muvaffaqiyatli qo'shildi!</span>
      </div>
    `;
    document.body.appendChild(successNotification);
    setTimeout(() => successNotification.remove(), 3000);
  };

  const handleSendAlert = (message: string) => {
    setShowSendAlert(false);
    const successNotification = document.createElement("div");
    successNotification.className =
      "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in";
    successNotification.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="ri-notification-line text-xl"></i>
        <span>Ogohlantirish muvaffaqiyatli yuborildi!</span>
      </div>
    `;
    document.body.appendChild(successNotification);
    setTimeout(() => successNotification.remove(), 3000);
  };

  const handleCreatePromo = (promoData: any) => {
    setShowCreatePromo(false);
    const successNotification = document.createElement("div");
    successNotification.className =
      "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-in";
    successNotification.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="ri-coupon-line text-xl"></i>
        <span>Aksiya kodi ${promoData.code} yaratildi!</span>
      </div>
    `;
    document.body.appendChild(successNotification);
    setTimeout(() => successNotification.remove(), 3000);
  };

  const handleGenerateReport = (reportType: string) => {
    setShowGenerateReport(false);
    const reportData = `Hisobot turi: ${reportType}\nSana: ${new Date().toLocaleDateString()}\nFaol haydovchilar: ${activeDrivers}\nJami sayohatlar: ${totalRides}`;
    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hisobot-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function setPromoFormValid(arg0: boolean) {
    throw new Error("Function not implemented.");
  }

  return isAuthenticated ? (
    <div className="bg-[#F4F6F8] max-w-8xl min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />
        <main className="pt-20 p-4 lg:p-6">
          <div className="max-w-7.5xl mx-auto space-y-6 lg:space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-slide-up mt-12">
              <KPICard
                title="Faol Haydovchilar"
                value={activeDrivers.toString()}
                change="+12%"
                changeType="increase"
                icon="ri-taxi-line"
                color="transparent"
                iconColor="text-[#1E2A38]"
              />
              <KPICard
                title="Bugungi Jami Sayohatlar"
                value={totalRides.toLocaleString()}
                change="+8%"
                changeType="increase"
                icon="ri-map-pin-line"
                color="transparent"
                iconColor="text-[#00C853]"
              />
              <KPICard
                title="Joriy Sayohatlar"
                value={ongoingRides.toString()}
                change="-3%"
                changeType="decrease"
                icon="ri-timer-line"
                color="transparent"
                iconColor="text-[#FFD100]"
              />
              <KPICard
                title="Bekor Qilingan Sayohatlar"
                value={cancelledRides.toString()}
                change="+15%"
                changeType="increase"
                icon="ri-close-circle-line"
                color="transparent"
                iconColor="text-red-500"
              />
            </div>

            {/* Charts Section */}
            <div className="animate-fade-in-delay">
              <DashboardChart />
            </div>

            {/* Live Map Section */}
            <div className="animate-slide-up-delay">
              <TaxiGoMap />
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 animate-fade-in-delay-2">
              <RecentActivity />

              {/* Quick Actions - Enhanced */}
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 lg:mb-6">
                  Tezkor Amallar
                </h3>

                <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
                  {/* Haydovchi Qo'shish */}
                  <button
                    onClick={() => setShowAddDriver(true)}
                    className="flex flex-col items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-[#F4F6F8] hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap group"
                  >
                    <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <i className="ri-user-add-line text-[#1E2A38] text-lg lg:text-xl"></i>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">
                      Haydovchi Qo'shish
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      alert("Ogohlantirish funksiyasi hali ulanmagan")
                    }
                    className="flex flex-col items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-[#F4F6F8] hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap group"
                  >
                    <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <i className="ri-notification-line text-[#00C853] text-lg lg:text-xl"></i>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">
                      Ogohlantirish Yuborish
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      alert("Aksiya yaratish funksiyasi hali ulanmagan")
                    }
                    className="flex flex-col items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-[#F4F6F8] hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap group"
                  >
                    <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <i className="ri-coupon-line text-[#FFD100] text-lg lg:text-xl"></i>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">
                      Aksiya Yaratish
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      alert("Hisobot yaratish funksiyasi hali ulanmagan")
                    }
                    className="flex flex-col items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-[#F4F6F8] hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap group"
                  >
                    <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <i className="ri-file-text-line text-blue-500 text-lg lg:text-xl"></i>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">
                      Hisobot Yaratish
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <button
                    onClick={() =>
                      alert("Foydalanuvchilar funksiyasi hali ulanmagan")
                    }
                    className="flex flex-col items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-[#F4F6F8] hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap group"
                  >
                    <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <i className="ri-group-line text-purple-500 text-lg lg:text-xl"></i>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">
                      Foydalanuvchilar
                    </span>
                  </button>

                  <button
                    onClick={() => alert("To‘lovlar funksiyasi hali ulanmagan")}
                    className="flex flex-col items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-[#F4F6F8] hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap group"
                  >
                    <div className="w-8 lg:w-10 h-8 lg:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <i className="ri-money-dollar-circle-line text-orange-500 text-lg lg:text-xl"></i>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">
                      To'lovlar
                    </span>
                  </button>
                </div>

                {/* Modal - Haydovchi Qo‘shish */}
                {showAddDriver && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                      <h2 className="text-lg font-semibold mb-4">
                        Haydovchi Qo'shish
                      </h2>

                      <input
                        type="text"
                        placeholder="Ism Familiya"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            full_name: e.target.value,
                          })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="text"
                        placeholder="Telefon"
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_number: e.target.value,
                          })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="password"
                        placeholder="Parol"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="text"
                        placeholder="Guvohnoma raqami"
                        value={formData.license_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            license_number: e.target.value,
                          })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="text"
                        placeholder="Mashina modeli"
                        value={formData.car_model}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            car_model: e.target.value,
                          })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="text"
                        placeholder="Mashina rangi"
                        value={formData.car_color}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            car_color: e.target.value,
                          })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="text"
                        placeholder="Mashina raqami"
                        value={formData.car_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            car_number: e.target.value,
                          })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="number"
                        placeholder="Mashina yili"
                        value={formData.car_year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            car_year: Number(e.target.value),
                          })
                        }
                        className="border w-full p-2 rounded mb-3"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Komissiya stavkasi (masalan: 0.2)"
                        value={formData.commission_rate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            commission_rate: Number(e.target.value),
                          })
                        }
                        className="border w-full p-2 rounded mb-4"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowAddDriver(false)}
                          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          Bekor qilish
                        </button>
                        <button
                          onClick={createDriver}
                          disabled={creating}
                          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {creating ? "Yaratilmoqda..." : "Yaratish"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Haydovchilar ro‘yxati */}
                {loading ? (
                  <p className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <div className="relative flex items-center justify-center">
                      {/* Outer Glow Ring */}
                      <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 via-blue-500 to-cyan-400 animate-pulse blur-xl opacity-40"></div>

                      {/* Spinning Gradient Border */}
                      <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500 animate-spin"></div>

                      {/* Inner Pulsing Circle */}
                      <div className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-ping"></div>

                      {/* Center Dot */}
                      <div className="absolute w-3 h-3 rounded-full bg-white shadow-lg"></div>
                    </div>
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {drivers.map((driver) => (
                      <li
                        key={driver.id}
                        className="border p-2 rounded-lg flex justify-between"
                      >
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-gray-600">
                            {driver.phone}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {driver.licenseNumber}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 lg:mt-16 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="max-w-7xl mx-auto">
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
                    Professional taxi xizmati boshqaruv tizimi. Har bir
                    sayohatni oson va xavfsiz boshqaring.
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
                    Qo'llab-quvvatlash
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
                        Texnik qo'llab-quvvatlash
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-[#1E2A38] transition-colors"
                      >
                        Bog'lanish
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
                      <span className="text-gray-600">shohjaxon@taxigo.uz</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="ri-map-pin-line text-gray-500"></i>
                      <span className="text-gray-600">
                        Toshkent, O'zbekiston
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 lg:mt-8 pt-4 lg:pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm text-center md:text-left">
                  2024 <span className="font-[`Pacifico`]">TaxiGo</span> Admin
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
        </main>
      </div>

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

            <form
              onSubmit={async (e) => {
                createDriver()
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-4 lg:space-y-6">
                  <h4 className="font-semibold text-gray-800 text-base lg:text-lg">
                    Shaxsiy Ma'lumotlar
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To‘liq ism
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
                      Telefon raqam
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
                      Email
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
                      Parol
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
                      Guvohnoma raqami
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mashina modeli
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
                      Mashina rangi
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
                      Mashina raqami
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
                      Mashina yili
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.car_year}
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
                      Komissiya %
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.commission_rate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commission_rate: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="0.2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
                <button
                  type="submit"
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
            </form>
          </div>
        </div>
      )}

      {/* Send Alert Modal */}
      {showSendAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                Ogohlantirish Yuborish
              </h3>
              <button
                onClick={() => setShowSendAlert(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-gray-500 text-xl"></i>
              </button>
            </div>
            <textarea
              id="alertMessage"
              placeholder="Xabar matni..."
              className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              maxLength={500}
              onChange={(e) =>
                setAlertFormValid(e.target.value.trim().length > 0)
              }
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  const message = (
                    document.getElementById(
                      "alertMessage"
                    ) as HTMLTextAreaElement
                  ).value;
                  handleSendAlert(message);
                }}
                disabled={!setAlertFormValid}
                className="flex-1 bg-[#00C853] text-white py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                Yuborish
              </button>
              <button
                onClick={() => setShowSendAlert(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Promo Modal */}
      {showCreatePromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                Aksiya Kodi Yaratish
              </h3>
              <button
                onClick={() => setShowCreatePromo(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-gray-500 text-xl"></i>
              </button>
            </div>
            <div
              className="space-y-4"
              onChange={() => {
                const code = (
                  document.getElementById("promoCode") as HTMLInputElement
                )?.value;
                const discount = (
                  document.getElementById("promoDiscount") as HTMLInputElement
                )?.value;
                const date = (
                  document.getElementById("promoDate") as HTMLInputElement
                )?.value;
                setPromoFormValid(
                  !!code?.trim() && !!discount?.trim() && !!date?.trim()
                );
              }}
            >
              <input
                id="promoCode"
                type="text"
                placeholder="Aksiya kodi (SALE20)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <input
                id="promoDiscount"
                type="number"
                placeholder="Chegirma foizi"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <input
                id="promoDate"
                type="date"
                placeholder="Amal qilish muddati"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  const code = (
                    document.getElementById("promoCode") as HTMLInputElement
                  ).value;
                  handleCreatePromo({ code });
                }}
                disabled={!setPromoFormValid}
                className="flex-1 bg-[#FFD100] text-[#1E2A38] py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:text-white"
              >
                Yaratish
              </button>
              <button
                onClick={() => setShowCreatePromo(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                Hisobot Yaratish
              </h3>
              <button
                onClick={() => setShowGenerateReport(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-gray-500 text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <select
                id="reportType"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 pr-8"
              >
                <option>Kunlik hisobot</option>
                <option>Haftalik hisobot</option>
                <option>Oylik hisobot</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => {
                  const reportType = (
                    document.getElementById("reportType") as HTMLSelectElement
                  ).value;
                  handleGenerateReport(reportType);
                }}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
              >
                Yuklab olish
              </button>
              <button
                onClick={() => setShowGenerateReport(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all duration-200 transform hover:scale-[1.02] whitespace-nowrap"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Login onLogin={handleLogin} />
  );
}
function setIsAuthenticated(arg0: boolean) {
  console.log("isAuthenticated:", arg0);
}

function setUser(arg0: any) {
  console.log("isAuthenticated:", arg0);
}

// setAlertFormValid function is already defined above
