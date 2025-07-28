import type { CartResponse } from "./cart";

// 백엔드 API 응답 타입들
export interface OrderedProduct {
  product_id: number;
  product_name: string;
  quantity: number;
  price_per_item: number;
  total_price: number;
}

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
}

export interface CartOrderResponse {
  order_id: number;
  user_id: number;
  total_price: number;
  status: string;
  created_at: string;
  ordered_products: OrderedProduct[];
  message: string;
}

export interface SingleOrderRequest {
  product_id: number;
  quantity?: number;
}

export interface CartOrderRequest {
  cart_product_ids: number[];
}

// 새로운 프론트엔드용 주문 타입들
export interface BuyerInfo {
  name: string;
  address: string;
  address2?: string;
  postalCode: string;
  region: string;
  regionCode: string;
  phone: string;
}

export interface CompletedOrder {
  id: number;
  orderNumber: string;
  orderDate: string;
  products: CartResponse['cart_product'];
  totalPrice: number;
  buyerInfo: BuyerInfo;
  status: 'completed' | 'shipping' | 'delivered';
  initial_credit: number;
  deducted_credit: number;
  remaining_credit: number;
}

export interface OrderContextType {
  orderHistory: CompletedOrder[];
  currentBuyerInfo: BuyerInfo | null;
  orderFormRef: React.RefObject<any>;
  addOrder: (order: CompletedOrder) => void; // API 응답의 complete한 주문 데이터 받음 (order_id 포함)
  getOrders: () => CompletedOrder[];
  getLatestOrder: () => CompletedOrder | null;
  setBuyerInfo: (info: BuyerInfo) => void;
  submitOrderForm: () => void;
  createSingleProductOrder: (productId: number, quantity: number, productImage?: string) => Promise<void>;
  createCartOrder: (cartProductIds: number[], cartData?: any) => Promise<void>;
  getOrderCredit: () => {
    initial_credit: number;
    deducted_credit: number;
    remaining_credit: number;
  };
}
