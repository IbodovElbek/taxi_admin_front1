"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "Yan", rides: 1240, revenue: 18600000, drivers: 45 },
  { month: "Fev", rides: 1450, revenue: 21750000, drivers: 52 },
  { month: "Mar", rides: 1680, revenue: 25200000, drivers: 58 },
  { month: "Apr", rides: 1520, revenue: 22800000, drivers: 55 },
  { month: "May", rides: 1890, revenue: 28350000, drivers: 62 },
  { month: "Iyn", rides: 2100, revenue: 31500000, drivers: 68 },
];

const driverPerformance = [
  { name: "Jasur Toshev", rides: 342, rating: 4.8, revenue: "2450000" },
  { name: "Bobur Rahmonov", rides: 528, rating: 4.9, revenue: "3680000" },
  { name: "Sanjar Umarov", rides: 289, rating: 4.7, revenue: "1980000" },
  { name: "Aziz Jurayev", rides: 445, rating: 4.6, revenue: "3200000" },
  { name: "Otabek Nazarov", rides: 156, rating: 4.6, revenue: "890000" },
];

const areaData = [
  { area: "Toshkent Markazi", rides: 450, percentage: 35 },
  { area: "Yunusobod", rides: 320, percentage: 25 },
  { area: "Chilonzor", rides: 280, percentage: 22 },
  { area: "Mirzo Ulug'bek", rides: 150, percentage: 12 },
  { area: "Boshqa hududlar", rides: 80, percentage: 6 },
];

const COLORS = ["#1E2A38", "#FFD100", "#00C853", "#FF6B6B", "#9C27B0"];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [activeReport, setActiveReport] = useState("overview");

  const generateReport = (type: string) => {
    const reportData = {
      overview: `UMUMIY HISOBOT
Davr: So'nggi 6 oy
Sana: ${new Date().toLocaleDateString()}

ASOSIY KO'RSATKICHLAR:
- Jami sayohatlar: ${monthlyData
        .reduce((sum, item) => sum + item.rides, 0)
        .toLocaleString()}
- Jami daromad: ${monthlyData
        .reduce((sum, item) => sum + item.revenue, 0)
        .toLocaleString()} so'm
- Faol haydovchilar: ${monthlyData[monthlyData.length - 1].drivers}

OYLIK STATISTIKA:
${monthlyData
  .map(
    (item) =>
      `${item.month}: ${
        item.rides
      } sayohat, ${item.revenue.toLocaleString()} so'm`
  )
  .join("\n")}`,
      drivers: `HAYDOVCHILAR HISOBOTI
Eng faol haydovchilar:
${driverPerformance
  .map(
    (driver, index) =>
      `${index + 1}. ${driver.name}
     - Sayohatlar: ${driver.rides}
     - Reyting: ${driver.rating}
     - Daromad: ${parseInt(driver.revenue).toLocaleString()} so'm`
  )
  .join("\n\n")}`,
      areas: `HUDUDLAR BO'YICHA HISOBOT
Eng ommabop yo'nalishlar:
${areaData
  .map(
    (area, index) =>
      `${index + 1}. ${area.area}: ${area.rides} sayohat (${area.percentage}%)`
  )
  .join("\n")}`,
    };

    const blob = new Blob([reportData[type as keyof typeof reportData]], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hisobot-${type}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Hisobotlar va Analitika
                </h1>
                <p className="text-gray-600">
                  Biznes ko'rsatkichlarini tahlil qiling va hisobotlarni yuklab
                  oling
                </p>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1month">So'nggi oy</option>
                  <option value="3months">So'nggi 3 oy</option>
                  <option value="6months">So'nggi 6 oy</option>
                  <option value="1year">So'nggi yil</option>
                </select>
                <button
                  onClick={() => generateReport("overview")}
                  className="bg-[#1E2A38] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
                >
                  Hisobot Yuklab Olish
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <i className="ri-car-line text-blue-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {monthlyData
                        .reduce((sum, item) => sum + item.rides, 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Jami Sayohatlar</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <i className="ri-money-dollar-circle-line text-green-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {(
                        monthlyData.reduce(
                          (sum, item) => sum + item.revenue,
                          0
                        ) / 1000000
                      ).toFixed(1)}
                      M
                    </p>
                    <p className="text-sm text-gray-600">Jami Daromad (so'm)</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <i className="ri-group-line text-purple-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {monthlyData[monthlyData.length - 1].drivers}
                    </p>
                    <p className="text-sm text-gray-600">Faol Haydovchilar</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <i className="ri-bar-chart-line text-orange-600 text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.round(
                        monthlyData.reduce(
                          (sum, item) => sum + item.revenue,
                          0
                        ) /
                          monthlyData.reduce(
                            (sum, item) => sum + item.rides,
                            0
                          ) /
                          1000
                      )}
                      K
                    </p>
                    <p className="text-sm text-gray-600">
                      O'rtacha Sayohat Narxi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Revenue */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Oylik Daromad Tahlili
                  </h3>
                  <button
                    onClick={() => generateReport("overview")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Yuklab olish
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value: any) => [
                          `${(value / 1000000).toFixed(1)}M so'm`,
                          "Daromad",
                        ]}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#1E2A38"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Rides */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Oylik Sayohatlar Soni
                  </h3>
                  <button
                    onClick={() => generateReport("overview")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Yuklab olish
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value: any) => [`${value}`, "Sayohatlar"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="rides"
                        stroke="#00C853"
                        strokeWidth={3}
                        dot={{ fill: "#00C853", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Additional Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Drivers */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Eng Faol Haydovchilar
                  </h3>
                  <button
                    onClick={() => generateReport("drivers")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Yuklab olish
                  </button>
                </div>
                <div className="space-y-4">
                  {driverPerformance.map((driver, index) => (
                    <div
                      key={index}
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
                            {driver.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {driver.rides} sayohat
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {parseInt(driver.revenue).toLocaleString()} so'm
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-star-fill text-yellow-400 text-xs"></i>
                          </div>
                          <span className="text-sm text-gray-600">
                            {driver.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Areas */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Ommabop Hududlar
                  </h3>
                  <button
                    onClick={() => generateReport("areas")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Yuklab olish
                  </button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={areaData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="rides"
                      >
                        {areaData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          `${value} sayohat (${props.payload.percentage}%)`,
                          props.payload.area,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {areaData.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full`}
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {area.area}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {area.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Hisobotlarni Yuklab Olish
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => generateReport("overview")}
                  className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-file-text-line text-white"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Umumiy Hisobot</p>
                    <p className="text-sm text-gray-600">
                      Barcha ko'rsatkichlar
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => generateReport("drivers")}
                  className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-group-line text-white"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">
                      Haydovchilar Hisoboti
                    </p>
                    <p className="text-sm text-gray-600">Faollik va daromad</p>
                  </div>
                </button>

                <button
                  onClick={() => generateReport("areas")}
                  className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-map-pin-line text-white"></i>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">
                      Hududlar Hisoboti
                    </p>
                    <p className="text-sm text-gray-600">
                      Ommabop yo'nalishlar
                    </p>
                  </div>
                </button>
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
                        <span className="text-gray-600">admin@taxigo.uz</span>
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
                    2024 <span className="font-['Pacifico']">TaxiGo</span> Admin
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
        </main>
      </div>
    </div>
  );
}
