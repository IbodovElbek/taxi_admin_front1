
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const rideData = [
  { name: 'Mon', rides: 142 },
  { name: 'Tue', rides: 158 },
  { name: 'Wed', rides: 187 },
  { name: 'Thu', rides: 203 },
  { name: 'Fri', rides: 245 },
  { name: 'Sat', rides: 312 },
  { name: 'Sun', rides: 298 }
];

const pieData = [
  { name: 'Standard', value: 65, color: '#1E2A38', icon: 'ri-car-line' },
  { name: 'Comfort', value: 25, color: '#FFD100', icon: 'ri-roadster-line' },
  { name: 'Business', value: 10, color: '#00C853', icon: 'ri-taxi-wifi-line' }
];

export default function DashboardChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Daily Ride Requests</h3>
          <select className="bg-[#F4F6F8] border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rideData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="rides" 
                stroke="#1E2A38" 
                fill="#1E2A38" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Ride Types Distribution</h3>
        <div className="space-y-4">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center" style={{ borderRadius: '6px' }}>
                  <i className={`${item.icon} style={{ backgroundColor: item.color, borderRadius: '6px' }} text-lg`}></i>
                </div>
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Rides Today</span>
            <span className="font-semibold text-gray-900">1,247</span>
          </div>
        </div>
      </div>
    </div>
  );
}