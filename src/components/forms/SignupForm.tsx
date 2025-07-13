import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpMutation } from "@/hooks/useAuth";
import { signUpSchema, type SignUpFormData } from "@/schemas/authSchema";
import { toast } from "sonner"; // 또는 사용하는 토스트 라이브러리
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      password2: "",
      email: "",
      user_gender: "M",
    },
    mode: "onChange", // 실시간 검증
  });

  // TanStack Query 뮤테이션 훅 사용
  const { mutate: signUp, isPending, error } = useSignUpMutation();

  const onSubmit = (values: SignUpFormData) => {
    // API 명세서에 password2가 포함되어 있으므로 전체 데이터 전송
    signUp(values, {
      onSuccess: () => {
        toast.success("회원가입이 완료되었습니다!");
        form.reset(); // 폼 초기화
        onSwitchToLogin(); // 로그인 폼으로 전환
      },
      onError: (error: any) => {
        // DRF 에러 처리
        if (error.response?.data) {
          const errorData = error.response.data;

          // 필드별 에러를 폼에 설정
          Object.entries(errorData).forEach(([field, messages]) => {
            if (field in values) {
              form.setError(field as keyof SignUpFormData, {
                message: Array.isArray(messages) ? messages[0] : messages,
              });
            }
          });

          // 일반 에러 메시지
          if (errorData.detail) {
            toast.error(errorData.detail);
          }
        } else {
          toast.error("회원가입 중 오류가 발생했습니다.");
        }
      },
    });
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-inter font-bold text-[40px] leading-[40px] text-black mb-8">
        Sign up
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Username Input */}
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
                    disabled={isPending}
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px] disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="Email"
                    disabled={isPending}
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px] disabled:opacity-50"
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
                    disabled={isPending}
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px] disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Confirm Input */}
          <FormField
            control={form.control}
            name="password2"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm Password"
                    disabled={isPending}
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px] disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender Select - Select 컴포넌트로 개선 */}
          <FormField
            control={form.control}
            name="user_gender"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black px-[21px] disabled:opacity-50">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sign up Button */}
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            className="h-[48px] w-full bg-[#333333] hover:bg-[#444444] text-white font-inter font-bold text-[16px] leading-[20px] uppercase mt-4 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                SIGNING UP...
              </>
            ) : (
              "SIGN UP"
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

          {/* Already have account */}
          <button
            type="button"
            onClick={onSwitchToLogin}
            disabled={isPending}
            className="font-inter text-[14px] leading-[20px] text-[#5C5C5C] mt-4 hover:text-black transition-colors cursor-pointer disabled:opacity-50"
          >
            Already have an account? Sign in
          </button>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
