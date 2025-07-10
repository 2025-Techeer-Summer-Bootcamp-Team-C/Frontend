import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-inter font-bold text-[40px] leading-[40px] text-black mb-8">
        Login
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email Input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email or mobile phone number"
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C]/30 shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C]/30 shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Login Button */}
          <Button 
            type="submit" 
            className="h-[48px] w-full bg-[#333333] hover:bg-[#444444] text-white font-inter font-bold text-[16px] leading-[20px] uppercase mt-4"
          >
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
                type="button"
                variant="outline"
                onClick={onSwitchToRegister}
                className="h-[48px] w-full bg-white border border-[#5C5C5C]/50 hover:bg-gray-50 text-[#5C5C5C] font-inter text-[14px] leading-[20px]"
              >
                Create your FITIN account
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;