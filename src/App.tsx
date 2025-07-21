import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Layout from "./components/common/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OrderInformation from "./pages/OrderInformation";
import OrderSummary from "./pages/OrderSummary";
import OrderHistory from "./pages/OrderHistory";
import Cart from "./pages/Cart";
import { CartProvider } from "./contexts/CartContext";
import { FilterProvider } from "./contexts/FilterContext";
import { OrderProvider } from "./contexts/OrderContext";
import { FittingProvider } from "./contexts/FittingContext";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <FilterProvider>
        <FittingProvider>
          <CartProvider>
            <OrderProvider>
              <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<Detail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<OrderInformation />} />
                <Route path="/summary" element={<OrderSummary />} />
                <Route path="/history" element={<OrderHistory />} />
              </Routes>
              </Layout>
            </OrderProvider>
          </CartProvider>
        </FittingProvider>
      </FilterProvider>
    </QueryClientProvider>
  );
}

export default App;
