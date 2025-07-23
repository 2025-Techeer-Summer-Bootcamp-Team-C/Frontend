import Header from "./Header";
import Footer from "./Footer";
import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { getLayoutConfig } from "@/config/layoutConfig";
import VideoSection from "@/components/sections/VideoSection";
import Audio from "@/components/Audio";
import OnBoarding from "@/components/sections/OnBoarding";
import MorphLogo from "@/components/sections/MorphLogo";

interface LayoutProps {
  children: React.ReactNode;
  totalPrice?: number;
}

const Layout = ({ children, totalPrice: propTotalPrice }: LayoutProps) => {
  const location = useLocation();
  const { totalPrice: cartTotalPrice, directPurchaseProduct } = useCart();
  const audioRef = useRef<{ setVolume: (volume: number) => void }>(null);
  const [onboardingTextStyle, setOnboardingTextStyle] = useState(
    "opacity-0 translate-y-8"
  );

  const layoutConfig = getLayoutConfig(location.pathname);

  // 디버깅용 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Layout Debug:", {
      pathname: location.pathname,
      layoutConfig,
      showSearch: layoutConfig.showSearch,
      showUserActions: layoutConfig.showUserActions,
      showNavigation: layoutConfig.showNavigation,
    });
  }

  const finalFooterVariant = layoutConfig.footer;

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

  const isHomePage = location.pathname === "/";

  // OnBoarding 텍스트 애니메이션을 위한 스크롤 이벤트 핸들러
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const videoSectionHeight = 800; // VideoSection 높이
      const animationStart = videoSectionHeight - 200; // OnBoarding 섹션 도달 200px 전부터 시작
      const animationDuration = 400; // 애니메이션 지속 시간 (px)
      const animationEnd = animationStart + animationDuration;

      if (scrollY < animationStart) {
        // 애니메이션 시작 전
        setOnboardingTextStyle("opacity-0 translate-y-8");
      } else if (scrollY >= animationStart && scrollY <= animationEnd) {
        // 애니메이션 진행 중
        const progress = (scrollY - animationStart) / animationDuration;
        const opacity = Math.min(progress, 1);
        const translateY = 8 - progress * 8; // 8px에서 0px로
        setOnboardingTextStyle(
          `opacity-${Math.round(opacity * 100)} translate-y-${Math.round(
            translateY
          )}`
        );
      } else {
        // 애니메이션 완료
        setOnboardingTextStyle("opacity-100 translate-y-0");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 상태 설정

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const handleVolumeChange = (volume: number) => {
    audioRef.current?.setVolume(volume);
  };

  return (
    <div>
      {isHomePage && (
        <>
          <Audio ref={audioRef} />
          <VideoSection onVolumeChange={handleVolumeChange} />
          <OnBoarding textStyle={onboardingTextStyle} />
          <MorphLogo />
        </>
      )}
      <Header
        showSearch={layoutConfig.showSearch}
        showUserActions={layoutConfig.showUserActions}
        showNavigation={layoutConfig.showNavigation}
      />
      <main className="mb-50">{children}</main>
      <Footer variant={finalFooterVariant} totalPrice={totalPrice} />
    </div>
  );
};

export default Layout;
