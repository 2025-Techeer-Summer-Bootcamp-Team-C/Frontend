export interface SignUpRequest {
  username: string;
  password: string;
  password2: string;
  email: string;
  user_gender: "M" | "F";
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
  message: string;
}
