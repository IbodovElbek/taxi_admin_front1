// api.ts - Comprehensive API client for React application

import { AdminDashboard, Driver, DriverResponse, FareConfig, RegionPricingResponse, RegionResponse, RegionsResponse, updatefareresponse } from "./app/types/types";
import { CreateRegionRequest, LoginRequest, LoginResponse, PaymentAnalyticsResponse } from "./types";

const API_BASE_URL = "https://ibodov.uz/api/taxi/api/v1";

// Types

export type BalanceUpdateRequest = {
  amount: number;
  description: string;
};

export type CreateManualTripRequest = {
  customer_phone: string;
  region_id: number;
  pickup_address: string;
  destination_address: string;
  service_type_id: number;
  admin_notes?: string;
  estimated_distance_km?: number;
};

export type Region = {
  id: number;
  name: string;
  created_at?: string;
};

export type ServiceType = {
  id: number;
  name: string;
  description?: string;
  base_fare?: number;
  per_km_rate?: number;
};


export type BalanceResponse = {
  message: string;
  new_balance: number;
  transaction_id?: number;
};

export type User = {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  status: string;
  created_at: string;
};

export type Customer = {
  id: number;
  user: User;
  rating: number;
  total_trips: number;
  preferred_language: string;
  emergency_contact: string;
};

export type UpdateDriverRequest = {
  service_type_id?: number;
  full_name?: string;
  email?: string;
  phone_number?: string;
  license_number?: string;
  car_model?: string;
  car_color?: string;
  car_number?: string;
  car_year?: number;
  commission_rate?: number;
  status?: string;
  documents_verified: boolean,
  is_verified?: boolean;
};

export type Trip = {
  id: number;
  trip_number: string;
  trip_type: "point_to_point" | "rental" | "delivery";
  status: "pending" | "in_progress" | "completed" | "cancelled";

  // Addresses
  pickup_latitude?: number;
  pickup_longitude?: number;
  pickup_address: string;
  destination_latitude?: number;
  destination_longitude?: number;
  destination_address: string;

  // Stops
  stops?: any[];

  // Distance & Duration
  estimated_distance_km?: number;
  estimated_duration_minutes?: number;
  actual_distance_km?: number;
  actual_duration_minutes?: number;

  // Fare & Payment
  estimated_fare?: number;
  total_fare?: number;
  payment_status?: "pending" | "completed" | "failed";
  payment_method?: string;

  // Timestamps
  created_at: string;
  accepted_at?: string;
  driver_arrived_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;

  // Notes
  customer_notes?: string;
  driver_notes?: string;
  cancellation_reason?: string;

  // IDs
  customer_id: number;
  driver_id?: number;
  service_type_id: number;

  // Relations (backend qaytarsa)
  customer?: {
    id: number;
    name: string;
    phone: string;
  };
  driver?: {
    id: number;
    name: string;
    phone: string;
    car_number: string;
  } | null;
  service_type?: {
    id: number;
    name: string;
  };
};

export type TripsResponse = {
  trips: Trip[];
  total_count: number;
  current_page: number;
  per_page: number;
};


