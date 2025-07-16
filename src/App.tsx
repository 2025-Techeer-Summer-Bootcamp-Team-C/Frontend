import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Layout from "./components/common/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OrderInformation from "./pages/OrderInformation";
import OrderSummary from "./pages/OrderSummary";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/order" element={<OrderInformation />} />
          <Route path="/order-summary" element={<OrderSummary />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
