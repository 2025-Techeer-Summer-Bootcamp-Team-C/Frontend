import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback, type ReactNode } from "react";
import type { CompletedOrder, OrderContextType, BuyerInfo } from "@/types/order";
import type { OrderInformationFormRef } from "@/components/forms/OrderInformationForm";

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>([]);
  const [currentBuyerInfo, setCurrentBuyerInfo] = useState<BuyerInfo | null>(null);
  const orderFormRef = useRef<OrderInformationFormRef>(null);

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

    // currentBuyerInfo도 localStorage에서 로드
    const savedBuyerInfo = localStorage.getItem('currentBuyerInfo');
    if (savedBuyerInfo) {
      try {
        setCurrentBuyerInfo(JSON.parse(savedBuyerInfo));
      } catch (error) {
        console.error('Failed to parse buyer info from localStorage:', error);
      }
    }
  }, []);

  // 주문 내역 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  // currentBuyerInfo 변경 시 localStorage에 저장
  useEffect(() => {
    if (currentBuyerInfo) {
      localStorage.setItem('currentBuyerInfo', JSON.stringify(currentBuyerInfo));
    }
  }, [currentBuyerInfo]);

  const generateOrderId = useCallback(() => {
    return `order_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }, []);

  const addOrder = useCallback((order: Omit<CompletedOrder, 'id'>) => {
    const newOrder: CompletedOrder = {
      ...order,
      id: generateOrderId(),
    };
    
    setOrderHistory(prevHistory => [newOrder, ...prevHistory]);
  }, [generateOrderId]);

  const getOrders = useCallback(() => {
    return orderHistory;
  }, [orderHistory]);

  const getLatestOrder = useCallback(() => {
    return orderHistory.length > 0 ? orderHistory[0] : null;
  }, [orderHistory]);

  const setBuyerInfo = useCallback((info: BuyerInfo) => {
    setCurrentBuyerInfo(info);
  }, []);

  const submitOrderForm = useCallback(() => {
    orderFormRef.current?.submitForm();
  }, []);

  const value: OrderContextType = useMemo(() => ({
    orderHistory,
    currentBuyerInfo,
    orderFormRef,
    addOrder,
    getOrders,
    getLatestOrder,
    setBuyerInfo,
    submitOrderForm,
  }), [
    orderHistory,
    currentBuyerInfo,
    orderFormRef,
    addOrder,
    getOrders,
    getLatestOrder,
    setBuyerInfo,
    submitOrderForm,
  ]);

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