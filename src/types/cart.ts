export interface CartResponse {
  cart_product: {
    cart_product_id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total_price: number;
}

export interface CartItemResponse {
  cart_product_id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// 추가된 응답 타입들
export interface CartMessageResponse {
  message: string;
}

export interface CartErrorResponse {
  error: string;
}