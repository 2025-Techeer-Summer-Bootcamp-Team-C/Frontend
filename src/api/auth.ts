import axiosInstance from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from "../types/user";

// 회원가입 API 요청 함수
export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await axiosInstance.post<SignUpResponse>(
    "api/v1/users/signup",
    data
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
