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

    profile_image: z
      .any()
      .optional()
      .refine(
        (files) => !files || files?.length === 0 || files?.[0]?.size <= 5000000,
        "파일 크기는 5MB 이하여야 합니다"
      )
      .refine(
        (files) => !files || files?.length === 0 || ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"].includes(files?.[0]?.type),
        "jpg, jpeg, png, webp, gif 파일만 업로드 가능합니다"
      ),
  })
  .refine((data) => data.password === data.password2, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["password2"], // 에러를 password2 필드에 표시
  });

export const loginSchema = z.object({
  username: z.string().min(1, "사용자 이름은 필수입니다"),
  password: z.string().min(1, "비밀번호는 필수입니다"),
});

// 타입 추출
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
