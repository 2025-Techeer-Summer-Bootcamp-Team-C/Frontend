import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import { useLocation } from "react-router-dom";
import type { HeaderVariant, FooterVariant } from "@/types/variants";
import { useCart } from "@/contexts/CartContext";

interface LayoutProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
  footerVariant?: FooterVariant;
  totalPrice?: number;
  onAddGift?: () => void;
}

const Layout = ({
  children,
  headerVariant,
  footerVariant,
  totalPrice: propTotalPrice,
  onAddGift,
}: LayoutProps) => {
  const location = useLocation();
  const { totalPrice: cartTotalPrice, directPurchaseProduct } = useCart();

  // headerVariant가 명시적으로 전달되지 않은 경우 경로 기반으로 자동 결정
  const getHeaderVariant = (): HeaderVariant => {
    if (headerVariant) return headerVariant;

    const path = location.pathname;

    // 경로별 헤더 variant 매핑
    if (path.includes("/product/")) return "detail";
    if (path.includes("/cart")) return "cart";
    if (
      path.includes("/order") ||
      path.includes("/summary") ||
      path.includes("/history")
    )
      return "order";

    return "default";
  };

  // footerVariant가 명시적으로 전달되지 않은 경우 경로 기반으로 자동 결정
  const getFooterVariant = (): FooterVariant => {
    if (footerVariant) return footerVariant;

    const path = location.pathname;

    // 경로별 푸터 variant 매핑
    if (path.includes("/cart")) return "cart";
    if (path.includes("/order") || path.includes("/summary")) return "order";
    if (path.includes("/history")) return "default";

    return "default";
  };

  // totalPrice 우선순위: prop으로 전달된 값 > 경로별 로직
  const getTotalPrice = () => {
    if (propTotalPrice) return propTotalPrice;
    
    // 장바구니 페이지에서는 항상 장바구니 총액 사용
    if (location.pathname.includes("/cart")) {
      return cartTotalPrice;
    }
    
    // 주문 관련 페이지에서는 직접 구매 상품이 있으면 그 가격 × 수량, 없으면 장바구니 총액
    if (location.pathname.includes("/order") || location.pathname.includes("/summary")) {
      return directPurchaseProduct ? directPurchaseProduct.price * directPurchaseProduct.quantity : cartTotalPrice;
    }
    
    return cartTotalPrice;
  };
  
  const totalPrice = getTotalPrice();

  return (
    <div>
      <Header variant={getHeaderVariant()} />
      <main className="mb-16">{children}</main>
      <Footer
        variant={getFooterVariant()}
        totalPrice={totalPrice}
        onAddGift={onAddGift}
      />
    </div>
  );
};

export default Layout;
