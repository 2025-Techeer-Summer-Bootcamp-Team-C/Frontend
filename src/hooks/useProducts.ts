import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductDetail,
  fetchCategories,
} from "../api/products";

// 상품 목록 쿼리
export const useProductsQuery = (showFitting?: boolean) => {
  return useQuery({
    queryKey: ["products", { showFitting }],
    queryFn: () => fetchProducts(showFitting),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 상품 상세 쿼리
export const useProductDetailQuery = (
  productId: number,
  showFitting?: boolean
) => {
  return useQuery({
    queryKey: ["product", productId, { showFitting }],
    queryFn: () => fetchProductDetail(productId, showFitting),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 카테고리 쿼리
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // 30분 (카테고리는 자주 변경되지 않음)
    gcTime: 60 * 60 * 1000, // 1시간
  });
};
