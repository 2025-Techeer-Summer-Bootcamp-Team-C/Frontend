import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSingleOrder, createCartOrder, type SingleOrderRequest, type CartOrderRequest, type SingleOrderResponse, type CartOrderResponse } from '../api/orders';

// 단일 상품 주문 생성 훅
export const useCreateSingleOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleOrderResponse, Error, SingleOrderRequest>({
    mutationFn: createSingleOrder,
    onSuccess: (data) => {
      console.log('단일 상품 주문 생성 성공:', data);
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'orders'] });
    },
    onError: (error) => {
      console.error('단일 상품 주문 생성 실패:', error);
    },
  });
};

// 장바구니 상품 주문 생성 훅
export const useCreateCartOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<CartOrderResponse, Error, CartOrderRequest>({
    mutationFn: createCartOrder,
    onSuccess: (data) => {
      console.log('장바구니 주문 생성 성공:', data);
      // 성공 시 관련 쿼리 무효화 (장바구니 데이터도 업데이트 필요)
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
    onError: (error) => {
      console.error('장바구니 주문 생성 실패:', error);
    },
  });
};