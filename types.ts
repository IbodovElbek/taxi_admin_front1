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

