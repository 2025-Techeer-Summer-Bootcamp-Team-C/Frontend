import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from "react";
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
  isAuthenticated: boolean;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (cartProductId: number) => void;
  updateQuantity: (cartProductId: number, quantity: number) => void;
  increaseQuantity: (cartProductId: number) => void;
  decreaseQuantity: (cartProductId: number) => void;
  directPurchaseProduct: DirectPurchaseProduct | null;
  setDirectPurchaseProduct: (product: DirectPurchaseProduct | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [directPurchaseProduct, setDirectPurchaseProduct] =
    useState<DirectPurchaseProduct | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    };

    checkAuthStatus();

    const handleLoginStatusChange = () => {
      const token = localStorage.getItem("access_token");
      const wasAuthenticated = isAuthenticated;
      
      if (!token) {
        // User logged out
        setIsAuthenticated(false);
        setDirectPurchaseProduct(null);
      } else {
        // User logged in
        setIsAuthenticated(true);
        // If this is a fresh login (not just a page refresh), clear direct purchase
        if (!wasAuthenticated) {
          setDirectPurchaseProduct(null);
        }
      }
    };

    window.addEventListener("loginStatusChange", handleLoginStatusChange);
    return () => window.removeEventListener("loginStatusChange", handleLoginStatusChange);
  }, [isAuthenticated]);

  // Only fetch cart data if authenticated
  const { data: cartData, isLoading, error } = useCartQuery();
  const addCartItemMutation = useAddCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();

  const totalPrice = isAuthenticated ? (cartData?.total_price || 0) : 0;

  const handleAddToCart = useCallback((product: Product, quantity: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    addCartItemMutation.mutate({ productId: product.product_id, quantity });
  }, [isAuthenticated, addCartItemMutation]);

  const handleRemoveFromCart = useCallback((cartProductId: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    removeCartItemMutation.mutate(cartProductId);
  }, [isAuthenticated, removeCartItemMutation]);

  const handleUpdateQuantity = useCallback((cartProductId: number, quantity: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (quantity <= 0) {
      handleRemoveFromCart(cartProductId);
    } else {
      updateCartItemMutation.mutate({ cartProductId, quantity });
    }
  }, [isAuthenticated, handleRemoveFromCart, updateCartItemMutation]);

  const handleIncreaseQuantity = useCallback((cartProductId: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    const currentItem = cartData?.cart_product.find(
      (item) => item.cart_product_id === cartProductId
    );
    if (currentItem) {
      handleUpdateQuantity(cartProductId, currentItem.quantity + 1);
    }
  }, [isAuthenticated, cartData, handleUpdateQuantity]);

  const handleDecreaseQuantity = useCallback((cartProductId: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    const currentItem = cartData?.cart_product.find(
      (item) => item.cart_product_id === cartProductId
    );
    if (currentItem) {
      handleUpdateQuantity(cartProductId, currentItem.quantity - 1);
    }
  }, [isAuthenticated, cartData, handleUpdateQuantity]);

  const clearCart = useCallback(() => {
    if (isAuthenticated) {
      cartData?.cart_product.forEach(item => {
        removeCartItemMutation.mutate(item.cart_product_id);
      });
    }
  }, [isAuthenticated, cartData, removeCartItemMutation]);

  const value: CartContextType = useMemo(() => ({
    cartData: isAuthenticated ? cartData : undefined,
    totalPrice,
    isLoading: isAuthenticated ? isLoading : false,
    error: isAuthenticated ? (error as Error | null) : null,
    isAuthenticated,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    increaseQuantity: handleIncreaseQuantity,
    decreaseQuantity: handleDecreaseQuantity,
    directPurchaseProduct,
    setDirectPurchaseProduct,
    clearCart,
  }), [
    cartData,
    totalPrice,
    isLoading,
    error,
    isAuthenticated,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    directPurchaseProduct,
    setDirectPurchaseProduct,
    clearCart,
  ]);

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
