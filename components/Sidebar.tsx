"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Boshqaruv Paneli",
    href: "/dashboard/",
    icon: "ri-dashboard-line",
  },
  // {
  //   name: 'Sayohatlar',
  //   href: '/rides',
  //   icon: 'ri-taxi-line'
  // },
  {
    name: "Delete-account",
    href: "/delete-account",
    icon: "ri-wallet-line",
  },
  {
    name: "Haydovchilar",
    href: "/drivers",
    icon: "ri-user-3-line",
  },
  {
    name: "Foydalanuvchilar",
    href: "/users",
    icon: "ri-group-line",
  },
  {
    name: "To'lovlar",
    href: "/payments",
    icon: "ri-wallet-line",
  },
  {
    name: "Hisobotlar",
    href: "/reports",
    icon: "ri-bar-chart-line",
  },
  {
    name: "Aksiyalar",
    href: "/promotions",
    icon: "ri-coupon-line",
  },
  {
    name: "Safarlar",
    href: "/trips",
    icon: "ri-road-map-line",
  },
  {
    name: "Bildirishnomalar",
    href: "/notifications",
    icon: "ri-notification-line",
  },
  {
    name: "Qo'llab-quvvatlash",
    href: "/support",
    icon: "ri-customer-service-line",
  },
  {
    name: "Sozlamalar",
    href: "/settings",
    icon: "ri-settings-line",
  },
];



export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E2A38] text-white rounded-lg"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <i
            className={`ri-${isMobileMenuOpen ? "close" : "menu"}-line text-xl`}
          ></i>
        </div>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-[#1E2A38] h-screen transition-all duration-300 fixed left-0 top-0 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "lg:translate-x-0 -translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD100] rounded-lg flex items-center justify-center">
              <i className="ri-taxi-fill text-[#1E2A38] text-xl"></i>
            </div>
            {!isCollapsed && (
              <h3 className="text-xl font-bold text-white font-['Pacifico']">
                TaxiGo Admin{" "}
              </h3>
            )}
          </div>
        </div>

        <nav className="px-4">
  {menuItems
    .filter(item => item.name !== 'Delete-account')
    .map((item) => {
      // isActive ni har bir item uchun hisoblaymiz
      const cleanedPath = pathname.replace(/\/$/, '');
      const itemPath = item.href.replace(/\/$/, '');
      const isActive = cleanedPath === itemPath;

      return (
        <Link 
          key={item.name}
          href={item.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200
            ${isActive 
              ? 'bg-white/10 text-white'  // faollashtirilgan rang hover bilan bir xil
              : 'text-gray-300 hover:bg-white/10'
            }
          `}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`${item.icon} text-lg`}></i>
          </div>
          {!isCollapsed && (
            <span className="font-medium whitespace-nowrap">{item.name}</span>
          )}
        </Link>
      );
    })}
</nav>


        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block absolute bottom-6 left-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-all duration-200"
        >
          <div className="w-5 h-5 flex items-center justify-center mx-auto">
            <i
              className={`ri-${
                isCollapsed ? "arrow-right" : "arrow-left"
              }-s-line text-lg`}
            ></i>
          </div>
        </button>
      </div>
    </>
  );

  
}
