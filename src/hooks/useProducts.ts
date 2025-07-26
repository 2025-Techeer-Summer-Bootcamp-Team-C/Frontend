import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import {
  fetchProducts,
  fetchProductDetail,
  fetchCategories,
  fetchProductFittingImage,
  type ProductFittingImageResponse,
} from "../api/products";

// 상품 목록 쿼리
export const useProductsQuery = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};


// 상품 상세 쿼리
export const useProductDetailQuery = (productId: number) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductDetail(productId),
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

// 상품별 피팅 이미지 조회 mutation (폴링 없음)
export const useProductFittingImageMutation = () => {
  return useMutation({
    mutationFn: ({ productId, userImageId }: { productId: number; userImageId: number }) =>
      fetchProductFittingImage(productId, userImageId),
    retry: false, // 폴링 제거, 결과만 가져오기
  });
};

// 모든 상품의 기존 피팅 결과를 가져오는 커스텀 훅 (폴링 없음)
export const useAllProductsFittingImages = (
  productIds: number[],
  userImageId: number | null,
  enabled: boolean = true
) => {
  const [fittingResults, setFittingResults] = useState<Record<number, ProductFittingImageResponse>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<number, string | null>>({});
  const [completedProductIds, setCompletedProductIds] = useState<Set<number>>(new Set());

  const fittingMutation = useProductFittingImageMutation();

  // 개별 상품의 기존 피팅 이미지를 가져오는 함수 (폴링 없음)
  const fetchSingleProductFitting = useCallback(async (productId: number) => {
    if (!userImageId || completedProductIds.has(productId)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [productId]: true }));
    setErrorStates(prev => ({ ...prev, [productId]: null }));

    try {
      const result = await fittingMutation.mutateAsync({
        productId,
        userImageId,
      });

      setFittingResults(prev => ({ ...prev, [productId]: result }));
      setCompletedProductIds(prev => new Set(prev).add(productId));
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
      console.log(`상품 ${productId} 기존 피팅 결과 로드 성공`);
      
    } catch (error: any) {
      console.log(`상품 ${productId} 기존 피팅 결과 없음`);
      setErrorStates(prev => ({ 
        ...prev, 
        [productId]: error?.response?.data?.error || 'No existing fitting result' 
      }));
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  }, [userImageId, fittingMutation, completedProductIds]);

  // 모든 상품에 대해 기존 피팅 이미지 한 번만 조회
  useEffect(() => {
    if (!enabled || !userImageId || productIds.length === 0) {
      return;
    }

    console.log("기존 피팅 결과 조회 시작:", { productIds, userImageId });
    
    // 병렬로 모든 상품의 기존 피팅 이미지 가져오기
    productIds.forEach(productId => {
      if (!completedProductIds.has(productId) && !loadingStates[productId]) {
        console.log(`상품 ${productId} 기존 피팅 결과 조회`);
        fetchSingleProductFitting(productId);
      }
    });
  }, [productIds, userImageId, enabled, fetchSingleProductFitting]);

  // 상태 리셋 함수
  const resetFittingResults = useCallback(() => {
    setFittingResults({});
    setLoadingStates({});
    setErrorStates({});
    setCompletedProductIds(new Set());
  }, []);

  // 특정 상품 재시도 함수
  const retryProduct = useCallback((productId: number) => {
    if (!userImageId) return;
    
    setCompletedProductIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setErrorStates(prev => ({ ...prev, [productId]: null }));
    fetchSingleProductFitting(productId);
  }, [userImageId, fetchSingleProductFitting]);

  // 수동으로 피팅 결과를 설정하는 함수
  const setManualFittingResults = useCallback((results: Record<number, ProductFittingImageResponse>) => {
    setFittingResults(results);
    setCompletedProductIds(new Set(Object.keys(results).map(Number)));
    setLoadingStates({});
    setErrorStates({});
  }, []);

  return {
    fittingResults,
    loadingStates,
    errorStates,
    completedProductIds: Array.from(completedProductIds),
    isAllCompleted: productIds.length > 0 && productIds.every(id => completedProductIds.has(id)),
    isAnyLoading: Object.values(loadingStates).some(loading => loading),
    resetFittingResults,
    retryProduct,
    setManualFittingResults,
  };
};