export interface Review {
  id: number;
  product_id: number;
  user_name: string;
  user_email?: string;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
  updated_at?: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  status?: "approved" | "pending" | "awaiting approval";
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Generic API call function
const apiCall = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data: any = null
): Promise<T> => {
  try {
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN_HERE", // Token ni qo'shing
      },
    };

    if (data && method !== "GET") {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export async function fetchPaymentAnalytics(
  period: '7days' | '30days' | 'all' = '30days'
): Promise<PaymentAnalyticsResponse> {
  const response = await fetch(`${API_BASE_URL}/payment-analytics?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payment analytics');
  }
  return response.json();
}

export async function exportPaymentAnalytics(
  period: '7days' | '30days' | 'all' = '30days'
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/payment-analytics/export?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to export payment analytics');
  }
  return response.blob();
}

// Review API functions
export const reviewApi = {
  // Create new review
  createReview: async (reviewData: {
    product_id: number;
    user_name: string;
    user_email: string;
    rating: number;
    comment: string;
    title?: string;
  }): Promise<ApiResponse<{ review: Review }>> => {
    return apiCall("/api/v1/reviews/create", "POST", reviewData);
  },

  // Get user's reviews
  getMyReviews: async (): Promise<ApiResponse<{ reviews: Review[] }>> => {
    return apiCall("/api/v1/reviews/my-reviews");
  },

  // Get featured reviews
  getFeaturedReviews: async (): Promise<ApiResponse<{ reviews: Review[] }>> => {
    return apiCall("/api/v1/reviews/featured");
  },

  // Get product reviews
  getProductReviews: async (
    productId: number
  ): Promise<
    ApiResponse<{
      reviews: Review[];
      total_count: number;
      current_page: number;
      per_page: number;
    }>
  > => {
    return apiCall(`/api/v1/reviews/products/${productId}`);
  },

  // Get product review statistics
  getProductReviewStats: async (
    productId: number
  ): Promise<ApiResponse<ReviewStats>> => {
    return apiCall(`/api/v1/reviews/products/${productId}/stats`);
  },

  // Update review
  updateReview: async (
    reviewId: number,
    reviewData: {
      rating?: number;
      comment?: string;
      title?: string;
    }
  ): Promise<ApiResponse<{ review: Review }>> => {
    return apiCall(`/api/v1/reviews/update/${reviewId}`, "PUT", reviewData);
  },

  // Delete review
  deleteReview: async (
    reviewId: number
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiCall(`/api/v1/reviews/delete/${reviewId}`, "DELETE");
  },



  // Mark review as helpful
  markReviewHelpful: async (
    reviewId: number
  ): Promise<
    ApiResponse<{
      helpful_count: number;
    }>
  > => {
    return apiCall(`/api/v1/reviews/${reviewId}/helpful`, "POST");
  },

  // Admin update review (approve/reject)
  adminUpdateReview: async (
    reviewId: number,
    updateData: {
      status?: "approved" | "rejected";
      admin_comment?: string;
    }
  ): Promise<ApiResponse<{ review: Review }>> => {
    return apiCall(`/api/v1/reviews/${reviewId}/admin`, "PUT", updateData);
  },
};



// Product API functions (if needed)
export const productApi = {
  // Get product details
  getProduct: async (
    productId: number
  ): Promise<
    ApiResponse<{
      id: number;
      name: string;
      description: string;
      price: number;
      reviews_count: number;
      average_rating: number;
    }>
  > => {
    return apiCall(`/api/v1/products/${productId}`);
  },
};

// Error handling helper
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};

// Storage helpers
export const storageHelpers = {
  saveUserReviewInfo: (userInfo: {
    name: string;
    email: string;
    save: boolean;
  }): void => {
    if (userInfo.save) {
      localStorage.setItem("userReviewInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userReviewInfo");
    }
  },

  getUserReviewInfo: (): {
    name: string;
    email: string;
    save: boolean;
  } | null => {
    const saved = localStorage.getItem("userReviewInfo");
    return saved ? JSON.parse(saved) : null;
  },

  clearUserReviewInfo: (): void => {
    localStorage.removeItem("userReviewInfo");
  },
};

const requestCache = new Map<string, any>();
const inFlightRequests = new Map<string, Promise<any>>();

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private refresh_token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
      this.refresh_token = localStorage.getItem("refresh_token");
    } else {
      this.token = null;
      this.refresh_token = null;
    }
  }

  setToken(token: string, refresh_token: string) {
    this.token = token;
    this.refresh_token = refresh_token;
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("isLogin", "true");
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("user");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const isNgrokUrl = this.baseURL.includes("ngrok");

    const config: RequestInit = {
      method: options.method || "GET",
      headers: {
        ...(isNgrokUrl && {
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        }),
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        // Don't set Content-Type for FormData - browser will set it with boundary
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...options.headers,
      },
      mode: "cors",
      credentials: "omit",
      ...options,
    };



    try {
      const response = await fetch(url, config);



      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails = null;

        try {
          const errorData = await response.json();
          errorDetails = errorData;
          errorDetails = errorData;

          // Handle FastAPI validation errors
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const validationErrors = errorData.detail
              .map((err: { loc: any[]; msg: any }) => {
                const location = Array.isArray(err.loc)
                  ? err.loc.join(".")
                  : err.loc;
                return `${location} - ${err.msg}`;
              })
              .join("; ");
            errorMessage = `Validation Error: ${validationErrors}`;
          } else if (errorData.detail && typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          // Try to get text content
          try {
            const textContent = await response.text();
            if (textContent) {
              errorMessage += ` - ${textContent}`;
            }
          } catch (textError) {
          }
        }

        const error = new Error(errorMessage);
        error.cause = errorDetails;
        throw error;
      }



      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data;
      } else {
        return {} as T;
      }

    } catch (error) {

      if (error instanceof TypeError && error.message.includes("fetch")) {
      }

      throw error;
    }
  }

  // Authentication
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token, response.refresh_token);
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    localStorage.setItem("isLogin", "true");
    return response;
  }

  async delete_account(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<any>("/auth/delete-account", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return response;
  }
  async create_region(data: CreateRegionRequest): Promise<RegionResponse> {
    return await this.request("/admin/regions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createManualTrip(data: CreateManualTripRequest): Promise<{
    message: string;
    trip: Trip;
  }> {
    return await this.request("/admin/trips/create-manual", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // 🔹 Barcha triplarni olish (yangilangan versiya)
  async getAllAdminTrips(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
  }): Promise<Trip[]> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const query = queryParams.toString();
    const endpoint = query ? `/admin/trips?${query}` : "/admin/trips";

    const response = await this.request<any>(endpoint, { method: "GET" });

    // Turli formatlarni handle qilish
    if (Array.isArray(response)) return response;
    if (response?.trips) return response.trips;
    if (response?.data) return response.data;

    return [];
  }



  // 🔹 Bitta tripni ID bo'yicha olish
  async getTripById(tripId: number): Promise<Trip> {
    return await this.request(`/admin/trips/${tripId}`, {
      method: "GET"
    });
  }

  async getAdminDashboard(): Promise<AdminDashboard> {
    return await this.request(`/admin/dashboard`, {
      method: "GET"
    });
  }

  async getAdminRegions(): Promise<RegionsResponse> {
    return await this.request(`/admin/regions`, {
      method: "GET"
    });
  }
  // ApiClient class ichida

  async getAdminNotifications(params?: {
    limit?: number;
    offset?: number;
    target_type?: "individual" | "group_customers" | "group_drivers" | "all_users";
    include_expired?: boolean;
  }): Promise<{
    notifications: Array<{
      id: number;
      title: string;
      body: string;
      target_type: string;
      target_user_id?: number;
      action_url?: string;
      image_url?: string;
      priority: string;
      created_at: string;
      expires_at?: string;
      sent_count?: number;
      user?: {
        id: number;
        full_name: string;
        phone_number: string;
      };
    }>;
    total_count: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.target_type) queryParams.append("target_type", params.target_type);
    if (params?.include_expired !== undefined) {
      queryParams.append("include_expired", params.include_expired.toString());
    }

    const query = queryParams.toString();
    const endpoint = query ? `/admin/notifications?${query}` : "/admin/notifications";

    const response = await this.request<any>(endpoint, { method: "GET" });

    // Response format handle
    if (Array.isArray(response)) {
      return { notifications: response, total_count: response.length };
    }
    if (response?.notifications) {
      return response;
    }

    return { notifications: [], total_count: 0 };
  }

  // api.ts da qo'shing (ApiClient class ichiga)

  async sendAdminNotification(data: {
    title: string;
    body: string;
    recipient_type: "all" | "drivers" | "customers" | "individual";
    user_id?: string;
    driver_id?: string;
    action?: string | null;
    image_url?: string;
    priority?: "normal" | "high" | "urgent";
    expires_in_days?: number;
  }): Promise<{
    message: string;
    notification_id: number;
    sent_count?: number;
  }> {
    // Backend API uchun payload
    const payload: any = {
      title: data.title,
      body: data.body,
      action_url: data.action || null,
      image_url: data.image_url || null,
      priority: data.priority || "normal",
      expires_in_days: data.expires_in_days || 30,
    };

    // ✅ BACKEND API STRUKTURA GA MOS QIYMATLAR
    if (data.recipient_type === "individual") {
      payload.target_type = "individual";

      if (data.user_id) {
        payload.target_user_id = parseInt(data.user_id);
      } else if (data.driver_id) {
        payload.target_user_id = parseInt(data.driver_id);
      }
    } else {
      // Bulk notifications - backend qiymatlariga mapping
      if (data.recipient_type === "all" ) {
        payload.target_type = "all_users"; 
      } else if (data.recipient_type === "drivers") {
        payload.target_type = "group_drivers"; 
      } else if (data.recipient_type === "customers") {
        payload.target_type = "group_customers";
      }
    }



    return await this.request("/admin/notifications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }



  // 🔹 Service types ni olish
  async getServiceTypes(): Promise<ServiceType[]> {
    const response = await this.request<any>("/admin/service-types", {
      method: "GET"
    });

    if (Array.isArray(response)) return response;
    if (response?.service_types) return response.service_types;
    if (response?.data) return response.data;

    return [];
  }
  async getAdminRegionPricings(region_id: number): Promise<RegionPricingResponse> {
    const response = await this.request<RegionPricingResponse>(`/admin/region-pricing/${region_id}`, {
      method: "GET"
    });

    return response;
  }

  async update_driver(
    driver_id: number,
    data: UpdateDriverRequest
  ): Promise<Driver> {
    return await this.request(`/admin/drivers/${driver_id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async update_reion(
    region_id: number,
    data: CreateRegionRequest
  ): Promise<any> {
    return await this.request(`/admin/regions/${region_id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async addDriverBalance(
    driverId: number,
    data: BalanceUpdateRequest
  ): Promise<BalanceResponse> {
    return await this.request(`/admin/drivers/${driverId}/balance/add`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async fetchPaymentAnalytics(date_from: string, date_to: string): Promise<PaymentAnalyticsResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/payment-analytics?date_from=${date_from}&date_to=${date_to}`);
    if (!response.ok) {
      throw new Error('Failed to fetch payment analytics');
    }
    return response.json();
  }

  async exportPaymentAnalytics(date_from: string, date_to: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/admin/payment-analytics/export?date_from=${date_from}&date_to=${date_to}`);
    if (!response.ok) {
      throw new Error('Failed to export payment analytics');
    }
    return response.blob();
  }

  async adminCreateRegionPricing(
    data: FareConfig
  ): Promise<BalanceResponse> {
    return await this.request(`/admin/region-pricing`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async adminUpdateRegionPricing(
    data: FareConfig
  ): Promise<updatefareresponse> {
    return await this.request(`/admin/region-pricing`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }


  // Haydovchi balancedan pul ayirish
  async deductDriverBalance(
    driverId: number,
    data: BalanceUpdateRequest
  ): Promise<BalanceResponse> {
    return await this.request(`/admin/drivers/${driverId}/balance/deduct`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAllTrips(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<TripsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const query = queryParams.toString();
    const endpoint = query ? `/admin/trips?${query}` : "/admin/trips";

    return await this.request(endpoint, { method: "GET" });
  }

  async getRecentTrips(limit: number = 10): Promise<Trip[]> {
    const response = await this.request<any>(
      `/admin/trips?limit=${limit}&sort=created_at:desc`,
      { method: "GET" }
    );

    if (Array.isArray(response)) return response;
    if (response?.trips) return response.trips;
    if (response?.data) return response.data;
    if (response?.results) return response.results;

    return [];
  }


  // Trip statusini yangilash
  async updateTripStatus(
    tripId: number,
    status: Trip["status"]
  ): Promise<{ message: string }> {
    return await this.request(`/admin/trips/${tripId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }





  // Haydovchi holatini o'zgartirish (faol/nofaol)
  async toggle_driver_status(
    driverId: number
  ): Promise<{ message: string; status: string }> {
    return await this.request(`/admin/drivers/${driverId}/toggle-status`, {
      method: "PATCH",
    });
  }

  async getCustomers(): Promise<Customer[]> {
    const token = localStorage.getItem("access_token"); // login token
    const response = await fetch(`${API_BASE_URL}/admin/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error("Foydalanuvchilarni olishda xatolik");
    }

    return response.json();
  }

  // Haydovchini tasdiqlash/bekor qilish
  async verify_driver(
    driverId: number,
    isVerified: boolean
  ): Promise<{ message: string }> {
    return await this.request(`/admin/drivers/${driverId}/verify`, {
      method: "PATCH",
      body: JSON.stringify({ is_verified: isVerified }),
    });
  }

  // Haydovchini o'chirish
  async delete_driver(driverId: number): Promise<{ message: string }> {
    return await this.request(`/admin/drivers/${driverId}`, {
      method: "DELETE",
    });
  }
  async delete_region(region_id: number): Promise<{ message: string }> {
    return await this.request(`/admin/regions/${region_id}`, {
      method: "DELETE",
    });
  }

  // Haydovchi qo‘shish
  async create_driver(data: {
    phone_number: string;
    email: string;
    full_name: string;
    password: string;
    license_number: string;
    car_model: string;
    car_color: string;
    car_number: string;
    car_year: number;
    commission_rate: number;
  }) {
    return await this.request("/admin/drivers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // 🔹 Barcha haydovchilarni olish
  async get_all_drivers(): Promise<DriverResponse> {
    return await this.request("/admin/drivers", { method: "GET" });
  }
  async get_all_users(): Promise<Customer[]> {
    return await this.request("/admin/customers", { method: "GET" });
  }

  // async register(data: RegisterRequest): Promise<User> {
  //   return this.request<User>("/auth/register", {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   });
  // }

  async refreshToken(): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
  }> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await this.request<{
      access_token: string;
      refresh_token: string;
      token_type: string;
    }>("/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    this.setToken(response.access_token, response.refresh_token);
    return response;
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
    this.removeToken();
  }

  // async getCurrentUser(): Promise<User> {
  //   return this.request<User>("/auth/me");
  // }
  async testConnection(): Promise<boolean> {
    try {
      await this.request("/brands?limit=1");
      return true;
    } catch (error) {
      return false;
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  }

  async getRegions(): Promise<Region[]> {
    const response = await this.request<any>("/admin/regions", {
      method: "GET"
    });

    // Agar array qaytsa
    if (Array.isArray(response)) return response;

    // Agar object ichida bo'lsa
    if (response?.regions) return response.regions;
    if (response?.data) return response.data;

    return [];
  }

  async syncCartFromLocal(
    localCartItems: Array<{
      product_id: number;
      product_name: string;
      quantity: number;
      price: number;
    }>
  ): Promise<{
    success: boolean;
    message: string;
    sync_stats: {
      added_items: number;
      updated_items: number;
      failed_items: number;
      errors: string[];
    };
    cart: {
      id: number;
      user_id: number;
      items: any[];
      total_items: number;
      total_amount: number;
    };
  }> {
    return this.request("/cart/sync-from-local", {
      method: "POST",
      body: JSON.stringify({
        local_cart_items: localCartItems,
      }),
    });
  }

  // 🔥 NEW: Check products availability without login
  async checkProductsAvailability(productIds: number[]): Promise<{
    products: Array<{
      id: number;
      name?: string;
      sku?: string;
      price?: number;
      stock_quantity?: number;
      is_active?: boolean;
      available: boolean;
      error?: string;
    }>;
    checked_at: string;
  }> {
    return this.request(
      `/cart/check-products?product_ids=${productIds.join(",")}`
    );
  }

  // Analytics
  async getAnalytics(params?: {
    start_date?: string;
    end_date?: string;
    driver_limit?: number;
  }): Promise<PaymentAnalyticsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.driver_limit) queryParams.append("driver_limit", params.driver_limit.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/admin/analytics?${query}` : "/admin/analytics";

    return await this.request(endpoint, { method: "GET" });
  }

  async exportAnalytics(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);

    const query = queryParams.toString();
    const endpoint = query ? `/admin/analytics/export?${query}` : "/admin/analytics/export";

    // Blob qaytarish uchun maxsus logika kerak, chunki this.request JSON kutadi
    // Shuning uchun alohida fetch chaqiramiz yoki this.request ni o'zgartiramiz.
    // Hozircha oddiy fetch bilan qilamiz, chunki auth header kerak.

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      method: "GET",
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`Analytics export failed: ${response.statusText}`);
    }
    return await response.blob();
  }
}

export const api = new ApiClient();

export default ApiClient;
