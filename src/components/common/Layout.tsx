import Header from "./Header";
import Footer from "./Footer";
import React from "react";
import { useLocation } from "react-router-dom";
import type { HeaderVariant, FooterVariant } from "@/types/variants";
import { useCart } from "@/contexts/CartContext";
import { getLayoutConfig } from "@/config/layoutConfig";

interface LayoutProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
  footerVariant?: FooterVariant;
  totalPrice?: number;
}

const Layout = ({
  children,
  headerVariant,
  footerVariant,
  totalPrice: propTotalPrice,
}: LayoutProps) => {
  const location = useLocation();
  const { totalPrice: cartTotalPrice, directPurchaseProduct } = useCart();

  // 개발 단계에서 레이아웃 설정 검증
  // useEffect(() => {
  //   validateLayoutConfig();
  // }, []);

  const layoutConfig = getLayoutConfig(location.pathname);

  const finalHeaderVariant: HeaderVariant =
    headerVariant ?? layoutConfig.header;
  const finalFooterVariant: FooterVariant =
    footerVariant ?? layoutConfig.footer;

  // totalPrice 우선순위: prop으로 전달된 값 > 경로별 로직
  const getTotalPrice = () => {
    if (propTotalPrice) return propTotalPrice;

    // 장바구니 페이지에서는 항상 장바구니 총액 사용
    if (location.pathname.includes("/cart")) {
      return cartTotalPrice;
    }

    // 주문 관련 페이지에서는 직접 구매 상품이 있으면 그 가격 × 수량, 없으면 장바구니 총액
    if (
      location.pathname.includes("/order") ||
      location.pathname.includes("/summary")
    ) {
      return directPurchaseProduct
        ? directPurchaseProduct.price * directPurchaseProduct.quantity
        : cartTotalPrice;
    }

    return cartTotalPrice;
  };

  const totalPrice = getTotalPrice();

  return (
    <div>
      <Header variant={finalHeaderVariant} />
      <main className="mb-16">{children}</main>
      <Footer variant={finalFooterVariant} totalPrice={totalPrice} />
    </div>
  );
};

export default Layout;
