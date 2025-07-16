import type { Product } from "./product";

export interface Cart {
  id: number;
  user_id: number;
  product_id: number;
  count: number;
}

export interface CartItem {
  cart_product: {
    id: number;
    product: Product;
    quantity: number;
    main_image: string;
  }[];
  total_price: number;
}
