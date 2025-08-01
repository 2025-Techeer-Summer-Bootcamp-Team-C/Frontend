import { Routes, Route } from "react-router-dom";
import "./App.css";
import AllProviders from "./contexts/AllProviders";
import { Analytics } from "@vercel/analytics/react";
import { lazy, useEffect, Suspense } from "react";

// pages lazy load
const Home = lazy(() => import("./pages/Home"));
const Detail = lazy(() => import("./pages/Detail"));
const Layout = lazy(() => import("./components/common/Layout"));
const OrderInformation = lazy(() => import("./pages/OrderInformation"));
const OrderSummary = lazy(() => import("./pages/OrderSummary"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const Cart = lazy(() => import("./pages/Cart"));
const MyPage = lazy(() => import("./pages/MyPage"));
const LastPang = lazy(() => import("./pages/LastPang"));
function App() {
  // 컴포넌트 마운트 시 스크롤을 맨 위로 이동 및 HTML 로딩 스피너 숨기기
  useEffect(() => {
    window.scrollTo(0, 0);

    // React 앱이 로드되면 HTML 로딩 스피너 숨기기
    document.body.classList.add("app-loaded");
  }, []);

  return (
    <AllProviders>
      <Analytics />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-b-2 border-gray-900">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
      >
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Detail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<OrderInformation />} />
            <Route path="/summary" element={<OrderSummary />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/lastpang" element={<LastPang />} />
          </Routes>
        </Layout>
      </Suspense>
    </AllProviders>
  );
}

export default App;
