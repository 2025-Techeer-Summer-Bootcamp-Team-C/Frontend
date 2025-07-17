import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { CompletedOrder, OrderContextType } from "@/types/order";

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>([]);

  // localStorage에서 주문 내역 로드
  useEffect(() => {
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
      try {
        setOrderHistory(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to parse order history from localStorage:', error);
      }
    }
  }, []);

  // 주문 내역 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  const generateOrderId = () => {
    return `order_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  };

  const addOrder = (order: Omit<CompletedOrder, 'id'>) => {
    const newOrder: CompletedOrder = {
      ...order,
      id: generateOrderId(),
    };
    
    setOrderHistory(prevHistory => [newOrder, ...prevHistory]);
  };

  const getOrders = () => {
    return orderHistory;
  };

  const getLatestOrder = () => {
    return orderHistory.length > 0 ? orderHistory[0] : null;
  };

  const value: OrderContextType = {
    orderHistory,
    addOrder,
    getOrders,
    getLatestOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

export default OrderContext;