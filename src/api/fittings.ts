import axiosInstance from "./axiosInstance";
import { fetchProducts } from "./products";
import type { ProductListResponse } from "../types/product";

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

/**
 * 피팅 결과 폴링 함수
 * show_fitting=true로 상품 목록을 조회하여 피팅 결과가 있는지 확인
 * 
 * @param maxAttempts 최대 시도 횟수 (기본값: 60)
 * @param intervalMs 폴링 간격 (기본값: 2000ms = 2초)
 * @returns Promise<ProductListResponse> 피팅 결과가 포함된 상품 목록
 */
export const pollFittingResults = async (
  maxAttempts: number = 60,
  intervalMs: number = 2000
): Promise<ProductListResponse> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetchProducts(true); // show_fitting=true
      
      // 피팅 결과가 있는지 확인 (상품 목록이 비어있지 않은 경우)
      if (response.products && response.products.length > 0) {
        return response;
      }
      
      // 결과가 없으면 다음 시도 전까지 대기
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      attempts++;
      
    } catch (error) {
      console.error(`Polling attempt ${attempts + 1} failed:`, error);
      attempts++;
      
      // 마지막 시도에서도 실패하면 에러 던지기
      if (attempts >= maxAttempts) {
        throw new Error("피팅 결과 조회 중 오류가 발생했습니다.");
      }
      
      // 에러 발생 시에도 잠시 대기
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  throw new Error("피팅 결과를 가져오는 데 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.");
};