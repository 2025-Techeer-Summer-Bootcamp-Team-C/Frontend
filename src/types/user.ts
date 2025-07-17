export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  user_gender: "M" | "F";
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  image: string;
  credit: number;
}

export interface SignUpRequest {
  username: string;
  password: string;
  password2: string;
  email: string;
  profile_image: File | null;
}

export interface SignUpResponse {
  status: number;
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  access_token: string;
  refresh_token: string;
  message: string;
}

export interface AuthErrorResponse {
  status: number;
  message: string;
}

export interface LogoutResponse {
  status: number;
  message: string;
}
