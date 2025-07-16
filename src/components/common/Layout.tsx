import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import { useLocation } from "react-router-dom";
import type { HeaderVariant, FooterVariant } from "@/types/variants";

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
  totalPrice,
  onAddGift,
}: LayoutProps) => {
  const location = useLocation();

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
