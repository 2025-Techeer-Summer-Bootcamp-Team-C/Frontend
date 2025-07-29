import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { generateFittingVideo, getFittingVideoStatus, startFittingDetail } from "../api/fittings";
import { fetchProductFittingImage, fetchProducts } from "../api/products";
import type { FittingVideoStatusResponse } from "../api/fittings";
import type { ProductFittingImageResponse } from "../api/products";
import { AxiosError } from "axios";

/**
 * 가상 피팅 영상 생성 뮤테이션 훅
 * getFittingVideoStatus를 활용하여 상태 기반 재시도 로직 구현
 * status가 pending 또는 processing인 경우 자동 재시도
 */
export const useGenerateFittingVideoMutation = () => {
  let isFirstAttempt = true;
  
  return useMutation<FittingVideoStatusResponse, Error, { product_id: number, user_image_id: number }>({
    mutationFn: async ({ product_id, user_image_id }) => {
      // 첫 번째 시도일 때만 3초 딜레이 적용
      if (isFirstAttempt) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        isFirstAttempt = false;
      }
      
      try {
        // 먼저 영상 생성 요청
        await generateFittingVideo(product_id, user_image_id);
      } catch (error) {
        // 400 에러(이미 완료됨)인 경우는 정상 처리
        if (!(error instanceof AxiosError && error.response?.status === 400)) {
          throw error;
        }
      }
      
      // 상태 확인
      const status = await getFittingVideoStatus(product_id, user_image_id);
      
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
 * 새로운 피팅 시작 뮤테이션 훅
 * startFittingDetail을 한 번만 호출하여 비용 중복 방지
 */
export const useStartFittingMutation = () => {
  return useMutation<{ user_image_id: number }, Error, File>({
    mutationFn: async (imageFile: File) => {
      console.log("새로운 피팅 시작 - startFittingDetail 호출");
      const fittingResponse = await startFittingDetail(imageFile);
      
      if (!fittingResponse.user_image_id) {
        throw new Error("피팅 시작 실패: user_image_id가 없습니다");
      }
      
      console.log("새 피팅 시작 - user_image_id:", fittingResponse.user_image_id);
      return fittingResponse;
    },
    retry: false, // 🚨 중요: 재시도 금지 - 비용 중복 방지
    onError: (error) => {
      console.error("피팅 시작 실패:", error);
    },
  });
};

/**
 * 피팅 결과 폴링 뮤테이션 훅 (재시도 안전)
 * userImageId에 대한 모든 상품의 피팅 결과를 개별적으로 폴링
 * startFittingDetail 호출 없이 결과만 확인하므로 재시도 시 비용 발생 없음
 */
export const useFittingResultsPollingMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ userImageId: number; results: Record<number, ProductFittingImageResponse> }, Error, { 
    userImageId: number;
    productIds: number[];
    onProgress?: (completedCount: number, totalCount: number) => void; 
  }>({
    mutationFn: async ({ userImageId, productIds, onProgress }) => {
      const results: Record<number, ProductFittingImageResponse> = {};
      let completedCount = 0;
      
      // 최소 3초 대기와 피팅 결과 폴링을 병렬로 실행
      const [fittingResults] = await Promise.all([
        (async () => {
          // 각 상품별로 피팅 결과 확인
          const promises = productIds.map(async (productId) => {
            try {
              const result = await fetchProductFittingImage(productId, userImageId);
              results[productId] = result;
              completedCount++;
              
              // 진행 상황 콜백 호출
              if (onProgress) {
                onProgress(completedCount, productIds.length);
              }
              
              return { productId, result };
            } catch (error: any) {
              // 404 에러는 아직 피팅이 완료되지 않았음을 의미
              if (error?.response?.status === 404) {
                throw new Error(`Product ${productId} fitting not ready yet`);
              }
              throw error;
            }
          });
          
          // 모든 상품의 피팅 결과를 기다림
          await Promise.all(promises);
          return results;
        })(),
        // 최소 3초 대기
        new Promise<void>(resolve => setTimeout(resolve, 3000))
      ]);
      
      return { userImageId, results: fittingResults };
    },
    retry: (failureCount, error: any) => {
      // 404 에러나 피팅이 아직 준비되지 않은 경우 재시도
      if (error?.message?.includes("fitting not ready yet") || 
          error?.message?.includes("404")) {
        return failureCount < 300; // 최대 300회 재시도 (5분)
      }
      return false;
    },
    retryDelay: () => {
      // 2초 간격으로 재시도
      return 2000;
    },
    onSuccess: (data) => {
      const completedProducts = Object.keys(data.results).length;
      console.log("피팅 결과 조회 성공:", data);
      console.log(`총 ${completedProducts}개의 피팅 결과를 찾았습니다.`);
      
      // React Query 캐시 업데이트 - 개별 피팅 결과 캐시 업데이트
      Object.entries(data.results).forEach(([productId, result]) => {
        queryClient.setQueryData(
          ["productFittingImage", parseInt(productId), data.userImageId], 
          result
        );
      });
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

export const useFittingVideos = (user_image_id?: number) => {
  return useQuery<CompletedFittingVideo[], Error>({
    queryKey: ["fittingVideos", user_image_id],
    queryFn: async () => {
      try {
        // user_image_id가 없으면 빈 배열 반환
        if (!user_image_id) {
          return [];
        }

        // 1. 모든 상품 정보 가져오기
        const productsResponse = await fetchProducts();
        
        // 2. 각 상품에 대해 영상 상태 확인
        const videoStatusPromises = productsResponse.products.map(async (product) => {
          try {
            const statusResponse = await getFittingVideoStatus(product.product_id, user_image_id);
            
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
    enabled: !!user_image_id, // user_image_id가 있을 때만 쿼리 실행
    staleTime: 1 * 60 * 1000, // 1분간 데이터를 신선하다고 간주
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};