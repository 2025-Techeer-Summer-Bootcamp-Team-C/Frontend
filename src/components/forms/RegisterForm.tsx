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

const registerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-inter font-bold text-[40px] leading-[40px] text-black mb-8">
        Sign up
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Name Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Your name"
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mobile Number Input */}
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Mobile number"
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px]"
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
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px]"
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
                    className="h-[50px] w-full bg-white/30 border border-[#5C5C5C] shadow-[4px_4px_13px_rgba(242,113,144,0.15)] font-inter text-[14px] text-black placeholder:text-[#5C5C5C] px-[21px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sign up Button */}
          <Button 
            type="submit" 
            className="h-[48px] w-full bg-[#333333] hover:bg-[#444444] text-white font-inter font-bold text-[16px] leading-[20px] uppercase mt-4"
          >
            SIGN UP
          </Button>

          {/* Already have account */}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-inter text-[14px] leading-[20px] text-[#5C5C5C] mt-4 hover:text-black transition-colors cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;