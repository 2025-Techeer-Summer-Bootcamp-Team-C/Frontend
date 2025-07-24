import { useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchProductDetail } from "../api/products";

/**
 * 상품 데이터 prefetching을 위한 커스텀 훅
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  // 상품 목록 prefetch
  const prefetchProducts = async (showFitting?: boolean) => {
    await queryClient.prefetchQuery({
      queryKey: ["products", { showFitting }],
      queryFn: () => fetchProducts(showFitting),
      staleTime: 5 * 60 * 1000, // 5분
    });
  };

  // 상품 상세 prefetch (호버 시 미리 로드)
  const prefetchProductDetail = async (productId: number, showFitting?: boolean) => {
    await queryClient.prefetchQuery({
      queryKey: ["product", productId, { showFitting }],
      queryFn: () => fetchProductDetail(productId, showFitting),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    prefetchProducts,
    prefetchProductDetail,
  };
};