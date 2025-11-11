export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  phone:string;
  role: 'CUSTOMER' | 'MANAGER' | 'ADMIN';
  created_at: string;
}

// 🔥 NEW: Local cart item for sync
export interface LocalCartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}
export interface AdminDashboard {
  overview: {
    total_drivers: number;
    total_customers: number;
    total_trips: number;
    online_drivers: number;
  };
  today: {
    trips: number;
    completed_trips: number;
    revenue: number;
    commission: number;
  };
  last_7_days: {
    trips: number;
    revenue: number;
  };
}
export interface RegionResponse {
  region_id: number;
  message: string;
}

export interface RegionCenter  {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}
export type FareConfig = {
  region_id: number;
  service_type_id: number;
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
  peak_hours_multiplier: number;
  peak_hours_start: string;
  peak_hours_end: string;
  peak_hours_evening_start: string;
  peak_hours_evening_end: string;
  night_multiplier: number;
  weekend_multiplier: number;
};

export type RegionPricing = {
  id: number;
  service_type_id: number;
  service_type_name: string;
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
  peak_hours_multiplier: number;
  peak_hours_start: string;
  peak_hours_end: string;
  peak_hours_evening_start: string;
  peak_hours_evening_end: string;
  night_multiplier: number;
  weekend_multiplier: number;
};
export type ServiceType = {
  id: number;
  name: string;
};
export type RegionPricingData = {
  id: number;
  name: string;
  city: string;
  country: string;
};
export type RegionPricingResponse = {
  region: RegionPricingData;
  pricings: RegionPricing[];
  services: ServiceType[];
};

export type Coordinate = [number, number];

export interface Regions {
  id: number;
  name: string;
  city: string;
  country: string;
  boundary_coordinates: Coordinate[];
  center_latitude: number;
  center_longitude: number;
  timezone: string;
  is_active: boolean;
  color?: string;
}

export interface RegionsResponse {
  regions: Regions[];
}


// 🔥 NEW: Sync request
export interface SyncLocalCartRequest {
  local_cart_items: LocalCartItem[];
}

// 🔥 NEW: Sync response
export interface SyncResponse {
  success: boolean;
  message: string;
  sync_stats: {
    added_items: number;
    updated_items: number;
    failed_items: number;
    errors: string[];
  };
  cart: CartResponse;
}
export interface CartResponse {
  id: number;
  user_id: number;
  items: CartItemResponse[];
  total_items: number;
  total_amount: number;
}
export interface CartItemResponse {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  total_price: number;
}
// 🔥 NEW: Cart summary
export interface CartSummary {
  total_items: number;
  total_amount: number;
  items_count: number;
}

// 🔥 NEW: Product availability check
export interface ProductAvailability {
  id: number;
  name?: string;
  sku?: string;
  price?: number;
  stock_quantity?: number;
  is_active?: boolean;
  available: boolean;
  error?: string;
}

// 🔥 NEW: Validation result
export interface ValidationResult {
  product_id: number;
  requested_quantity: number;
  local_price: number;
  valid: boolean;
  error?: string;
  available_quantity?: number;
  current_price?: number;
  price_changed?: boolean;
}


interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}


export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  parent_id?: number;
  children?: Category[];
}

export interface ProductAvailabilityResponse {
  total_checked: number;
  found_products: any[]; // Agar schema keyin aniq bo‘lsa, type qo‘shib berish mumkin
  missing_products: MissingProduct[];
  all_available: boolean;
  summary: Summary;
}

export interface MissingProduct {
  found: boolean;
  reason: string;
  product_model: string;
  external_product_id: string;
  pages_searched: number;
  database_product: DatabaseProduct;
}

export interface DatabaseProduct {
  id: number;
  name: string;
}

export interface Summary {
  message: string;
  total_requested: number;
  valid_for_checking: number;
  invalid_products: number;
  found_on_vividracing: number;
  missing_from_vividracing: number;
  errors_during_check: number;
  success_rate: string;
}


