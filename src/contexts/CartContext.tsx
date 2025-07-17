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
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
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

  const addToCart = (product: Product, quantity: number) => {
    setCartData(prevCartData => {
      // 이미 장바구니에 있는 상품인지 확인
      const existingItemIndex = prevCartData.cart_product.findIndex(
        item => item.product.id === product.id
      );

      let updatedCartProducts;
      
      if (existingItemIndex >= 0) {
        // 이미 있는 상품이면 수량만 증가
        updatedCartProducts = prevCartData.cart_product.map((item, index) =>
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 새 상품이면 장바구니에 추가
        const newId = Math.max(...prevCartData.cart_product.map(item => item.id), 0) + 1;
        const newCartProduct = {
          id: newId,
          product,
          quantity,
          main_image: product.image,
        };
        updatedCartProducts = [...prevCartData.cart_product, newCartProduct];
      }

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

  const removeFromCart = (productId: number) => {
    setCartData(prevCartData => {
      const updatedCartProducts = prevCartData.cart_product.filter(
        item => item.product.id !== productId
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

  const increaseQuantity = (productId: number) => {
    setCartData(prevCartData => {
      const updatedCartProducts = prevCartData.cart_product.map(item =>
        item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
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

  const decreaseQuantity = (productId: number) => {
    setCartData(prevCartData => {
      const currentItem = prevCartData.cart_product.find(item => item.product.id === productId);
      
      if (!currentItem) return prevCartData;
      
      // 수량이 1이면 상품을 완전히 제거
      if (currentItem.quantity <= 1) {
        const updatedCartProducts = prevCartData.cart_product.filter(
          item => item.product.id !== productId
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
      } else {
        // 수량을 1 감소
        const updatedCartProducts = prevCartData.cart_product.map(item =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
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
      }
    });
  };

  const value: CartContextType = {
    cartData,
    totalPrice,
    updateCart,
    updateQuantity,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
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
