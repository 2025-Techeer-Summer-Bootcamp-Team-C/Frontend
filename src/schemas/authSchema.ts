import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, "사용자 이름은 필수입니다")
      .min(3, "사용자 이름은 최소 3자 이상이어야 합니다")
      .max(20, "사용자 이름은 최대 20자까지 가능합니다")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "사용자 이름은 영문, 숫자, 언더스코어만 사용할 수 있습니다"
      ),

    email: z
      .string()
      .min(1, "이메일은 필수입니다")
      .email("올바른 이메일 형식이 아닙니다"),

    password: z
      .string()
      .min(1, "비밀번호는 필수입니다")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "비밀번호는 영문, 숫자를 각각 하나 이상 포함해야 합니다"
      ),

    password2: z.string().min(1, "비밀번호 확인은 필수입니다"),

    user_gender: z.enum(["M", "F"]),
  })
  .refine((data) => data.password === data.password2, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["password2"], // 에러를 password2 필드에 표시
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// 타입 추출
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
