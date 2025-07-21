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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
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