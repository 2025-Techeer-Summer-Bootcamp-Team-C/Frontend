import type { HeaderVariant, FooterVariant } from "@/types/variants";

// 경로별 Layout 설정 타입 정의
interface LayoutConfig {
  header: HeaderVariant;
  footer: FooterVariant;
  showSearch?: boolean;
  showUserActions?: boolean;
  showNavigation?: boolean;
  requiresAuth?: boolean;
  title?: string;
}

// 동적 경로 매칭을 위한 패턴 타입
interface RoutePattern {
  pattern: string | RegExp;
  config: LayoutConfig;
}

// 정적 경로 설정 (정확한 경로 매칭)
export const STATIC_LAYOUT_CONFIG: Record<string, LayoutConfig> = {
  "/": {
    header: "default",
    footer: "default",
    showSearch: true,
    showUserActions: true,
    showNavigation: true,
    title: "홈",
  },
  "/cart": {
    header: "cart",
    footer: "cart",
    showSearch: false,
    showUserActions: false,
    showNavigation: false,
    title: "장바구니",
  },
  "/order": {
    header: "order",
    footer: "order",
    showSearch: false,
    showUserActions: false,
    requiresAuth: true,
    showNavigation: false,
    title: "주문 정보",
  },
  "/summary": {
    header: "order",
    footer: "order",
    showSearch: false,
    showUserActions: false,
    requiresAuth: true,
    showNavigation: false,
    title: "주문 요약",
  },
  "/history": {
    header: "order",
    footer: "default",
    showSearch: false,
    showUserActions: false,
    requiresAuth: true,
    showNavigation: false,
    title: "주문 내역",
  },
} as const;

// 동적 경로 설정 (패턴 매칭)
export const DYNAMIC_LAYOUT_CONFIG: RoutePattern[] = [
  {
    pattern: /^\/product\/\d+$/, // /product/숫자
    config: {
      header: "detail",
      footer: "default",
      showSearch: true,
      showUserActions: true,
      showNavigation: false,
      title: "상품 상세",
    },
  },
] as const;

// 기본 Layout 설정
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  header: "default",
  footer: "default",
  showSearch: true,
  showUserActions: true,
  showNavigation: true,
  title: "Techeer Fashion",
} as const;

// Layout 설정을 가져오는 유틸리티 함수
export const getLayoutConfig = (pathname: string): LayoutConfig => {
  // pathname 정규화 (trailing slash 제거, query parameter 제거)
  const normalizedPathname = pathname.split("?")[0].replace(/\/$/, "") || "/";

  // 디버깅용 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 getLayoutConfig Debug:", {
      originalPathname: pathname,
      normalizedPathname,
      availableStaticRoutes: Object.keys(STATIC_LAYOUT_CONFIG),
    });
  }

  // 1. 정적 경로 우선 확인
  if (normalizedPathname in STATIC_LAYOUT_CONFIG) {
    const config = STATIC_LAYOUT_CONFIG[normalizedPathname];
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Found static config:", config);
    }
    return config;
  }

  // 2. 동적 경로 패턴 매칭
  for (const { pattern, config } of DYNAMIC_LAYOUT_CONFIG) {
    if (typeof pattern === "string") {
      if (normalizedPathname === pattern) {
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Found dynamic string config:", config);
        }
        return config;
      }
    } else {
      if (pattern.test(normalizedPathname)) {
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Found dynamic regex config:", config);
        }
        return config;
      }
    }
  }

  // 3. 기본 설정 반환
  if (process.env.NODE_ENV === "development") {
    console.log("⚠️ Using default config for:", normalizedPathname);
  }
  return DEFAULT_LAYOUT_CONFIG;
};

// 특정 경로가 인증이 필요한지 확인
export const requiresAuthentication = (pathname: string): boolean => {
  const config = getLayoutConfig(pathname);
  return config.requiresAuth ?? false;
};

// 특정 경로의 페이지 제목 가져오기
export const getPageTitle = (pathname: string): string => {
  const config = getLayoutConfig(pathname);
  return config.title ?? DEFAULT_LAYOUT_CONFIG.title!;
};

// 경로별 설정 검증 (개발 환경에서 사용)
export const validateLayoutConfig = (): void => {
  if (process.env.NODE_ENV !== "development") return;

  // 중복 패턴 검사
  const patterns = DYNAMIC_LAYOUT_CONFIG.map((item) => item.pattern.toString());
  const duplicates = patterns.filter(
    (item, index) => patterns.indexOf(item) !== index
  );

  if (duplicates.length > 0) {
    console.warn("중복된 라우트 패턴이 발견되었습니다:", duplicates);
  }

  // 필수 설정 검사
  const allConfigs = [
    ...Object.values(STATIC_LAYOUT_CONFIG),
    ...DYNAMIC_LAYOUT_CONFIG.map((item) => item.config),
    DEFAULT_LAYOUT_CONFIG,
  ];

  allConfigs.forEach((config, index) => {
    if (!config.header || !config.footer) {
      console.warn(
        `Layout 설정 ${index}에 필수 필드가 누락되었습니다:`,
        config
      );
    }
  });
};

// 타입 추출 (다른 파일에서 사용할 수 있도록)
export type LayoutConfigType = typeof STATIC_LAYOUT_CONFIG;
export type StaticRoutes = keyof LayoutConfigType;
