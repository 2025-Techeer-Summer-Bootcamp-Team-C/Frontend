import { useOrder } from "@/contexts/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { memo, useMemo } from "react";

const RecentOrders = memo(() => {
  const { orderHistory } = useOrder();
  const navigate = useNavigate();

  // 최근 3개 주문만 메모이제이션
  const recentOrders = useMemo(() => {
    return orderHistory.slice(0, 3);
  }, [orderHistory]);

  if (recentOrders.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">최근 주문 내역</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">최근 주문 내역이 없습니다.</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-black text-white hover:bg-gray-800"
          >
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">최근 주문 내역</h2>
      </div>

      <div className="space-y-4">
        {recentOrders.map((order) => (
          <Card key={order.id} className="border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                주문번호: {order.orderNumber} |{" "}
                {new Date(order.orderDate).toLocaleDateString("ko-KR")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-1">
                    {order.products.length}개 상품
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.products
                      .slice(0, 2)
                      .map((item) => item.name)
                      .join(", ")}
                    {order.products.length > 2 &&
                      ` 외 ${order.products.length - 2}개`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {order.totalPrice.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.status === "completed" && "주문완료"}
                    {order.status === "shipping" && "배송중"}
                    {order.status === "delivered" && "배송완료"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

RecentOrders.displayName = "RecentOrders";

export default RecentOrders;
