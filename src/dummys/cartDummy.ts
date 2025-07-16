import type { CartItem } from "../types/cart";
import { productDummy } from "./productDummy";

const cartProducts = [
  {
    id: 1,
    product: productDummy[0],
    quantity: 1,
    main_image: productDummy[0].image,
  },
  {
    id: 2,
    product: productDummy[2],
    quantity: 2,
    main_image: productDummy[2].image,
  },
  {
    id: 3,
    product: productDummy[6],
    quantity: 3,
    main_image: productDummy[6].image,
  },
  {
    id: 4,
    product: productDummy[10],
    quantity: 1,
    main_image: productDummy[10].image,
  },
];

export const cartDummy: CartItem = {
  cart_product: cartProducts,
  total_price: cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0),
};
