import axiosInstance from "./axiosInstance";

export interface FittingDetailResponse {
  message: string;
  total_products: number;
  user_image_id: number;
}

export interface FittingDetailError {
  error: string;
}

/**
 * 가상 피팅 상세 API 호출
 * POST /api/v1/fittings/images/detail/
 * 
 * @param profileImage 사용자 프로필 이미지 파일
 * @returns Promise<FittingDetailResponse>
 * @throws Error when API call fails
 */
export const startFittingDetail = async (profileImage: File): Promise<FittingDetailResponse> => {
  try {
    const formData = new FormData();
    formData.append('profile_image', profileImage);

    const response = await axiosInstance.post<FittingDetailResponse>(
      "api/v1/fittings/images/detail",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    // 백엔드에서 제공하는 에러 응답을 그대로 사용
    throw error;
  }
};





export interface FittingVideoGenerateResponse {
  detail: string;
  video_url?: string;
}

export interface FittingVideoStatusResponse {
  status: "pending" | "processing" | "completed" | "failed";
  video_url?: string;
}

/**
 * 가상 피팅 영상 생성 요청
 * POST /api/v1/fittings/{product_id}/videos/{user_image_id}
 * 
 * @param product_id 상품 ID
 * @param user_image_id 사용자 이미지 ID
 * @returns Promise<FittingVideoGenerateResponse>
 */
export const generateFittingVideo = async (product_id: number, user_image_id: number): Promise<FittingVideoGenerateResponse> => {
  const response = await axiosInstance.post<FittingVideoGenerateResponse>(
    `api/v1/fittings/${product_id}/videos/${user_image_id}`
  );
  return response.data;
};

/**
 * 가상 피팅 영상 상태 조회
 * GET /api/v1/fittings/{product_id}/videos/{user_image_id}
 * 
 * @param product_id 상품 ID
 * @param user_image_id 사용자 이미지 ID
 * @returns Promise<FittingVideoStatusResponse>
 */
export const getFittingVideoStatus = async (product_id: number, user_image_id: number): Promise<FittingVideoStatusResponse> => {
  const response = await axiosInstance.get<FittingVideoStatusResponse>(
    `api/v1/fittings/${product_id}/videos/${user_image_id}`
  );
  return response.data;
};