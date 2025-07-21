import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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

  const handleAddToCart = (product: Product, quantity: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    addCartItemMutation.mutate({ productId: product.product_id, quantity });
  };

  const handleRemoveFromCart = (cartProductId: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    removeCartItemMutation.mutate(cartProductId);
  };

  const handleUpdateQuantity = (cartProductId: number, quantity: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (quantity <= 0) {
      handleRemoveFromCart(cartProductId);
    } else {
      updateCartItemMutation.mutate({ cartProductId, quantity });
    }
  };

  const handleIncreaseQuantity = (cartProductId: number) => {
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
  };

  const handleDecreaseQuantity = (cartProductId: number) => {
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
  };

  const value: CartContextType = {
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
    clearCart: () => {
      if (isAuthenticated) {
        cartData?.cart_product.forEach(item => {
          removeCartItemMutation.mutate(item.cart_product_id);
        });
      }
    },
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
