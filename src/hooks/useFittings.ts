import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { generateFittingVideo, getFittingVideoStatus } from "../api/fittings";
import { fetchProducts } from "../api/products";
import type { FittingVideoStatusResponse } from "../api/fittings";
import type { ProductListResponse } from "../types/product";
import { AxiosError } from "axios";

/**
 * 가상 피팅 영상 생성 뮤테이션 훅
 * getFittingVideoStatus를 활용하여 상태 기반 재시도 로직 구현
 * status가 pending 또는 processing인 경우 자동 재시도
 */
export const useGenerateFittingVideoMutation = () => {
  return useMutation<FittingVideoStatusResponse, Error, number>({
    mutationFn: async (product_id: number) => {
      try {
        // 먼저 영상 생성 요청
        await generateFittingVideo(product_id);
      } catch (error) {
        // 400 에러(이미 완료됨)인 경우는 정상 처리
        if (!(error instanceof AxiosError && error.response?.status === 400)) {
          throw error;
        }
      }
      
      // 상태 확인
      const status = await getFittingVideoStatus(product_id);
      
      // pending이나 processing 상태면 에러를 던져서 재시도 유발
      if (status.status === "pending" || status.status === "processing") {
        throw new Error(`Video is still ${status.status}`);
      }
      
      return status;
    },
    retry: (failureCount, error) => {
      // 상태가 pending 또는 processing인 경우에만 재시도
      if (error.message.includes("pending") || error.message.includes("processing")) {
        return failureCount < 48;
      }
      return false;
    },
    retryDelay: () => {
      // 30초 간격으로 재시도
      return 10000;
    },
    onSuccess: (data) => {
      console.log("영상 상태 확인 성공:", data);
      if (data.status === "completed" && data.video_url) {
        console.log("영상 생성이 완료되었습니다:", data.video_url);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          console.log("상품 또는 피팅 결과를 찾을 수 없음:", error.response.data);
        } else {
          console.error("영상 생성 요청 실패:", error);
        }
      } else {
        console.error("영상 생성 요청 실패:", error);
      }
    },
  });
};

/**
 * 피팅 결과 폴링 뮤테이션 훅
 * fetchProducts(show_fitting=true)를 활용하여 피팅 결과 이미지가 업데이트될 때까지 폴링
 * 성공 시 React Query 캐시를 업데이트하여 중복 호출 방지
 */
export const useFittingResultsPollingMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ProductListResponse, Error, { 
    previousImageUrls?: string[]; 
    onProgress?: (progress: string) => void; 
  }>({
    mutationFn: async ({ previousImageUrls, onProgress }) => {
      // show_fitting=true로 상품 목록 조회
      const response = await fetchProducts(true);
      
      // 이전 이미지 URL들과 비교하여 변경되었는지 확인
      if (previousImageUrls && previousImageUrls.length > 0) {
        const currentImageUrls = response.products
          .filter(product => product.image)
          .map(product => product.image);
        
        // 모든 이미지가 변경되었는지 확인 (일부만 변경된 경우 재시도)
        if (currentImageUrls.length !== previousImageUrls.length) {
          // 상품 개수가 달라진 경우는 완료로 간주
          console.log("상품 개수 변경됨:", previousImageUrls.length, "→", currentImageUrls.length);
        } else {
          // 모든 이미지가 변경되었는지 확인
          const allImagesChanged = currentImageUrls.every((url, index) => 
            url !== previousImageUrls[index]
          );
          
          if (!allImagesChanged) {
            const changedCount = currentImageUrls.filter((url, index) => 
              url !== previousImageUrls[index]
            ).length;
            const progressMessage = `피팅 진행 중: ${changedCount}/${currentImageUrls.length}개 완료`;
            console.log(progressMessage);
            
            // 진행 상황을 콜백으로 전달
            if (onProgress) {
              onProgress(progressMessage);
            }
            
            throw new Error(`피팅 이미지가 아직 업데이트 중입니다 (${changedCount}/${currentImageUrls.length}개 완료)`);
          }
        }
      }
      
      return response;
    },
    retry: (failureCount, error) => {
      // 피팅 이미지가 업데이트되지 않은 경우에만 재시도
      if (error.message.includes("피팅 이미지가 아직 업데이트") || 
          error.message.includes("피팅 이미지가 아직 업데이트 중입니다")) {
        return failureCount < 60; // 최대 60회 재시도 (2분)
      }
      return false;
    },
    retryDelay: () => {
      // 2초 간격으로 재시도
      return 2000;
    },
    onSuccess: (data) => {
      console.log("피팅 결과 조회 성공:", data);
      console.log(`총 ${data.products.length}개의 피팅 결과를 찾았습니다.`);
      
      // React Query 캐시 업데이트 - showFitting=true인 쿼리 캐시 업데이트
      queryClient.setQueryData(["products", { showFitting: true }], data);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.error("피팅 결과 조회 API 실패:", error);
      } else {
        console.error("피팅 결과 조회 실패:", error);
      }
    },
  });
};

/**
 * 모든 상품의 피팅 영상 상태를 확인하는 훅
 * 모든 products를 가져와서 각 product_id로 getFittingVideoStatus 호출
 * status가 'completed'인 영상들만 반환
 */
export interface CompletedFittingVideo {
  product_id: number;
  product_name: string;
  video_url: string;
  status: 'completed';
}

export const useFittingVideos = () => {
  return useQuery<CompletedFittingVideo[], Error>({
    queryKey: ["fittingVideos"],
    queryFn: async () => {
      try {
        // 1. 모든 상품 정보 가져오기
        const productsResponse = await fetchProducts();
        
        // 2. 각 상품에 대해 영상 상태 확인
        const videoStatusPromises = productsResponse.products.map(async (product) => {
          try {
            const statusResponse = await getFittingVideoStatus(product.product_id);
            
            // status가 'completed'이고 video_url이 있는 경우만 반환
            if (statusResponse.status === 'completed' && statusResponse.video_url) {
              return {
                product_id: product.product_id,
                product_name: product.name,
                video_url: statusResponse.video_url,
                status: 'completed' as const,
              };
            }
            return null;
          } catch (error) {
            // 개별 상품의 영상 상태 조회 실패는 무시하고 null 반환
            console.warn(`피팅 영상 상태 조회 실패 (product_id: ${product.product_id}):`, error);
            return null;
          }
        });
        
        // 3. 모든 Promise 완료 후 null이 아닌 값들만 필터링
        const results = await Promise.all(videoStatusPromises);
        return results.filter((result): result is CompletedFittingVideo => result !== null);
        
      } catch (error) {
        console.error("피팅 영상 목록 조회 실패:", error);
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1분간 데이터를 신선하다고 간주
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};