export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  term_order: number;
  term_count: number;
  is_active: boolean;
  image_url: string | null;
  children: Brand[];
  full_name: string | null;
}


export interface Pagination {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
  [key: string]: any;
}

export type GetBrandsResponse = Brand[];


// types.ts

export interface ProductResponse {
  [x: string]: any;
  products: Product[];
  total: number;
  returned: number;
  pagination: Pagination;
  applied_filters: AppliedFilters;
  available_filters: AvailableFilters;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  product_model: string;
  sku: string;
  images: string[];
  price: number;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  category_id: number;
  attributes: ProductAttributes;
  compatibility_range: string;
  compatible_year_start: number | null;
  compatible_year_end: number | null;
  brand_id: number | null;
  car_model_id: number | null;
  category: Category;
  brand: string | null;
  car_model: string | null;
}
export interface Attribute {
  id: number;
  name: string;
  label: string;
  description: string;
  attribute_type: "multiselect" | "select" | "text" | string; // agar faqat multiselect bo‘lsa, "multiselect" deb qoldirish mumkin
  is_hierarchical: boolean;
  is_required: boolean;
  is_searchable: boolean;
  is_filterable: boolean;
  display_order: number;
  is_active: boolean;
  terms_count: number | null;
}

// Response array type
export type AttributesResponse = Attribute[];

export interface ProductAttributes {
  car_years?: Term[];
  car_models?: Term[];
  colors?: Term[];
  car_brands?: Term[];
  position?: Term[];
  material?: Term[];
  fuel_type?: Term[];
  [key: string]: Term[] | undefined; // unknown keylar uchun flexible
}

export interface Term {
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Pagination {
  skip: number;
  limit: number;
  current_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  per_page: number;
  from: number;
  to: number;
}

export interface AppliedFilters {
  car_brands?: string[];
  car_years?: string[];
  color?: string[];
  category?: Category;
}

export interface AvailableFilters {
  car_brands: FilterWithTerms;
  car_manufacturer: FilterWithTerms;
  car_models: FilterWithTerms;
  car_years: FilterWithTerms;
  color: FilterWithTerms;
  colors: FilterWithTerms;
  fuel_type: FilterWithTerms;
  material: FilterWithTerms;
  position: FilterWithTerms;
  product_manufacturer: FilterWithTerms;
  product_models: FilterWithTerms;
  categories: Category[];
  price_range: PriceRange;
  stock_status: StatusFilter[];
  featured_status: StatusFilter[];

}

export interface FilterWithTerms {
  label: string;
  terms: FilterTerm[];
}

export interface FilterTerm {
  name: string;
  slug: string;
  count: number;
}

export interface PriceRange {
  min: number;
  max: number;
  avg: number;
}



type FilterGroup = {
  label: string;
  terms: FilterTerm[];
};



interface Props {
  filters: AvailableFilters;
  selectedFilters: Record<string, string[]>; // masalan: { colors: ["Black"], car_years: ["2020"] }
  onChange: (filterKey: string, values: string[]) => void;
}

export interface StatusFilter {
  value: boolean;
  label: string;
}


export interface CarModel {
  id: number;
  name: string;
  brand_id: number;
  model_year_start?: number;
  model_year_end?: number;
  body_type?: string;
  fuel_type?: string;
  is_active: boolean;
  brand?: Brand;
}


export interface UserAddress {
  country: string;
  street: string;
  state: string;
  apartment: string;
  postal_code: string;
  is_default: boolean;
  city:string
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
  name: string;
  priceNumber: number;
  image: string;
  sku?: string;
  brand?: string;
  category?: string;
  stock_quantity?: number;
  is_active?: boolean;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  total_items: number;
  total_amount: number;
}


export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title?: string;
  comment?: string;
  is_approved: boolean;
  is_featured: boolean;
  would_recommend: boolean;
  is_verified_purchase: boolean;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  user?: User;
  product?: Product;
}

