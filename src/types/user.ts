export interface UserImage {
  id: number;
  user: number;
  image: string;
  is_fitting: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  user_gender: "M" | "F";
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  is_fitting: boolean;
  profile_image: string | null;
  user_images: UserImage[];
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