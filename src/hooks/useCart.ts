import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCartItem, removeCartItem, updateCartItem, fetchCartList } from "@/api/cartItems";

export const useCartQuery = () => {
    const isAuthenticated = !!localStorage.getItem("access_token");
    
    return useQuery({
        queryKey: ["cart"], // Backend handles user isolation automatically
        queryFn: fetchCartList,
        enabled: isAuthenticated, // Only fetch when authenticated
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useAddCartItemMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => 
            addCartItem(productId, quantity),
        onMutate: async ({ productId, quantity }) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ["cart"] });
            
            // 이전 데이터 백업
            const previousCartData = queryClient.getQueryData(["cart"]);
            
            // Optimistic update - 임시로 장바구니에 아이템 추가
            queryClient.setQueryData(["cart"], (old: any) => {
                if (!old) return old;
                // 임시 아이템 추가 (실제 API 응답과 맞춰야 함)
                return {
                    ...old,
                    items: [...(old.items || []), {
                        id: `temp-${Date.now()}`,
                        productId,
                        quantity,
                        isOptimistic: true
                    }]
                };
            });
            
            return { previousCartData };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error, _variables, context) => {
            // 에러 시 이전 데이터로 롤백
            if (context?.previousCartData) {
                queryClient.setQueryData(["cart"], context.previousCartData);
            }
            console.error("장바구니 추가 실패:", error);
        },
    });
};

export const useRemoveCartItemMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (cartProductId: number) => removeCartItem(cartProductId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
            console.error("장바구니 삭제 실패:", error);
        },
    });
};

export const useUpdateCartItemMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ cartProductId, quantity }: { cartProductId: number; quantity: number }) => 
            updateCartItem(cartProductId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
            console.error("수량 업데이트 실패:", error);
        },
    });
};