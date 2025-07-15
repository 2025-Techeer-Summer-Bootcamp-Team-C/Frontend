import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import { useLocation } from "react-router-dom";

type HeaderVariant = "기본" | "상세페이지" | "장바구니" | "주문";
type FooterVariant = "default" | "cart" | "order";

interface LayoutProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
  footerVariant?: FooterVariant;
  totalPrice?: number;
  onContinue?: () => void;
  onAddGift?: () => void;
}

const Layout = ({ 
  children, 
  headerVariant, 
  footerVariant,
  totalPrice,
  onContinue,
  onAddGift 
}: LayoutProps) => {
  const location = useLocation();
  
  // headerVariant가 명시적으로 전달되지 않은 경우 경로 기반으로 자동 결정
  const getHeaderVariant = (): HeaderVariant => {
    if (headerVariant) return headerVariant;
    
    const path = location.pathname;
    
    // 경로별 헤더 variant 매핑
    if (path.includes('/product/') || path.includes('/detail')) return "상세페이지";
    if (path.includes('/cart') || path.includes('/basket')) return "장바구니";
    if (path.includes('/order') || path.includes('/checkout')) return "주문";
    
    return "기본";
  };

  // footerVariant가 명시적으로 전달되지 않은 경우 경로 기반으로 자동 결정
  const getFooterVariant = (): FooterVariant => {
    if (footerVariant) return footerVariant;
    
    const path = location.pathname;
    
    // 경로별 푸터 variant 매핑
    if (path.includes('/cart') || path.includes('/basket')) return "cart";
    if (path.includes('/order') || path.includes('/checkout')) return "order";
    
    return "default";
  };

  return (
    <div>
      <Header variant={getHeaderVariant()} />
      <main className="mb-16">
        {children}
      </main>
      <Footer 
        variant={getFooterVariant()} 
        totalPrice={totalPrice}
        onContinue={onContinue}
        onAddGift={onAddGift}
      />
    </div>
  );
};

export default Layout;