import axiosInstance from "./axiosInstance";

export interface FittingDetailResponse {
  message: string;
  task_group_id: string;
  total_products: number;
}

export interface FittingDetailError {
  error: string;
}

/**
 * 가상 피팅 상세 API 호출
 * POST /api/v1/fittings/images/detail
 * 
 * @returns Promise<FittingDetailResponse>
 * @throws Error when API call fails
 */
export const startFittingDetail = async (): Promise<FittingDetailResponse> => {
  try {
    const response = await axiosInstance.post<FittingDetailResponse>(
      "api/v1/fittings/images/detail"
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
 * POST /api/v1/fittings/{product_id}/video
 * 
 * @param product_id 상품 ID
 * @returns Promise<FittingVideoGenerateResponse>
 */
export const generateFittingVideo = async (product_id: number): Promise<FittingVideoGenerateResponse> => {
  const response = await axiosInstance.post<FittingVideoGenerateResponse>(
    `api/v1/fittings/${product_id}/videos`
  );
  return response.data;
};

export const getFittingVideoStatus = async (product_id: number): Promise<FittingVideoStatusResponse> => {
  const response = await axiosInstance.get<FittingVideoStatusResponse>(
    `api/v1/fittings/${product_id}/videos/status`
  );
  return response.data;
};