import { createContext, useContext, useState, type ReactNode } from "react";
import { 
  useCartQuery, 
  useAddCartItemMutation, 
  useRemoveCartItemMutation, 
  useUpdateCartItemMutation 
} from "@/hooks/useCart";
import type { CartResponse } from "@/types/cart";
import type { Product } from "@/types/product";

interface DirectPurchaseProduct extends Product {
  quantity: number;
}

interface CartContextType {
  cartData: CartResponse | undefined;
  totalPrice: number;
  isLoading: boolean;
  error: Error | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (cartProductId: number) => void;
  updateQuantity: (cartProductId: number, quantity: number) => void;
  increaseQuantity: (cartProductId: number) => void;
  decreaseQuantity: (cartProductId: number) => void;
  directPurchaseProduct: DirectPurchaseProduct | null;
  setDirectPurchaseProduct: (product: DirectPurchaseProduct | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [directPurchaseProduct, setDirectPurchaseProduct] =
    useState<DirectPurchaseProduct | null>(null);
  
  // Use React Query hooks for cart data
  const { data: cartData, isLoading, error } = useCartQuery();
  const addCartItemMutation = useAddCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();

  const totalPrice = cartData?.total_price || 0;

  const handleAddToCart = (product: Product, quantity: number) => {
    addCartItemMutation.mutate({ productId: product.product_id, quantity });
  };

  const handleRemoveFromCart = (cartProductId: number) => {
    removeCartItemMutation.mutate(cartProductId);
  };

  const handleUpdateQuantity = (cartProductId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(cartProductId);
    } else {
      updateCartItemMutation.mutate({ cartProductId, quantity });
    }
  };

  const handleIncreaseQuantity = (cartProductId: number) => {
    const currentItem = cartData?.cart_product.find(
      (item) => item.cart_product_id === cartProductId
    );
    if (currentItem) {
      handleUpdateQuantity(cartProductId, currentItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (cartProductId: number) => {
    const currentItem = cartData?.cart_product.find(
      (item) => item.cart_product_id === cartProductId
    );
    if (currentItem) {
      handleUpdateQuantity(cartProductId, currentItem.quantity - 1);
    }
  };

  const value: CartContextType = {
    cartData,
    totalPrice,
    isLoading,
    error: error as Error | null,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    increaseQuantity: handleIncreaseQuantity,
    decreaseQuantity: handleDecreaseQuantity,
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
