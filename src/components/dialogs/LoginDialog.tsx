import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaApple,
  FaGooglePlay,
  FaYoutube,
} from "react-icons/fa";
import LoginForm from "../forms/LoginForm";
import RegisterForm from "../forms/RegisterForm";
import { useState } from "react";

interface LoginDialogProps {
  children: React.ReactNode;
}

type FormType = "login" | "register";

const LoginDialog = ({ children }: LoginDialogProps) => {
  const [currentForm, setCurrentForm] = useState<FormType>("login");

  const handleSwitchToRegister = () => {
    setCurrentForm("register");
  };

  const handleSwitchToLogin = () => {
    setCurrentForm("login");
  };
  return (
    <Dialog onOpenChange={(open) => {
      if (open) {
        setCurrentForm("login");
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[480px] max-w-[480px] max-h-[600px] bg-white shadow-[8px_8px_50px_rgba(0,0,0,0.15)] p-0 overflow-hidden">
        <div className="h-full">
          {/* Scrollable Form Area */}
          <div className="max-h-[90vh] overflow-y-auto px-8 pt-8">
            <div className="space-y-6">
              {/* Conditional Form Rendering */}
              {currentForm === "login" ? (
                <LoginForm onSwitchToRegister={handleSwitchToRegister} />
              ) : (
                <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
              )}

              {/* Social Media Icons - Fixed at bottom */}
              <div className="flex justify-center items-center gap-4 pb-8 pt-4 opacity-40">
                <FaFacebook
                  size={17}
                  className="text-[#282828] hover:opacity-70 cursor-pointer"
                />
                <div className="w-[1px] h-[17px] bg-[#282828]"></div>
                <FaLinkedin
                  size={17}
                  className="text-[#282828] hover:opacity-70 cursor-pointer"
                />
                <div className="w-[1px] h-[17px] bg-[#282828]"></div>
                <FaTwitter
                  size={17}
                  className="text-[#282828] hover:opacity-70 cursor-pointer"
                />
                <div className="w-[1px] h-[17px] bg-[#282828]"></div>
                <FaInstagram
                  size={17}
                  className="text-[#282828] hover:opacity-70 cursor-pointer"
                />
                <div className="w-[1px] h-[17px] bg-[#282828]"></div>
                <FaApple
                  size={17}
                  className="text-[#282828] hover:opacity-70 cursor-pointer"
                />
                <div className="w-[1px] h-[17px] bg-[#282828]"></div>
                <FaGooglePlay
                  size={17}
                  className="text-[#282828] hover:opacity-70 cursor-pointer"
                />
                <div className="w-[1px] h-[17px] bg-[#282828]"></div>
                <FaYoutube
                  size={17}
                  className="text-[#282828] hover:opacity-70 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
