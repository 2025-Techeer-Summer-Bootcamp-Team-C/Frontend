import axiosInstance from "./axiosInstance";
import type { UserImage } from "../types/user";

// 사용자 이미지 목록 조회 응답 타입
export interface GetUserImagesResponse {
  status: number;
  message: string;
  data: UserImage[];
}

// 사용자 이미지 목록 조회
export const getUserImages = async (): Promise<GetUserImagesResponse> => {
  const response = await axiosInstance.get<GetUserImagesResponse>(
    "/api/v1/users/images"
  );
  return response.data;
};