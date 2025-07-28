import { useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchProductDetail } from "../api/products";
import type { ProductDetail } from "../types/product";

/**
 * 상품 데이터 prefetching을 위한 커스텀 훅
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  // 상품 목록 prefetch
  const prefetchProducts = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["products"],
      queryFn: () => fetchProducts(),
      staleTime: 5 * 60 * 1000, // 5분
    });
  };

  // 상품 상세 prefetch (호버 시 미리 로드)
  const prefetchProductDetail = async (productId: number): Promise<ProductDetail | undefined> => {
    const cachedData = queryClient.getQueryData<ProductDetail>(["product", productId]);
    if (cachedData) {
      return cachedData;
    }

    await queryClient.prefetchQuery({
      queryKey: ["product", productId],
      queryFn: () => fetchProductDetail(productId),
      staleTime: 5 * 60 * 1000,
    });

    return queryClient.getQueryData<ProductDetail>(["product", productId]);
  };

  return {
    prefetchProducts,
    prefetchProductDetail,
  };
};