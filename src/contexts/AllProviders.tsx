import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./CartContext";
import { FilterProvider } from "./FilterContext";
import { OrderProvider } from "./OrderContext";
import { FittingProvider } from "./FittingContext";

// QueryClient를 컴포넌트 외부에서 생성하여 재생성 방지
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000,   // 10분 (cacheTime 대신 gcTime 사용)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AllProvidersProps {
  children: ReactNode;
}

const AllProviders = ({ children }: AllProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <FittingProvider>
          <CartProvider>
            <OrderProvider>
              {children}
            </OrderProvider>
          </CartProvider>
        </FittingProvider>
      </FilterProvider>
    </QueryClientProvider>
  );
};

export default AllProviders;