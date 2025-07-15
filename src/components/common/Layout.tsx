import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import { useLocation } from "react-router-dom";

type HeaderVariant = "기본" | "상세페이지" | "장바구니" | "주문";

interface LayoutProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
}

const Layout = ({ children, headerVariant }: LayoutProps) => {
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

  return (
    <div>
      <Header variant={getHeaderVariant()} />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;