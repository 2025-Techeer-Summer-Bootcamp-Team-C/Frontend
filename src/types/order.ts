import type { CartItem } from "./cart";

export type Order = {
  id: number;
  user_id: number;
  total_price: number;
  address: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  count: number;
};

// 새로운 프론트엔드용 주문 타입들
export interface BuyerInfo {
  name: string;
  address: string;
  postalCode: string;
  phone: string;
}

export interface CompletedOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  products: CartItem['cart_product'];
  totalPrice: number;
  buyerInfo: BuyerInfo;
  status: 'completed' | 'shipping' | 'delivered';
}

export interface OrderContextType {
  orderHistory: CompletedOrder[];
  addOrder: (order: Omit<CompletedOrder, 'id'>) => void;
  getOrders: () => CompletedOrder[];
  getLatestOrder: () => CompletedOrder | null;
}
