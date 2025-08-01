import Header from "./Header";
import Footer from "./Footer";
import React, {
  useEffect,
  lazy,
  Suspense,
  useState,
  useCallback,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { getLayoutConfig } from "@/config/layoutConfig";

const VideoSection = lazy(() => import("@/components/sections/VideoSection"));
const OnBoarding = lazy(() => import("@/components/sections/OnBoarding"));
const MorphLogo = lazy(() => import("@/components/sections/MorphLogo"));

interface LayoutProps {
  children: React.ReactNode;
  totalPrice?: number;
}

const Layout = ({ children, totalPrice: propTotalPrice }: LayoutProps) => {
  const location = useLocation();
  const { totalPrice: cartTotalPrice, directPurchaseProduct } = useCart();
  const { getLatestOrder } = useOrder();
  const [onboardingScale, setOnboardingScale] = useState(1);
  const [onboardingTranslateY, setOnboardingTranslateY] = useState(100);
  const [onboardingOpacity, setOnboardingOpacity] = useState(1);
  const rafRef = useRef<number>(0);

  const layoutConfig = getLayoutConfig(location.pathname);

  // // 디버깅용 로그 (개발 환경에서만)
  // if (process.env.NODE_ENV === "development") {
  //   console.log("🔍 Layout Debug:", {
  //     pathname: location.pathname,
  //     layoutConfig,
  //     showSearch: layoutConfig.showSearch,
  //     showUserActions: layoutConfig.showUserActions,
  //     showCategoryMenu: layoutConfig.showCategoryMenu,
  //   });
  // }

  const finalFooterVariant = layoutConfig.footer;

  // totalPrice 우선순위: prop으로 전달된 값 > 경로별 로직
  const getTotalPrice = () => {
    if (propTotalPrice) return propTotalPrice;

    // 장바구니 페이지에서는 항상 장바구니 총액 사용
    if (location.pathname.includes("/cart")) {
      return cartTotalPrice;
    }

    // 주문 관련 페이지에서는 우선순위: 최신 주문 > 직접 구매 상품 > 장바구니 총액
    if (
      location.pathname.includes("/order") ||
      location.pathname.includes("/summary")
    ) {
      const latestOrder = getLatestOrder();

      // 1. 최신 주문이 있으면 주문 총액 사용 (API 응답 데이터 - 가장 신뢰할 수 있는 데이터)
      if (latestOrder) {
        return latestOrder.totalPrice;
      }

      // 2. 직접 구매 상품이 있으면 그 가격 × 수량
      if (directPurchaseProduct) {
        return directPurchaseProduct.price * directPurchaseProduct.quantity;
      }

      // 3. 장바구니에서 온 경우를 위한 fallback (하지만 최신 주문이 우선)
      return cartTotalPrice;
    }

    return cartTotalPrice;
  };

  const totalPrice = getTotalPrice();

  const isHomePage = location.pathname === "/";

  // Easing 함수
  const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

  // 온보딩 섹션 애니메이션 핸들러
  const handleOnboardingScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // 애니메이션 구간 정의
      const videoSectionHeight = 800;
      const onboardingHeight = 1000;
      const onboardingTopMargin = 100; // pt-[100px]

      // 온보딩 섹션의 실제 시작점과 끝점 (마진 고려)
      const onboardingStart = videoSectionHeight + onboardingTopMargin; // 900px
      const onboardingEnd = videoSectionHeight + onboardingHeight; // 1800px

      // 1. 입장 애니메이션: VideoSection 후반부에서 온보딩이 밑에서 올라옴
      const entranceStart = 100; // 600px (VideoSection 후반)
      const entranceEnd = onboardingStart; // 900px (온보딩 시작)

      // 2. 퇴장 애니메이션: 온보딩 끝 200px 전부터 축소
      const exitStart = onboardingEnd - 300; // 1500px
      const exitEnd = onboardingEnd; // 1800px

      if (scrollY >= entranceStart && scrollY <= entranceEnd) {
        // 입장 애니메이션: 600px~900px 구간에서 밑에서 위로 올라옴
        const progress =
          (scrollY - entranceStart) / (entranceEnd - entranceStart);
        const easedProgress = easeOut(progress);
        setOnboardingTranslateY(150 - easedProgress * 150); // 100px → 0px
        setOnboardingOpacity(0 + easedProgress * 1);
        setOnboardingScale(1); // 스케일은 정상 유지
      } else if (scrollY > entranceEnd && scrollY < exitStart) {
        // 정상 상태: 900px~1600px 구간에서 원래 위치 유지
        setOnboardingTranslateY(0);
        setOnboardingScale(1);
        setOnboardingOpacity(1);
      } else if (scrollY >= exitStart && scrollY <= exitEnd) {
        // 퇴장 애니메이션: 1600px~1800px 구간에서 축소 + 흐려짐
        const progress = (scrollY - exitStart) / (exitEnd - exitStart);
        const easedProgress = easeOut(progress);
        setOnboardingTranslateY(0); // 위치는 고정
        setOnboardingScale(1 - easedProgress * 0.3); // 1.0 → 0.7
        setOnboardingOpacity(1 - easedProgress); // 1.0 → 0.0 (완전히 투명)
      } else if (scrollY > exitEnd) {
        // 완전히 사라진 상태
        setOnboardingTranslateY(0);
        setOnboardingScale(0.7);
        setOnboardingOpacity(0);
      } else {
        // 초기 상태 (스크롤 600px 이전) - 온보딩 숨김
        setOnboardingTranslateY(150);
        setOnboardingScale(1);
        setOnboardingOpacity(0);
      }
    });
  }, []);

  // 홈페이지에서만 스크롤 리스너 등록
  useEffect(() => {
    if (isHomePage) {
      window.addEventListener("scroll", handleOnboardingScroll, {
        passive: true,
      });
      handleOnboardingScroll(); // 초기 상태 설정

      return () => {
        window.removeEventListener("scroll", handleOnboardingScroll);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [isHomePage, handleOnboardingScroll]);

  // 페이지 네비게이션 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {isHomePage && (
          <div className="relative z-[60]">
            <VideoSection />
            {/* 온보딩 섹션 공간을 항상 확보하는 래퍼 */}
            <div className="relative h-[1000px] bg-white">
              <OnBoarding
                scale={onboardingScale}
                translateY={onboardingTranslateY}
                opacity={onboardingOpacity}
              />
            </div>
            <MorphLogo />
          </div>
        )}
        {layoutConfig.header !== "none" && (
          <Header
            showSearch={layoutConfig.showSearch}
            showUserActions={layoutConfig.showUserActions}
            showCategoryMenu={layoutConfig.showCategoryMenu}
          />
        )}
        <main className="mb-100">{children}</main>
        {layoutConfig.footer !== "none" && (
          <Footer variant={finalFooterVariant} totalPrice={totalPrice} />
        )}
      </div>
    </Suspense>
  );
};

export default Layout;
