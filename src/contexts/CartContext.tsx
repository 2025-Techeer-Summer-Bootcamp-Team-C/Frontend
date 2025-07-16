import { createContext, useContext, useState, type ReactNode } from "react";
import { cartDummy } from "@/dummys/cartDummy";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

interface DirectPurchaseProduct extends Product {
  quantity: number;
}

interface CartContextType {
  cartData: CartItem;
  totalPrice: number;
  updateCart: (newCartData: CartItem) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  directPurchaseProduct: DirectPurchaseProduct | null;
  setDirectPurchaseProduct: (product: DirectPurchaseProduct | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartData, setCartData] = useState<CartItem>(cartDummy);
  const [directPurchaseProduct, setDirectPurchaseProduct] = useState<DirectPurchaseProduct | null>(null);

  const totalPrice = cartData.total_price;

  const updateCart = (newCartData: CartItem) => {
    setCartData(newCartData);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartData(prevCartData => {
      const updatedCartProducts = prevCartData.cart_product.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      );
      
      const newTotalPrice = updatedCartProducts.reduce(
        (total, item) => total + (item.product.price * item.quantity), 
        0
      );
      
      return {
        ...prevCartData,
        cart_product: updatedCartProducts,
        total_price: newTotalPrice
      };
    });
  };

  const value: CartContextType = {
    cartData,
    totalPrice,
    updateCart,
    updateQuantity,
    directPurchaseProduct,
    setDirectPurchaseProduct,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
