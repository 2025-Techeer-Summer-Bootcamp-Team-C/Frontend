import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginDialog from "../dialogs/LoginDialog";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      {/* Top Banner */}
      <div className="flex justify-center items-center w-full bg-[#F1F1F1] h-[34.5px]">
        <div className="w-[1320px] h-[13.5px] flex justify-between items-center">
          <div className="w-[240px] h-[13.5px] flex items-center">
            <span className="text-[#000000] text-[11.25px] font-inter font-medium leading-[13.61px]">
              2025 Techeer Summer Boot camp | Team : C
            </span>
          </div>
          <div className="w-[78.75px] h-[13.5px] flex items-center">
            <span className="text-[#000000] text-[11.25px] font-inter font-medium leading-[13.61px]">
              Download App
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full h-[70px] flex items-center justify-center">
        <div className="w-[1309.5px] h-[36px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-[#000000] text-[25px] font-inter font-bold leading-[29.25px]">
              Logo
            </span>
          </div>

          {/* Right Section - Button, Heart and User */}
          <div className="flex items-center gap-[24px]">
            {/* GET START Button */}
            <Button
              variant="outline"
              className="group h-auto px-[30px] py-[10.5px] border-[#333333] border-[0.75px] rounded-[9px] bg-white hover:bg-[#333333] transition-colors"
            >
              <span className="text-[12px] font-inter font-bold leading-[15px] text-[#333333] group-hover:text-white transition-colors">
                GET START
              </span>
            </Button>

            <Heart className="w-[20px] h-[20px] text-[#333333] stroke-[1.5px] hover:fill-[#E74C3C] hover:text-[#E74C3C] transition-colors cursor-pointer" />

            <LoginDialog>
              <div className="w-[36px] h-[36px] bg-white rounded-[18px] p-[3px] flex items-center justify-center cursor-pointer">
                <div className="w-[30px] h-[30px] bg-[#D9D9D9] rounded-full opacity-80 flex items-center justify-center">
                  <User className="w-[11.78px] h-[15px] text-[#939393]" />
                </div>
              </div>
            </LoginDialog>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
