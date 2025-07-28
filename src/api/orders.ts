import axiosInstance from './axiosInstance';

// 단일 상품 주문 생성 요청 타입
export interface SingleOrderRequest {
  product_id: number;
  quantity?: number;
}

// 장바구니 상품 주문 생성 요청 타입
export interface CartOrderRequest {
  cart_product_ids: number[]; // 실제로는 product_id 배열을 보냄
}

// 단일 상품 주문 응답 타입
export interface SingleOrderResponse {
  order_id: number;
  user_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price_per_item: number;
  total_price: number;
  status: string;
  created_at: string;
  initial_credit: number;
  deducted_credit: number;
  remaining_credit: number;
}

// 주문된 상품 정보 타입
export interface OrderedProduct {
  product_id: number;
  product_name: string;
  quantity: number;
  price_per_item: number;
  total_price: number;
}

// 장바구니 상품 주문 응답 타입
export interface CartOrderResponse {
  order_id: number;
  user_id: number;
  total_price: number;
  status: string;
  created_at: string;
  ordered_products: OrderedProduct[];
  message: string;
  initial_credit: number;
  deducted_credit: number;
  remaining_credit: number;
}

// 단일 상품 주문 생성
export const createSingleOrder = async (orderData: SingleOrderRequest): Promise<SingleOrderResponse> => {
  try {
    const response = await axiosInstance.post('/api/v1/orders/single/', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 장바구니 상품 주문 생성
export const createCartOrder = async (orderData: CartOrderRequest): Promise<CartOrderResponse> => {
  try {
    const response = await axiosInstance.post('/api/v1/orders/cart/', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};