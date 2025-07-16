import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UnderlineInput } from "@/components/ui/UnderlineInput";
import { Button } from "@/components/ui/button";

// 2단 레이아웃에 맞춰 'region' 필드를 다시 추가합니다.
const orderInformationSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  postalCode: z.string().min(1, "우편번호를 입력해주세요"),
  address: z.string().min(1, "주소를 입력해주세요"),
  address2: z.string().optional(),
  region: z.string().min(1, "지역을 입력해주세요"),
  regionCode: z.string().min(1, "지역 번호를 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
});

type OrderInformationFormData = z.infer<typeof orderInformationSchema>;

function OrderInformationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderInformationFormData>({
    resolver: zodResolver(orderInformationSchema),
    // 이미지에 보이는 값으로 기본값을 설정합니다.
    defaultValues: {
      name: "제승현",
      postalCode: "",
      address: "",
      address2: "",
      region: "대한민국",
      regionCode: "+82",
      phone: "",
    },
  });

  const onSubmit = (data: OrderInformationFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8">
        {/* ----- 1번째 행: 이름 ----- */}
        <div className="flex">
          <UnderlineInput
            label="이름"
            {...register("name")}
            error={!!errors.name}
            className="w-full max-w-md"
          />
        </div>

        {/* ----- 2번째 행: 우편번호 / 주소 ----- */}
        <div className="flex items-end gap-6">
          {/* 1열 */}
          <div className="flex items-end gap-3 w-full max-w-md">
            <UnderlineInput
              label="우편번호"
              {...register("postalCode")}
              error={!!errors.postalCode}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="px-4 py-2 text-sm shrink-0 h-auto"
            >
              우편번호 찾기
            </Button>
          </div>
          {/* 2열 */}
          <UnderlineInput
            label="주소"
            {...register("address")}
            error={!!errors.address}
            className="w-full max-w-md"
          />
        </div>

        {/* ----- 3번째 행: 주소 2 / 지역 ----- */}
        <div className="flex items-end gap-6">
          {/* 1열 */}
          <UnderlineInput
            label="주소 2 (선택 사항)"
            {...register("address2")}
            className="w-full max-w-md"
          />
          {/* 2열 */}
          <UnderlineInput
            label="지역"
            {...register("region")}
            error={!!errors.region}
            className="w-full max-w-md"
          />
        </div>

        {/* ----- 4번째 행: 지역 번호 / 전화 ----- */}
        <div className="flex items-end gap-6 w-[436px]">
          {/* 1열 */}
          <UnderlineInput
            label="지역 번호"
            {...register("regionCode")}
            error={!!errors.regionCode}
            className="w-20 max-w-md"
          />
          {/* 2열 */}
          <UnderlineInput
            label="전화"
            {...register("phone")}
            error={!!errors.phone}
            className="w-full max-w-md"
          />
        </div>
      </div>
    </form>
  );
}

export { OrderInformationForm };
