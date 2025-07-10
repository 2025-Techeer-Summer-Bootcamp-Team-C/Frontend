import { Download, Heart, User } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <header className="w-full h-[134px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.08)]">
      {/* Top bar */}
      <div className="flex justify-between items-center w-full h-[46px] bg-[#F1F1F1] px-20">
        <div className="font-inter font-medium text-[15px] leading-[18px] text-black">
          2025 Techeer Summer Boot camp | Team : C
        </div>
        <Button
          variant="ghost"
          className="h-[18px] p-0 font-inter font-medium text-[15px] leading-[18px] text-black hover:text-gray-700 hover:bg-transparent"
        >
          <Download size={16} className="mr-1" />
          Download App
        </Button>
      </div>
      <div className="flex justify-between items-center w-full h-[88px] px-20">
        {/* Navigation */}
        <div className="flex items-center h-[88px]">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-[90px]">
              <NavigationMenuItem>
                <NavigationMenuLink className="font-inter font-bold text-2xl leading-6 text-[#333333] hover:bg-transparent cursor-pointer">
                  Logo
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="font-inter font-medium text-xl leading-6 text-[#333333] hover:bg-transparent cursor-pointer">
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="font-inter font-medium text-xl leading-6 text-[#333333] hover:bg-transparent cursor-pointer">
                  Service
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="font-inter font-medium text-xl leading-6 text-[#333333] hover:bg-transparent cursor-pointer">
                  Team
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Start Button bar */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="h-[40px] w-[120px] border-black rounded-4xl active:bg-black active:text-white"
          >
            GET START
          </Button>
          <Button
            variant="outline"
            className="h-[40px] w-[40px] p-0 border-none shadow-none group hover:bg-transparent"
          >
            <Heart size={20} className="group-active:hidden" />
            <FaHeart
              size={20}
              className="hidden group-active:block text-red-500"
            />
          </Button>
          <Avatar className="h-[40px] w-[40px]">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
