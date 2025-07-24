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

function App() {
  // 컴포넌트 마운트 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AllProviders>
      <Analytics />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Detail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<OrderInformation />} />
            <Route path="/summary" element={<OrderSummary />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </Layout>
      </Suspense>
    </AllProviders>
  );
}

export default App;
