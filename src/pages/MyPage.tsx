import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense, useCallback } from "react";
import { useLogoutMutation } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Lazy load sections
const RecentOrders = lazy(() => import("@/components/sections/RecentOrders"));
const UserGreeting = lazy(() => import("@/components/sections/UserGreeting"));
const ProfileSection = lazy(
  () => import("@/components/sections/ProfileSection")
);

const MyPage = () => {
  const { mutate: logoutMutation } = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logoutMutation();
    navigate("/");
  }, [logoutMutation]);

  return (
    <div className="mx-[112px] pt-[226px]">
      <Suspense
        fallback={
          <div className="h-20 animate-pulse bg-gray-100 rounded"></div>
        }
      >
        <UserGreeting />
      </Suspense>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="orders">최근 주문</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse bg-gray-100 rounded"></div>
            }
          >
            <ProfileSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse bg-gray-100 rounded"></div>
            }
          >
            <RecentOrders />
          </Suspense>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end items-center mt-10">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
