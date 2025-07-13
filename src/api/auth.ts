import axiosInstance from "./axiosInstance";
import type { SignUpRequest, SignUpResponse } from "../types/user";

// 회원가입 API 요청 함수
export const signUp = async (
  request: SignUpRequest
): Promise<SignUpResponse> => {
  const response = await axiosInstance.post("/users/signup", request);
  return response.data;
};
