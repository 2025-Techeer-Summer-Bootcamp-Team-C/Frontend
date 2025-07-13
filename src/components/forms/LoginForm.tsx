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
import { useLoginMutation } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/schemas/authSchema";
import { AxiosError } from "axios";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const { mutate: login, isPending, error } = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: LoginFormData) => {
    console.log(values);
    login(values, {
      onSuccess: () => {
        console.log("로그인 성공");
        toast.success("로그인 성공");
      },
      onError: (error: any) => {
        if (error.response?.data) {
          const errorData = error.response.data;
          if (errorData.detail) {
            toast.error(errorData.detail);
          }
        } else {
          toast.error("아이디 또는 비밀번호를 확인해주세요.");
        }
      },
    });
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-inter font-bold text-[40px] leading-[40px] text-black mb-8">
        Login
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Email Input */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Username"
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
            disabled={isPending || !form.formState.isValid}
            className="h-[48px] w-full bg-[#333333] hover:bg-[#444444] text-white font-inter font-bold text-[16px] leading-[20px] uppercase mt-4"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                LOGINING...
              </>
            ) : (
              "LOGIN"
            )}
          </Button>

          {/* Global Error Display */}
          {error &&
            (error as AxiosError<{ detail: string }>)?.response?.data
              ?.detail && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {
                  (error as AxiosError<{ detail: string }>)?.response?.data
                    ?.detail
                }
              </div>
            )}

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
