import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";


import LoginForm from "../forms/LoginForm";
import SignupForm from "../forms/SignupForm";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface LoginDialogProps {
  children: React.ReactNode;
}

type FormType = "login" | "register";

const LoginDialog = ({ children }: LoginDialogProps) => {
  const [currentForm, setCurrentForm] = useState<FormType>("login");
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchToRegister = () => {
    setCurrentForm("register");
  };

  const handleSwitchToLogin = () => {
    setCurrentForm("login");
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setCurrentForm("login");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[480px] max-w-[480px] max-h-[80vh] bg-white shadow-[8px_8px_50px_rgba(0,0,0,0.15)] pb-8 overflow-hidden z-[70]">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <div className="h-full">
          {/* Scrollable Form Area */}
          <ScrollArea className="max-h-[calc(80vh-120px)] overflow-y-auto px-8 pt-8">
            <div className="space-y-6">
              {/* Conditional Form Rendering */}
              {currentForm === "login" ? (
                <LoginForm onSwitchToRegister={handleSwitchToRegister} onClose={handleClose} />
              ) : (
                <SignupForm onSwitchToLogin={handleSwitchToLogin} />
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
