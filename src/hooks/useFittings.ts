import { useMutation } from "@tanstack/react-query";
import { generateFittingVideo, getFittingVideoStatus } from "../api/fittings";
import type { FittingVideoStatusResponse } from "../api/fittings";
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