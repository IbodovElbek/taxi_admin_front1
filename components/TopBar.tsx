"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "../api"; // API utils ni import qilish
import Login from "../app/login/Login";
import { motion, AnimatePresence } from "framer-motion";
import { get } from "http";

interface Notification {
  id: number;
  text: string;
  time: string;
  type: "warning" | "error" | "success" | "info";
  read: boolean;
  created_at?: string;
  title?: string;
}

interface User {
  email: string;
  role: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export default function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // User ma'lumotlarini olish

  // Bildirishnomalarni yuklash
  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      if (response && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Bildirishnomalar yuklashda xato:", error);
      // Fallback ma'lumotlar
      setNotifications([
        {
          id: 1,
          text: "Yangi haydovchi ro'yxatdan o'tish uchun kutmoqda",
          time: "2 daqiqa oldin",
          type: "warning",
          read: false,
        },
        {
          id: 2,
          text: "Foydalanuvchi #12345 tomonidan to'lov muammosi xabar qilindi",
          time: "5 daqiqa oldin",
          type: "error",
          read: false,
        },
        {
          id: 3,
          text: "Haydovchi John 100 ta sayohat bosqichiga erishdi",
          time: "10 daqiqa oldin",
          type: "success",
          read: true,
        },
      ]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Bildirishnomani o'qilgan deb belgilash
  const markAsRead = async (id: number) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Bildirishnomani belgilashda xato:", error);
      // Local holat o'zgarishi
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    }
  };

