import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModalProvider } from "@/contexts/ModalContext";
import { lazy, Suspense } from "react";

// Lazy load sections
const RecentOrders = lazy(() => import("@/components/sections/RecentOrders"));
const UserGreeting = lazy(() => import("@/components/sections/UserGreeting"));
const ProfileSection = lazy(() => import("@/components/sections/ProfileSection"));

const MyPage = () => {
  return (
    <ModalProvider>
      <div className="mx-[112px] pt-[226px]">
        <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded"></div>}>
          <UserGreeting />
        </Suspense>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="orders">최근 주문</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 rounded"></div>}>
              <ProfileSection />
            </Suspense>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded"></div>}>
              <RecentOrders />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </ModalProvider>
  );
};

export default MyPage;
