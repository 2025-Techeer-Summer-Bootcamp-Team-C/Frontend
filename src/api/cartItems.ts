import axiosInstance from "./axiosInstance";
import type { CartResponse, CartItemResponse, CartMessageResponse } from "@/types/cart";

export const fetchCartList = async () => {
    const response = await axiosInstance.get<CartResponse>("api/v1/users/cart/list");
    return response.data;
};

export const addCartItem = async (productId: number, quantity: number) => {
    const response = await axiosInstance.post<CartItemResponse>("api/v1/users/cart", { product_id: productId, quantity: quantity });
    return response.data;
};

export const removeCartItem = async (cartProductId: number) => {
    const response = await axiosInstance.delete<CartMessageResponse>(`api/v1/users/cart/${cartProductId}`);
    return response.data;
};

export const updateCartItem = async (cartProductId: number, quantity: number) => {
    const response = await axiosInstance.put<CartItemResponse>(`api/v1/users/cart/${cartProductId}`, { quantity: quantity });
    return response.data;
};