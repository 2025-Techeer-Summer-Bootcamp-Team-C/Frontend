import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./CartContext";
import { FilterProvider } from "./FilterContext";
import { OrderProvider } from "./OrderContext";
import { FittingProvider } from "./FittingContext";
import { ModalProvider } from "./ModalContext";

// QueryClient를 컴포넌트 외부에서 생성하여 재생성 방지
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분 - 데이터가 신선한 것으로 간주되는 시간
      gcTime: 10 * 60 * 1000,   // 10분 - 가비지 컬렉션 시간
      retry: (failureCount, error: any) => {
        // 4xx 에러는 재시도하지 않음
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2; // 최대 2번 재시도
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
      refetchOnReconnect: true,    // 네트워크 재연결 시 refetch
      refetchOnMount: 'always',    // 컴포넌트 마운트 시 refetch 설정
      refetchInterval: 5 * 60 * 1000, // 5분마다 백그라운드 refetch (중요한 데이터만)
      refetchIntervalInBackground: false, // 탭이 백그라운드일 때는 refetch 안함
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // 5xx 서버 에러만 재시도
        if (error?.status >= 500) return failureCount < 1;
        return false;
      },
      retryDelay: 1000,
    },
  },
});

interface AllProvidersProps {
  children: ReactNode;
}

const AllProviders = ({ children }: AllProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <FilterProvider>
          <FittingProvider>
            <CartProvider>
              <OrderProvider>
                {children}
              </OrderProvider>
            </CartProvider>
          </FittingProvider>
        </FilterProvider>
      </ModalProvider>
    </QueryClientProvider>
  );
};

export default AllProviders;