
'use client';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: string;
  color: string;
  iconColor?: string;
}

export default function KPICard({ title, value, change, changeType, icon, color, iconColor }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              changeType === 'increase' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <div className="w-3 h-3 flex items-center justify-center">
                <i className={`ri-arrow-${changeType === 'increase' ? 'up' : 'down'}-line`}></i>
              </div>
              {change}
            </div>
            <span className="text-gray-500 text-xs">o'tgan haftaga nisbatan</span>
          </div>
        </div>
        <div className="w-16 h-16 flex items-center justify-center">
          <i className={`${icon} text-4xl ${iconColor || 'text-gray-400'} hover:scale-110 transition-transform duration-200`}></i>
        </div>
      </div>
    </div>
  );
}
