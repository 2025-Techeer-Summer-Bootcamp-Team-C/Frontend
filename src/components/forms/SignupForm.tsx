import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { FileUpload } from "@/components/ui/file-upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpMutation } from "@/hooks/useAuth";
import { signUpSchema, type SignUpFormData } from "@/schemas/authSchema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
      profile_image: undefined,
    },
    mode: "onChange", // 실시간 검증
  });

  // TanStack Query 뮤테이션 훅 사용
  const { mutate: signUp, isPending } = useSignUpMutation();

  const onSubmit = async (values: SignUpFormData) => {
    try {
      const submitData = {
        username: values.username,
        password: values.password,
        password2: values.password2,
        email: values.email,
        profile_image: values.profile_image && values.profile_image.length > 0 ? values.profile_image[0] : null,
      };

      signUp(submitData, {
        onSuccess: (data) => {
          toast.success(data.message || "회원가입이 완료되었습니다!");
          form.reset();
          onSwitchToLogin();
        },
        onError: (error: any) => {
          if (error.response?.data) {
            const errorData = error.response.data;

            Object.entries(errorData).forEach(([field, messages]) => {
              if (field in values) {
                form.setError(field as keyof SignUpFormData, {
                  message: Array.isArray(messages) ? messages[0] : messages,
                });
              }
            });

            if (errorData.detail) {
              toast.error(errorData.detail);
            }
          } else {
            toast.error("회원가입 중 오류가 발생했습니다.");
          }
        },
      });
    } catch (error) {
      toast.error("회원가입 처리 중 오류가 발생했습니다.");
    }
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

          {/* Profile Image Upload */}
          <FormField
            control={form.control}
            name="profile_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-inter text-[14px] font-medium">
                  Profile Image (선택사항)
                </FormLabel>
                <FormControl>
                  <div className="bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] rounded-md">
                    <FileUpload
                      onChange={(files) => {
                        field.onChange(files);
                      }}
                      disabled={isPending}
                    />
                  </div>
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
