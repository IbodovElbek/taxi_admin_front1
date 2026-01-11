export interface LoginRequest {
  phone_number: string;
  password: string;
}
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    role: string;
    last_login?: string;
  };
}

export interface PaymentSummary {
  total_fare: number;
  total_commission: number;
  total_payments_count: number;
  date_from: string;
  date_to: string;
}

export interface PaymentHistoryItem {
  trip_number: string;
  customer_name: string;
  customer_id: number;
  driver_name: string;
  driver_id: number;
  total_fare: number;
  commission_amount: number;
  payment_method: 'cash' | 'card' | 'wallet' | 'bank_transfer';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  service_type_id: number;
  service_type_name: string;
  pickup_region_id: number;
  pickup_region_name: string;
  completed_at: string;
}

export interface PaymentAnalyticsResponse {
  summary: PaymentSummary;
  payment_history: PaymentHistoryItem[];
  date_from: string;
  date_to: string;
}


export interface CreateRegionRequest {
  name: string;
  city: string;
  country: string;
  boundary_coordinates: number[][];
  center_latitude: number;
  center_longitude: number;
  timezone: string;
  is_active?: boolean;
}

export interface Region {
  id: number;
  name: string;
  city: string;
  country: string;
  boundary_coordinates: string; // JSON string bo'lib keladi
  center_latitude: number;
  center_longitude: number;
  timezone: string;
  is_active: boolean;
}

export interface RegionsResponse {
  regions: Region[];
}


export interface MonthlyStat {
  total_trips: number;
  total_revenue: number;
}

export interface MonthlyBreakdown {
  [key: string]: MonthlyStat;
}

export interface RegionalStat {
  id: number;
  region_name: string;
  total_trips: number;
}

export interface DriverStat {
  driver_id: number;
  full_name: string;
  total_earnings: number;
  total_trips: number;
  total_commission: number;
}

export interface AnalyticsResponse {
  total_completed_trips: number;
  total_revenue: number;
  monthly_breakdown: MonthlyBreakdown;
  regional_stats: RegionalStat[];
  driver_stats: DriverStat[];
}
