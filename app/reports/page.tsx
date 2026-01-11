"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../api";
import { AnalyticsResponse, MonthlyStat } from "../../types";
import { DatePicker, Spin, message } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

// Transform MonthlyBreakdown to array for Recharts
const transformMonthlyData = (monthlyBreakdown: { [key: string]: MonthlyStat } | undefined) => {
  if (!monthlyBreakdown) return [];
  return Object.entries(monthlyBreakdown).map(([month, stats]) => ({
    month,
    rides: stats.total_trips,
    revenue: stats.total_revenue,
  }));
};

export default function ReportsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [driverLimit, setDriverLimit] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = { driver_limit: driverLimit };
      if (dateRange[0] && dateRange[1]) {
        params.start_date = dateRange[0].toISOString();
        params.end_date = dateRange[1].toISOString();
      }

      const response = await api.getAnalytics(params);
      setData(response);
    } catch (error) {
      message.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange, driverLimit]);

  const handleExport = async () => {
    try {
      const params: any = {};
      if (dateRange[0] && dateRange[1]) {
        params.start_date = dateRange[0].toISOString();
        params.end_date = dateRange[1].toISOString();
      }

      const blob = await api.exportAnalytics(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_export_${dayjs().format('YYYY-MM-DD')}.xlsx`; // Yoki formatga qarab
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      message.error("Export qilishda xatolik yuz berdi");
    }
  };

  const chartData = transformMonthlyData(data?.monthly_breakdown);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F6F8]">
        <Spin size="large" />
      </div>
    )
  }

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
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Hisobotlar va Analitika
                </h1>
                <p className="text-gray-600">
                  Biznes ko'rsatkichlarini tahlil qiling va hisobotlarni yuklab
                  oling
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <RangePicker
                  onChange={(dates) => {
                    // @ts-ignore
                    setDateRange(dates);
                  }}
                  className="h-10"
                />
                <button
                  onClick={handleExport}
                  className="bg-[#1E2A38] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                >
                  Export Data
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
                    <i className="ri-car-line text-blue-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {data?.total_completed_trips?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Jami Sayohatlar</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-green-50 rounded-lg">
                    <i className="ri-money-dollar-circle-line text-green-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {(data?.total_revenue || 0).toLocaleString()} so'm
                    </p>
                    <p className="text-sm text-gray-600">Jami Daromad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Oylik Daromad va Sayohatlar
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#666" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      name="Daromad"
                      fill="#1E2A38"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="rides"
                      name="Sayohatlar"
                      fill="#00C853"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Drivers */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Faol Haydovchilar
                  </h3>
                  <select
                    value={driverLimit}
                    onChange={(e) => setDriverLimit(Number(e.target.value))}
                    className="border border-gray-200 rounded px-2 py-1 text-sm outline-none"
                  >
                    <option value="5">Top 5</option>
                    <option value="10">Top 10</option>
                    <option value="20">Top 20</option>
                  </select>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {data?.driver_stats?.map((driver, index: number) => (
                    <div
                      key={driver.driver_id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#1E2A38] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {driver.full_name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {driver.total_trips} sayohat
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {driver.total_earnings.toLocaleString()} so'm
                        </p>
                        <p className="text-xs text-gray-500">
                          Komissiya: {driver.total_commission.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!data?.driver_stats || data.driver_stats.length === 0) && (
                    <p className="text-center text-gray-500 py-4">Ma'lumot yo'q</p>
                  )}
                </div>
              </div>

              {/* Regional Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Hududiy Statistika
                  </h3>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {data?.regional_stats?.map((region, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <i className="ri-map-pin-line text-gray-500"></i>
                        <span className="text-sm font-medium text-gray-800">
                          {region.region_name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#1E2A38] bg-gray-100 px-3 py-1 rounded-full">
                        {region.total_trips} sayohat
                      </span>
                    </div>
                  ))}
                  {(!data?.regional_stats || data.regional_stats.length === 0) && (
                    <p className="text-center text-gray-500 py-4">Ma'lumot yo'q</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>

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
    </div>
  );
}
