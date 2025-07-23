import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentOrders from "@/components/sections/RecentOrders";
import UserGreeting from "@/components/sections/UserGreeting";
import ProfileSection from "@/components/sections/ProfileSection";
import { ModalProvider } from "@/contexts/ModalContext";

const MyPage = () => {
  return (
    <ModalProvider>
      <div className="mx-[112px] pt-[226px]">
        <UserGreeting />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="orders">최근 주문</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <RecentOrders />
          </TabsContent>
        </Tabs>
      </div>
    </ModalProvider>
  );
};

export default MyPage;