export interface Address {
  id: number;
  user_id: number;
  title: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

// Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?:string;
}

export interface LoginResponse {
  json(): unknown;
  token(arg0: string, token: any): unknown;
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface LocalCartItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  shipping_address_id: number;
  billing_address_id?: number;
  payment_method?: string;
  notes?: string;
  items?: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

// 
// Order Types - add these to your types/types.ts file

// Enums
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Order Item Types
export interface OrderItemBase {
  product_id: number;
  quantity: number;
}

export interface OrderItemCreate extends OrderItemBase {}

export interface OrderItem extends OrderItemBase {
  id: number;
  order_id: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product?: {
    id: number;
    name: string;
    sku?: string;
    code?: string;
    price?: number;
    image_url?: string;
  };
}

// Order Base Types
export interface OrderBase {
  shipping_address: string;
  notes?: string;
}

export interface CreateOrderRequest extends OrderBase {
  // For cart-based orders, items will be taken from user's cart
}

export interface CreateDirectOrderRequest extends OrderBase {
  items: OrderItemCreate[]; // For direct orders with specific items
}

export interface OrderUpdateRequest {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  notes?: string;
  shipping_address?: string;
}

// Order Response Types
export interface Order extends OrderBase {
  id: number;
  order_number: string;
  customer_id: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  
  // Pricing
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  shipped_at?: string;
  delivered_at?: string;
}
export interface MyOrdersType {
  id:number,
  order_number:string,
  status:OrderStatus,
  payment_amount:string,
  
}

export type Color = {
  id: number;
  name: string;      // "Red"
  hexCode?: string;  // "#FF0000" (majburiy bo‘lmagan field)
};

export interface OrderWithItems extends Order {
  items: OrderItem[];
  customer?: {
    id: number;
    email?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface OrderSummary {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  created_at: string;
  item_count: number;
}

// Tracking Types
export interface OrderTracking {
  order_id: number;
  order_number: string;
  status: OrderStatus;
  tracking_number?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  status_history?: Array<{
    status: OrderStatus;
    timestamp: string;
    notes?: string;
  }>;
}

// Analytics Types
export interface OrderStatusStats {
  status: string;
  count: number;
  percentage: number;
}

export interface OrderAnalytics {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  status_breakdown: Record<string, number>;
  period: {
    start_date?: string;
    end_date?: string;
  };
  top_products?: Array<{
    product_id: number;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
}

// Payment Types
export interface PaymentInfo {
  payment_method: string;
  payment_status: PaymentStatus;
  transaction_id?: string;
  payment_date?: string;
}

export interface RefundRequest {
  order_id: number;
  amount?: number; // If null, full refund
  reason?: string;
}

// Filter Types
export interface OrderFilter {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  start_date?: string;
  end_date?: string;
  customer_id?: number;
  min_amount?: number;
  max_amount?: number;
}

// Bulk Operations
export interface BulkOrderUpdate {
  order_ids: number[];
  status: OrderStatus;
  notes?: string;
}

// Export Schema
export interface OrderExport {
  format: 'csv' | 'excel' | 'pdf';
  filter?: OrderFilter;
  include_items: boolean;
}

// Order History for User Profile
export interface OrderHistory {
  orders: OrderSummary[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    pages: number;
  };
  summary: {
    total_orders: number;
    total_spent: number;
    favorite_products: Array<{
      product_id: number;
      product_name: string;
      order_count: number;
    }>;
  };
}

// Order Notification Types
export interface OrderNotification {
  type: 'order_created' | 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'order_cancelled';
  order_id: number;
  order_number: string;
  message: string;
  timestamp: string;
}

// Cart to Order Conversion
export interface CartToOrderRequest {
  shipping_address: string;
  notes?: string;
  payment_method?: string;
}

// Order Dashboard Stats (for Admin)
export interface OrderDashboardStats {
  today_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  total_revenue_today: number;
  total_revenue_month: number;
  avg_order_value: number;
  order_trend: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}