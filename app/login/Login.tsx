import React, { useState, useEffect } from "react";
import { api } from "../../api"; // api.ts faylni import
import { LoginResponse } from "@/types";

interface LoginPageProps {
  onLogin: (userData: AdminData) => void;
}

interface FormData {
  phoneNumber: string;
  password: string;
  rememberMe: boolean;
}

interface Errors {
  [key: string]: string;
}

interface AdminData {
  phone: string;
  name: string;
  email: string;
  adminId: string;
  permissions: string[];
  loginTime: string;
  isLoggedIn: boolean;
  token: string;
  lastLoginTime?: string;
  [key: string]: any;
}

interface ApiLoginResponse {
  success: boolean;
  access_token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    phone: string;
    permissions: string[];
    last_login?: string;
  };
  message?: string;
}

const AdminLoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState<string>("");

  // Komponent yuklanganida avvalgi admin ma'lumotlarini tekshirish
  useEffect(() => {
    checkExistingAuth();
  }, []);

  // Mavjud admin autentifikatsiyasini tekshirish
  const checkExistingAuth = (): void => {
    try {
      const localToken = localStorage.getItem("adminAuthToken");
      const sessionToken = sessionStorage.getItem("adminAuthToken");
      const localAdmin = localStorage.getItem("adminUser");
      const sessionAdmin = sessionStorage.getItem("adminUser");

      if (localToken && localAdmin) {
        const adminData = JSON.parse(localAdmin);
        console.log("💾 Mavjud local admin ma'lumotlari topildi");
        onLogin(adminData);
        redirectToAdminPanel();
      } else if (sessionToken && sessionAdmin) {
        const adminData = JSON.parse(sessionAdmin);
        console.log("💾 Mavjud session admin ma'lumotlari topildi");
        onLogin(adminData);
        redirectToAdminPanel();
      }
    } catch (error) {
      console.error("❌ Mavjud auth tekshirishda xato:", error);
      clearStoredAuth();
    }
  };

  // Saqlangan auth ma'lumotlarini tozalash
  const clearStoredAuth = (): void => {
    try {
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminIsLoggedIn");
      sessionStorage.removeItem("adminAuthToken");
      sessionStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminIsLoggedIn");
    } catch (error) {
      console.error("❌ Admin auth ma'lumotlarini tozalashda xato:", error);
    }
  };

  // Telefon raqamni formatlash
  const formatPhoneNumber = (phone: string): string => {
    // Faqat raqamlarni qoldirish
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 0) return '';
    
    // O'zbekiston formati: +998 XX XXX XX XX
    if (cleanPhone.startsWith('998')) {
      const number = cleanPhone.substring(3);
      if (number.length <= 2) return `+998 ${number}`;
      if (number.length <= 5) return `+998 ${number.substring(0, 2)} ${number.substring(2)}`;
      if (number.length <= 7) return `+998 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
      return `+998 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 7)} ${number.substring(7, 9)}`;
    }
    
    // Agar 9 bilan boshlansa
    if (cleanPhone.startsWith('9') && cleanPhone.length <= 9) {
      if (cleanPhone.length <= 2) return `+998 ${cleanPhone}`;
      if (cleanPhone.length <= 5) return `+998 ${cleanPhone.substring(0, 2)} ${cleanPhone.substring(2)}`;
      if (cleanPhone.length <= 7) return `+998 ${cleanPhone.substring(0, 2)} ${cleanPhone.substring(2, 5)} ${cleanPhone.substring(5)}`;
      return `+998 ${cleanPhone.substring(0, 2)} ${cleanPhone.substring(2, 5)} ${cleanPhone.substring(5, 7)} ${cleanPhone.substring(7)}`;
    }
    
    return `+${cleanPhone}`;
  };

  // Telefon raqam validatsiyasi
  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    // O'zbekiston raqamlari: 998XXXXXXXXX yoki 9XXXXXXXXX (9 ta raqam)
    return /^(998\d{9}|9\d{8})$/.test(cleanPhone);
  };

  // Parol validatsiyasi
  const validatePassword = (password: string): boolean => {
    // Admin uchun qattiq parol talablari
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumbers;
  };

  // Input o'zgarishlarini boshqarish
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // Telefon raqam uchun formatlash
    if (name === 'phoneNumber' && type !== 'checkbox') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));

    // Xatoliklarni tozalash
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  // Form validatsiyasi
  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // Telefon raqam tekshirish
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Telefon raqam majburiy";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Noto'g'ri telefon raqam formati";
    }

    // Parol tekshirish
    if (!formData.password.trim()) {
      newErrors.password = "Parol majburiy";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Parol kamida 8 belgi, katta-kichik harf va raqam bo'lishi kerak";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Admin panelga yo'naltirish
  const redirectToAdminPanel = (): void => {
    setTimeout(() => {
      try {
        console.log("🔧 Admin panelga yo'naltirilmoqda...");
        window.location.href = "/";
      } catch (error) {
        console.error("❌ Redirect xatosi:", error);
        window.location.reload();
      }
    }, 1500);
  };

  const saveAdminData = (response: LoginResponse, formData: FormData): AdminData => {
  const adminData: AdminData = {
    phone: formData.phoneNumber || "", // API'da phone_number yo‘q, formData'dan olamiz
    name: "Admin", // yoki agar API’da yo‘q bo‘lsa, vaqtincha qo‘lda beriladi
    email: "",
    adminId: response.user_id?.toString() || "",
    permissions: [],
    loginTime: new Date().toISOString(),
    isLoggedIn: true,
    token: response.access_token,
    lastLoginTime: "", // API’da yo‘q
  };

  try {
    if (formData.rememberMe) {
      localStorage.setItem("adminAuthToken", response.access_token);
      localStorage.setItem("adminUser", JSON.stringify(adminData));
      localStorage.setItem("adminIsLoggedIn", "true");
    } else {
      sessionStorage.setItem("adminAuthToken", response.access_token);
      sessionStorage.setItem("adminUser", JSON.stringify(adminData));
      sessionStorage.setItem("adminIsLoggedIn", "true");
    }
  } catch (error) {
    console.error("❌ Admin ma'lumotlarini saqlashda xato:", error);
  }

  return adminData;
};



  // API xatosini tahlil qilish
  const handleApiError = (error: any): string => {
    console.error("❌ API xatosi:", error);

    // Network xatolari
    if (!navigator.onLine) {
      return "Internet aloqasi mavjud emas";
    }

    if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
      return "Server bilan aloqa o'rnatilmadi";
    }

    // HTTP status xatolari
    if (error?.response?.status) {
      switch (error.response.status) {
        case 401:
          return "Telefon raqam yoki parol noto'g'ri";
        case 403:
          return "Admin huquqlaringiz yo'q";
        case 404:
          return "Admin topilmadi";
        case 429:
          return "Juda ko'p urinish. Biroz kuting";
        case 500:
          return "Server xatosi. Keyinroq urinib ko'ring";
        case 503:
          return "Servis vaqtincha ishlamayapti";
        default:
          return "Kirish jarayonida xato yuz berdi";
      }
    }

    // API dan kelgan xato xabari
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return "Noma'lum xato yuz berdi";
  };

  // Login formni yuborish
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    setErrors({});
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔐 Admin login API so'rovi...");

      // Telefon raqamdan faqat raqamlarni olish
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      const phoneNumber = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

      const response: LoginResponse = await api.login({
        phone_number: phoneNumber,
        password: formData.password,
      });
      

      console.log("✅ Admin login API javobi:", response);


      const adminData = saveAdminData(response, formData);
      setSuccess("Admin sifatida muvaffaqiyatli kirdingiz! Yo'naltirilmoqda...");
      onLogin(adminData);
      redirectToAdminPanel();

    } catch (error: any) {
      const errorMessage = handleApiError(error);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div
        className="mt-[0px] absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{
          backgroundImage: `url("https://www.shutterstock.com/image-vector/greece-on-detailed-world-map-260nw-1623368362.jpg")`,
        }}
      />
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Login container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20  bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-105 transition-transform duration-300">
              <i className="ri-admin-line text-white text-3xl"></i>
            </div>
            <h1
              className="text-3xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              TaxiGo
            </h1>
            <p className="text-gray-600 text-sm">
              Admin Panel - Boshqaruv paneli
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Success message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center">
                <i className="ri-check-line mr-2 text-lg"></i>
                {success}
              </div>
            )}

            {/* General error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                <i className="ri-error-warning-line mr-2 text-lg"></i>
                {errors.general}
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin telefon raqami
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-phone-line text-gray-400"></i>
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+998 90 123 45 67"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.phoneNumber
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white/90"
                  }`}
                  disabled={isLoading}
                  autoComplete="tel"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="ri-error-warning-line mr-1"></i>
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin paroli
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white/90"
                  }`}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  <i
                    className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}
                  ></i>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="ri-error-warning-line mr-1"></i>
                  {errors.password}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Kamida 8 belgi, katta-kichik harf va raqam bo'lishi kerak
              </p>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">Meni eslab qol</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                onClick={() => window.location.href = "/admin/forgot-password"}
              >
                Parolni unutdingizmi?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3  bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Tekshirilmoqda...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="ri-shield-check-line mr-2"></i>
                  Admin panelga kirish
                </div>
              )}
            </button>

            {/* Security notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="text-blue-800 font-medium mb-1 flex items-center">
                <i className="ri-shield-line mr-2"></i>
                Xavfsizlik eslatmasi
              </p>
              <p className="text-blue-700 text-xs">
                Admin panel faqat ro'yxatdan o'tgan administratorlar uchun mo'ljallangan.
                Login ma'lumotlaringizni hech kimga bermang.
              </p>
            </div>

           
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            © 2024 TaxiGo. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
