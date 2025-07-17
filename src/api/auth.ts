import axiosInstance from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  LogoutResponse,
} from "../types/user";

// 회원가입 API 요청 함수
export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  // FormData로 통일하여 전송
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('password2', data.password2);
  
  if (data.profile_image) {
    formData.append('profile_image', data.profile_image);
  }
  
  const response = await axiosInstance.post<SignUpResponse>(
    "api/v1/users/signup",
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// 로그인 API 요청 함수
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "api/v1/users/login",
    data
  );
  return response.data;
};

// 로그아웃 API 요청 함수
export const logout = async (): Promise<LogoutResponse> => {
  const refreshToken = localStorage.getItem("refresh_token");
  
  const response = await axiosInstance.post<LogoutResponse>(
    "api/v1/users/logout",
    {
      refresh_token: refreshToken,
    }
  );
  return response.data;
};
