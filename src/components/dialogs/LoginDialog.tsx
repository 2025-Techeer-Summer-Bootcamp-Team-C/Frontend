import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaApple,
  FaGooglePlay,
  FaYoutube,
} from "react-icons/fa";

interface LoginDialogProps {
  children: React.ReactNode;
}

const LoginDialog = ({ children }: LoginDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[480px] max-w-[480px] h-[600px] bg-white shadow-[8px_8px_50px_rgba(0,0,0,0.15)] p-0">
        <div className="flex flex-col h-full p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="font-inter font-bold text-[40px] leading-[40px] text-black">
              Login
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 flex-1">
            {/* Email Input */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Email or mobile phone number"
                className="h-[50px] w-full bg-white/30 border border-[#5C5C5C]/30 shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px]"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                className="h-[50px] w-full bg-white/30 border border-[#5C5C5C]/30 shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px]"
              />
            </div>

            {/* Login Button */}
            <Button className="h-[48px] w-full bg-[#333333] hover:bg-[#444444] text-white font-inter font-bold text-[16px] leading-[20px] uppercase mt-4">
              Login
            </Button>

            {/* Privacy Notice */}
            <p className="font-inter text-[14px] leading-[22px] text-[#5C5C5C] mt-2">
              By continuing, you agree to FITIN Conditions of Use and Privacy
              Notice.
            </p>

            {/* Divider */}
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col gap-2">
                <span className="font-inter font-semibold text-[14px] leading-[22px] text-black">
                  New to FITIN?
                </span>
                <Button
                  variant="outline"
                  className="h-[48px] w-full bg-white border border-[#5C5C5C]/50 hover:bg-gray-50 text-[#5C5C5C] font-inter text-[14px] leading-[20px]"
                >
                  Create your FITIN account
                </Button>
              </div>
            </div>
          </div>

          {/* Social Media Icons - Positioned at bottom */}
          <div className="flex justify-center items-center gap-4 mt-auto pt-8 opacity-40">
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
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
