import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
  username: z
    .string()
    .min(3, { message: "사용자명은 3글자 이상이어야 합니다." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "사용자명은 영문, 숫자, 밑줄(_)만 사용 가능합니다.",
    }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  phone: z.string().regex(/^\d{10,11}$/, {
    message: "전화번호는 숫자로만 이루어져야 합니다.",
  }),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  initialData?: {
    name: string;
    username: string;
    email: string;
    phone: string;
  };
  onClose: () => void;
  onSubmit?: (data: PersonalInfoFormData) => Promise<void>;
}

const PersonalInfoForm = ({
  initialData = { name: "", username: "", email: "", phone: "" },
  onClose,
  onSubmit,
}: PersonalInfoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: initialData.name,
      username: initialData.username,
      email: initialData.email,
      phone: initialData.phone,
    },
  });

  const handleSubmit = async (data: PersonalInfoFormData) => {
    try {
      setIsSubmitting(true);

      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Mock 업데이트 - 실제로는 auth context나 API 호출
        console.log("개인정보 업데이트:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      }

      onClose();
    } catch (error) {
      console.error("개인정보 업데이트 실패:", error);
      // 실제로는 toast나 alert로 에러 표시
      alert("개인정보 업데이트에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>개인정보 수정</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="이름을 입력해주세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사용자명</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="사용자명을 입력해주세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="이메일을 입력해주세요"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="010-0000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