  // Barcha bildirishnomalarni o'qilgan deb belgilash
  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error("Barcha bildirishnomalarni belgilashda xato:", error);
    }
  };

  const handleLogout = async () => {
    // logout jarayoni
    try {
      console.log("🚪 Logout jarayoni...");
      localStorage.clear();
      sessionStorage.clear();

      setLoggedOut(true); // Login page ko‘rsatish
    } catch (error) {
      console.error(error);
    }
  };

  if (loggedOut) {
    return <Login />; // sahifa sifatida ko‘rsatish
  }

  // Qidiruv funksiyasi
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      console.log("🔍 Qidiruv:", query);
      // Bu yerda qidiruv API ni chaqirish
      // const results = await api.search(query);
      // Qidiruv natijalarini ko'rsatish logic
    } catch (error) {
      console.error("Qidiruv xatosi:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Search input handler
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  // User ma'lumotlarini olish
useEffect(() => {
  try {
    const stored = localStorage.getItem("taxigo_user");
    if (stored) {
      const parsed = JSON.parse(stored);

      setUser({
        email: parsed.email || "",
        role: parsed.role || "admin",       // Agar role yo'q bo'lsa default admin
        fullName: parsed.name || "Admin",
      });
    }
  } catch (err) {
    console.error("User local storage parse error:", err);
  }
}, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // User initials
  const getUserInitials = (user: User | null): string => {
    if (!user) return "U";

    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    }

    if (user.fullName) {
      const names = user.fullName.split(" ");
      return names.length > 1
        ? `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }

    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  // User display name
  const getUserDisplayName = (user: User | null): string => {
    if (!user) return "Foydalanuvchi";
    return user.fullName || user.email || "Foydalanuvchi";
  };

  // Role display
  const getRoleDisplay = (role: string): string => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "super_admin":
        return "Super Admin";
      case "manager":
        return "Manager";
      case "driver":
        return "Haydovchi";
      case "user":
        return "Foydalanuvchi";
      default:
        return "Foydalanuvchi";
    }
  };

  return (
    <>
      <div className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 lg:left-64 left-0 right-0 z-30">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <i className="ri-menu-line text-xl text-gray-600"></i>
          </button>
          <h3 className="text-xl font-bold text-gray-800 font-['Pacifico']">
            TaxiGo
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Sayohatlar, haydovchilar, foydalanuvchilar qidirish..."
              className="bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-2 pl-10 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              disabled={isSearching}
            />
            <div className="w-5 h-5 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
              {isSearching ? (
                <i className="ri-loader-4-line animate-spin text-gray-400"></i>
              ) : (
                <i className="ri-search-line text-gray-400"></i>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-[#F4F6F8] hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-notification-line text-gray-600"></i>
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    Bildirishnomalar
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Barchasini o'qilgan deb belgilash
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="px-4 py-8 text-center">
                      <i className="ri-loader-4-line animate-spin text-gray-400 text-xl"></i>
                      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
                      </div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <i className="ri-notification-off-line text-gray-400 text-2xl"></i>
                      <p className="text-sm text-gray-500 mt-2">
                        Bildirishnomalar yo'q
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors ${
                          !notification.read
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.type === "warning"
                                ? "bg-yellow-500"
                                : notification.type === "error"
                                ? "bg-red-500"
                                : notification.type === "info"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            {notification.title && (
                              <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                                {notification.title}
                              </p>
                            )}
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {notification.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      // Navigate to notifications page
                      window.location.href = "/notifications";
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Barchasini ko'rish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            {/* Trigger Button */}
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-600"
              />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-#1B2430 truncate max-w-32">
                 {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.role ? getRoleDisplay(user.role) : "Administrator"}
                </p>
              </div>
              <div className="w-4 h-4 flex items-center justify-center">
                <i
                  className={`ri-arrow-down-s-line text-gray-400 transition-transform duration-200 ${
                    showProfile ? "rotate-180" : ""
                  }`}
                ></i>
              </div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-72 bg-[#1E2A38] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-gray-700 flex items-center gap-3">
                    <img
                      src="https://i.pravatar.cc/150?img=12"
                      alt="Avatar"
                      className="w-12 h-12 rounded-full border border-gray-600"
                    />
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white">
                       {getUserDisplayName(user)}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {getUserInitials(user)}@example.com 
                      </p>
                      <p className="text-xs text-green-400 font-medium">
                        {user?.role
                          ? getRoleDisplay(user.role)
                          : "Administrator"}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        window.location.href = "/profile";
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1B2430] hover:text-white w-full text-left transition-colors duration-200"
                    >
                      <i className="ri-user-line text-lg"></i>
                      <span>Profil Sozlamalari</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfile(false);
                        window.location.href = "/settings";
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1B2430] hover:text-white w-full text-left transition-colors duration-200"
                    >
                      <i className="ri-settings-3-line text-lg"></i>
                      <span>Parametrlar</span>
                    </button>

                    {user?.role === "admin" && (
                      <>
                        <button
                          onClick={() => {
                            setShowProfile(false);
                            window.location.href = "/admin/users";
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1B2430] hover:text-white w-full text-left transition-colors duration-200"
                        >
                          <i className="ri-team-line text-lg"></i>
                          <span>Foydalanuvchilar</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfile(false);
                            window.location.href = "/admin/analytics";
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1B2430] hover:text-white w-full text-left transition-colors duration-200"
                        >
                          <i className="ri-bar-chart-2-line text-lg"></i>
                          <span>Statistika</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-700 my-2"></div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      setShowLogoutConfirm(true);
                    }}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <i className="ri-loader-4-line animate-spin text-lg"></i>
                    ) : (
                      <i className="ri-logout-box-line text-lg"></i>
                    )}
                    <span>{isLoggingOut ? "Chiqilmoqda..." : "Chiqish"}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-red-500">
                <i className="ri-question-line text-4xl"></i>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tizimdan chiqishni xohlaysizmi?
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Barcha ochiq sessiyalar yakunlanadi va qayta kirish talab
                qilinadi.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={isLoggingOut}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Bekor qilish
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoggingOut && (
                    <i className="ri-loader-4-line animate-spin"></i>
                  )}
                  {isLoggingOut ? "Chiqilmoqda..." : "Ha, chiqish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
