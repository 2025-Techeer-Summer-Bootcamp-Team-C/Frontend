import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback, type ReactNode } from "react";
import type { CompletedOrder, OrderContextType, BuyerInfo } from "@/types/order";
import type { OrderInformationFormRef } from "@/components/forms/OrderInformationForm";
import { useCreateSingleOrder, useCreateCartOrder } from "@/hooks/useOrders";

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>([]);
  const [currentBuyerInfo, setCurrentBuyerInfo] = useState<BuyerInfo | null>(null);
  const orderFormRef = useRef<OrderInformationFormRef>(null);
  
  // Order API 훅들
  const createSingleOrderMutation = useCreateSingleOrder();
  const createCartOrderMutation = useCreateCartOrder();

  // localStorage에서 주문 내역 로드 (API 우선, localStorage는 백업)
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

  // 주문 내역 변경 시 localStorage에 저장 (API 데이터 백업)
  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  // currentBuyerInfo 변경 시 localStorage에 저장
  useEffect(() => {
    if (currentBuyerInfo) {
      localStorage.setItem('currentBuyerInfo', JSON.stringify(currentBuyerInfo));
    }
  }, [currentBuyerInfo]);

  // API에서 제공하는 order_id를 그대로 사용하므로 generateOrderId 함수 제거
  const addOrder = useCallback((order: CompletedOrder) => {
    // API 응답의 order_id가 이미 포함된 완전한 주문 데이터를 받음
    setOrderHistory(prevHistory => [order, ...prevHistory]);
  }, []);

  // API 데이터 기반 주문 조회 - 주문 내역은 API 응답으로 생성된 데이터 사용
  const getOrders = useCallback(() => {
    // orderHistory는 이미 API 응답으로 생성된 데이터이므로 그대로 반환
    return orderHistory;
  }, [orderHistory]);

  // 최신 주문 조회 - API 응답 데이터에서 가장 최근 주문 반환
  const getLatestOrder = useCallback(() => {
    // orderHistory는 API 응답으로 생성되며, 시간순 정렬되어 있음
    return orderHistory.length > 0 ? orderHistory[0] : null;
  }, [orderHistory]);

  const setBuyerInfo = useCallback((info: BuyerInfo) => {
    setCurrentBuyerInfo(info);
  }, []);

  const submitOrderForm = useCallback(() => {
    orderFormRef.current?.submitForm();
  }, []);

  // API 기반 단일 상품 주문 생성 - 모든 정보는 API 응답에서 가져옴
  const createSingleProductOrder = useCallback(async (productId: number, quantity: number, productImage?: string) => {
    try {
      const orderData = { product_id: productId, quantity };
      const response = await createSingleOrderMutation.mutateAsync(orderData);
      
      // API 응답 데이터를 기반으로 주문 정보 구성 (API의 order_id 사용)
      const orderInfo: CompletedOrder = {
        id: response.order_id, // API 응답의 order_id를 그대로 사용 (number 타입)
        orderNumber: response.order_id.toString(),
        orderDate: response.created_at,
        products: [{
          cart_product_id: response.product_id,
          product_id: response.product_id,
          name: response.product_name,
          image: productImage || '', // 이미지는 프론트엔드에서 추가 제공
          quantity: response.quantity,
          price: response.price_per_item
        }],
        totalPrice: response.total_price,
        buyerInfo: currentBuyerInfo || {
          name: "",
          address: "",
          address2: "",
          postalCode: "",
          region: "",
          regionCode: "",
          phone: ""
        },
        status: 'completed' as const
      };
      
      // API 응답 기반 주문 데이터를 orderHistory에 추가
      addOrder(orderInfo);
      
    } catch (error) {
      console.error('단일 상품 주문 생성 실패:', error);
      throw error;
    }
  }, [createSingleOrderMutation, currentBuyerInfo, addOrder]);

  // API 기반 장바구니 주문 생성 - 모든 정보는 API 응답에서 가져옴
  const createCartOrder = useCallback(async (cartProductIds: number[], cartData?: any) => {
    try {
      const orderData = { cart_product_ids: cartProductIds };
      const response = await createCartOrderMutation.mutateAsync(orderData);
      
      // 장바구니 데이터에서 이미지 정보 매핑용 맵 생성
      const imageMap = new Map<number, string>();
      if (cartData?.cart_product) {
        cartData.cart_product.forEach((item: any) => {
          imageMap.set(item.product_id, item.image);
        });
      }
      
      // API 응답 데이터를 기반으로 주문 정보 구성 (API의 order_id 사용)
      const orderInfo: CompletedOrder = {
        id: response.order_id, // API 응답의 order_id를 그대로 사용 (number 타입)
        orderNumber: response.order_id.toString(),
        orderDate: response.created_at,
        products: response.ordered_products.map(product => ({
          cart_product_id: product.product_id,
          product_id: product.product_id,
          name: product.product_name,
          image: imageMap.get(product.product_id) || '', // 장바구니 데이터에서 이미지 정보 가져오기
          quantity: product.quantity,
          price: product.price_per_item
        })),
        totalPrice: response.total_price,
        buyerInfo: currentBuyerInfo || {
          name: "",
          address: "",
          address2: "",
          postalCode: "",
          region: "",
          regionCode: "",
          phone: ""
        },
        status: 'completed' as const
      };
      
      // API 응답 기반 주문 데이터를 orderHistory에 추가
      addOrder(orderInfo);
      
    } catch (error) {
      console.error('장바구니 주문 생성 실패:', error);
      throw error;
    }
  }, [createCartOrderMutation, currentBuyerInfo, addOrder]);

  // API 연동 완료된 OrderContext 값 - 모든 주문 관련 기능이 API 기반으로 동작
  const value: OrderContextType = useMemo(() => ({
    orderHistory, // API 응답으로 생성된 주문 내역
    currentBuyerInfo,
    orderFormRef,
    addOrder, // API 응답 데이터를 orderHistory에 추가
    getOrders, // API 기반 주문 내역 조회
    getLatestOrder, // API 기반 최신 주문 조회
    setBuyerInfo,
    submitOrderForm,
    createSingleProductOrder, // API 호출 + 응답 데이터 처리
    createCartOrder, // API 호출 + 응답 데이터 처리
  }), [
    orderHistory,
    currentBuyerInfo,
    orderFormRef,
    addOrder,
    getOrders,
    getLatestOrder,
    setBuyerInfo,
    submitOrderForm,
    createSingleProductOrder,
    createCartOrder,
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