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
