"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { api } from "@/api";

/**
 * Notifications Admin Page
 * - 3 ta aktiv tab: Bulk, Individual User, Individual Driver
 * - Har bir tab uchun alohida validation
 * - UI butunlay saqlanib qolgan
 * - History barcha notification turlarini ko'rsatadi
 */
export default function NotificationsPage() {
  // ============ TAB STATE ============
  const [activeTab, setActiveTab] = useState<
    "bulk" | "individual_user" | "individual_driver"
  >("bulk");

  // ============ FORM STATES ============
  const [recipientType, setRecipientType] = useState("all_users");
  const [userId, setUserId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [action, setAction] = useState("");

  // ============ UI STATES ============
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // ============ HISTORY STATES ============
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchingMore, setFetchingMore] = useState(false);

  // ============ HELPER FUNCTIONS ============
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  /**
   * Validate required fields based on active tab
   * - Bulk: recipientType, title, body
   * - Individual User: userId, title, body
   * - Individual Driver: driverId, title, body
   */
  const canSend = () => {
    if (sending) return false;
    if (!title.trim() || !body.trim()) return false;

    if (activeTab === "bulk") {
      return recipientType ? true : false;
    } else if (activeTab === "individual_user") {
      return userId.trim().length > 0;
    } else if (activeTab === "individual_driver") {
      return driverId.trim().length > 0;
    }
    return false;
  };

  /**
   * Send notification based on active tab
   * - Constructs payload dynamically
   * - Handles success/error states
   * - Refreshes history on success
   */
  const sendNotification = async () => {
    if (!canSend()) return;
    setSending(true);

    let payload: any = {
      title: title.trim(),
      body: body.trim(),
      action: action?.trim() || null,
    };

    // Construct payload based on active tab
    if (activeTab === "bulk") {
      payload.recipient_type =
        recipientType === "all_users"
          ? "all"
          : recipientType === "drivers"
          ? "drivers"
          : "customers";
    } else if (activeTab === "individual_user") {
      payload.recipient_type = "individual";
      payload.user_id = userId.trim();
    } else if (activeTab === "individual_driver") {
      payload.recipient_type = "individual_driver";
      payload.driver_id = driverId.trim();
    }

    try {
      await axios.post("/admin/notifications/send", payload);
      showToast("success", "Notification sent successfully! 🎉");

      // Clear all form inputs on success
      setTitle("");
      setBody("");
      setAction("");
      setUserId("");
      setDriverId("");

      // Refresh history to show new notification
      setOffset(0);
      await fetchHistory(true);
    } catch (err: any) {
      console.error("Send notification error:", err);
      const message =
        err?.response?.data?.message || "Failed to send notification";
      showToast("error", message);
    } finally {
      setSending(false);
    }
  };

  /**
   * Fetch notification history with pagination and search
   * @param reset - If true, resets history and starts from offset 0
   */
  const fetchHistory = async (reset = false) => {
    try {
      if (reset) {
        setLoadingHistory(true);
        setOffset(0);
      } else {
        setFetchingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      const params: any = { limit, offset: currentOffset };
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await api.getAdminNotifications(params);
      const items: any[] = res.data?.notifications || res.data || [];

      if (reset) {
        setHistory(items);
        setHasMore(items.length === limit);
        setOffset(items.length);
      } else {
        setHistory((prev) => [...prev, ...items]);
        setHasMore(items.length === limit);
        setOffset((prev) => prev + items.length);
      }
    } catch (err) {
      console.error("Fetch history error:", err);
      showToast("error", "Could not load notification history");
    } finally {
      setLoadingHistory(false);
      setFetchingMore(false);
    }
  };

  /**
   * Reset all form fields to initial state
   */
  const resetForm = () => {
    setRecipientType("all_users");
    setUserId("");
    setDriverId("");
    setTitle("");
    setBody("");
    setAction("");
  };

  // ============ EFFECTS ============
  useEffect(() => {
    fetchHistory(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ RENDER ============
  return (
    <div className="bg-[#F4F6F8] min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 ml-0">
        <TopBar />

        <main className="pt-20 p-6">
          <div className="max-w-7xl mx-auto">
            {/* ============ HEADER ============ */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Notifications
                </h1>
                <p className="text-gray-600">
                  Send push notifications and review sent history
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ============ SEND NOTIFICATION CARD ============ */}
              <div className="lg:col-span-1 bg-white rounded-[12px] p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Send Notification
                </h2>

                {/* ============ TABS ============ */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("bulk")}
                    className={`pb-3 px-4 text-sm font-medium transition-all relative ${
                      activeTab === "bulk"
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Bulk
                    {activeTab === "bulk" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("individual_user")}
                    className={`pb-3 px-4 text-sm font-medium transition-all relative ${
                      activeTab === "individual_user"
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    User
                    {activeTab === "individual_user" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("individual_driver")}
                    className={`pb-3 px-4 text-sm font-medium transition-all relative ${
                      activeTab === "individual_driver"
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Driver
                    {activeTab === "individual_driver" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                    )}
                  </button>
                </div>

                {/* ============ FORM FIELDS ============ */}
                <div className="space-y-4">
                  {/* BULK TAB - Recipient Type Dropdown */}
                  {activeTab === "bulk" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg pr-8 focus:outline-none focus:ring-2 appearance-none focus:ring-blue-500 transition-all"
                        required
                      >
                        <option value="all_users">All Users</option>
                        <option value="drivers">All Drivers</option>
                        <option value="customers">All Customers</option>
                      </select>
                    </div>
                  )}

                  {/* INDIVIDUAL USER TAB - User ID Input */}
                  {activeTab === "individual_user" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter user ID (e.g., user_12345)"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Enter the specific user ID to send notification
                      </p>
                    </div>
                  )}

                  {/* INDIVIDUAL DRIVER TAB - Driver ID Input */}
                  {activeTab === "individual_driver" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Driver ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter driver ID (e.g., drv_67890)"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Enter the specific driver ID to send notification
                      </p>
                    </div>
                  )}

                  {/* TITLE - Common for all tabs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter notification title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* BODY - Common for all tabs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Message{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Enter the notification content"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* ACTION - Optional for all tabs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. fetch_sms, open_trip"
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3">
                    <button
                      onClick={sendNotification}
                      disabled={!canSend()}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white transition-all whitespace-nowrap ${
                        canSend()
                          ? "bg-[#1E2A38] hover:bg-opacity-90 hover:shadow-md"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {sending && (
                        <svg
                          className="w-5 h-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="white"
                            strokeWidth="4"
                            className="opacity-25"
                          ></circle>
                          <path
                            d="M4 12a8 8 0 018-8"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="opacity-75"
                          ></path>
                        </svg>
                      )}
                      <span>Send Notification</span>
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all hover:shadow"
                    >
                      Reset
                    </button>
                  </div>

                  {/* INFO NOTE */}
                  <p className="text-xs text-gray-500">
                    Note: The notification will be posted to{" "}
                    <code className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 mt-8">
                      /admin/notifications/send
                    </code>
                  </p>
                </div>
              </div>

              {/* ============ NOTIFICATION HISTORY CARD ============ */}
              <div className="lg:col-span-2 bg-white rounded-[12px] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Notification History
                  </h2>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search by title or recipient"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchHistory(true)}
                      className="p-2 border border-gray-200 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                      onClick={() => fetchHistory(true)}
                      className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all hover:shadow"
                      title="Search"
                    >
                      <i className="ri-search-line"></i>
                    </button>
                  </div>
                </div>

                {/* LOADING STATE */}
                {loadingHistory ? (
                  <div className="py-12 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#CBD5E1"
                        strokeWidth="4"
                        className="opacity-25"
                      ></circle>
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="#1E2A38"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="opacity-75"
                      ></path>
                    </svg>
                  </div>
                ) : history.length === 0 ? (
                  /* EMPTY STATE */
                  <div className="py-12 text-center text-gray-500">
                    <div className="mx-auto mb-4 w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-notification-line text-3xl"></i>
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      No notifications sent yet
                    </p>
                    <p className="text-sm mt-2">
                      When you send notifications, they will appear here.
                    </p>
                  </div>
                ) : (
                  /* HISTORY TABLE */
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-sm text-gray-600 border-b border-gray-200">
                          <th className="py-3 px-4">📅 Date/Time</th>
                          <th className="py-3 px-4">🎯 Recipient</th>
                          <th className="py-3 px-4">🏷️ Title</th>
                          <th className="py-3 px-4">💬 Message</th>
                          <th className="py-3 px-4">⚙️ Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item: any, idx) => (
                          <tr
                            key={item.id || item._id || idx}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-gray-700 w-40">
                              {item.sent_at || item.sentAt || item.date || "—"}
                            </td>
                            <td className="py-3 px-4 text-sm w-36">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {item.recipient_type ||
                                  item.recipients ||
                                  "all"}
                              </span>
                              {(item.user_id || item.driver_id) && (
                                <div className="text-xs text-gray-500 mt-1 font-mono">
                                  ID: {item.user_id || item.driver_id}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                              {item.title}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 max-w-[40ch]">
                              <div
                                className="truncate"
                                title={item.body || item.content}
                              >
                                {item.body || item.content}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {item.action || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* LOAD MORE BUTTON */}
                    <div className="mt-4 flex justify-center">
                      {hasMore ? (
                        <button
                          onClick={() => fetchHistory(false)}
                          disabled={fetchingMore}
                          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {fetchingMore ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="#CBD5E1"
                                  strokeWidth="4"
                                  className="opacity-25"
                                ></circle>
                                <path
                                  d="M4 12a8 8 0 018-8"
                                  stroke="#1E2A38"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  className="opacity-75"
                                ></path>
                              </svg>
                              Loading...
                            </span>
                          ) : (
                            "Load More"
                          )}
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No more notifications
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* ============ TOAST NOTIFICATION ============ */}
        {toast && (
          <div
            className={`fixed right-6 top-6 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="font-medium">{toast.message}</div>
              <button
                onClick={() => setToast(null)}
                className="ml-3 opacity-80 hover:opacity-100 transition-opacity"
              >
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
                    <span className="text-gray-600">
                      Toshkent, O\'zbekiston
                    </span>
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
