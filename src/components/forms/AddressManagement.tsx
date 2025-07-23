import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const addressSchema = z.object({
  name: z.string().min(1, { message: "주소 이름을 입력해주세요." }),
  recipient: z.string().min(1, { message: "받는 사람 이름을 입력해주세요." }),
  zipcode: z.string().min(5, { message: "우편번호를 입력해주세요." }),
  address1: z.string().min(1, { message: "기본 주소를 입력해주세요." }),
  address2: z.string().optional(),
  phone: z.string().regex(/^\d{10,11}$/, {
    message: "전화번호는 숫자로만 이루어져야 합니다.",
  }),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address extends AddressFormData {
  id: string;
}

interface AddressManagementProps {
  onClose: () => void;
  onAddressUpdate?: ((addresses: Address[]) => void) | null;
  initialAddresses?: Address[];
}

const AddressManagement = ({
  onClose,
  onAddressUpdate,
  initialAddresses = [],
}: AddressManagementProps) => {
  const [addresses, setAddressesState] = useState<Address[]>(initialAddresses);

  // addresses 업데이트 시 콜백도 함께 호출
  const setAddresses = (newAddresses: Address[]) => {
    setAddressesState(newAddresses);
    if (onAddressUpdate) {
      onAddressUpdate(newAddresses);
    }
  };
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      name: "",
      recipient: "",
      zipcode: "",
      address1: "",
      address2: "",
      phone: "",
      isDefault: addresses.length === 0,
    },
  });

  const resetForm = (address?: Address) => {
    if (address) {
      form.reset({
        name: address.name,
        recipient: address.recipient,
        zipcode: address.zipcode,
        address1: address.address1,
        address2: address.address2,
        phone: address.phone,
        isDefault: address.isDefault,
      });
    } else {
      form.reset({
        name: "",
        recipient: "",
        zipcode: "",
        address1: "",
        address2: "",
        phone: "",
        isDefault: addresses.length === 0,
      });
    }
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setIsAdding(true);
    resetForm();
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsAdding(true);
    resetForm(address);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("이 주소를 삭제하시겠습니까?")) return;

    try {
      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== addressId
      );

      // 기본 주소를 삭제한 경우, 첫 번째 주소를 기본으로 설정
      const deletedAddress = addresses.find((addr) => addr.id === addressId);
      if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }

      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("주소 삭제 실패:", error);
      alert("주소 삭제에 실패했습니다.");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("기본 주소 설정 실패:", error);
      alert("기본 주소 설정에 실패했습니다.");
    }
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsSubmitting(true);

      let updatedAddresses = [...addresses];

      // 기본 주소로 설정하는 경우 다른 주소들의 기본 설정 해제
      if (data.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }

      if (editingAddress) {
        // 수정
        const index = updatedAddresses.findIndex(
          (addr) => addr.id === editingAddress.id
        );
        if (index !== -1) {
          updatedAddresses[index] = { ...data, id: editingAddress.id };
        }
      } else {
        // 추가
        const newAddress: Address = {
          ...data,
          id: Date.now().toString(),
        };
        updatedAddresses.push(newAddress);
      }

      setAddresses(updatedAddresses);
      setIsAdding(false);
      setEditingAddress(null);

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("주소 저장 실패:", error);
      alert("주소 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingAddress(null);
    form.reset();
  };

  if (isAdding) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editingAddress ? "주소 수정" : "새 주소 추가"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주소 이름</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="집, 회사 등" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>받는 사람</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>우편번호</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
              </div>

              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>기본 주소</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상세 주소 (선택)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>기본 배송지로 설정</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "저장 중..."
                    : editingAddress
                    ? "수정"
                    : "추가"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>배송지 관리</CardTitle>
          <Button onClick={handleAdd} size="sm">
            새 주소 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            등록된 주소가 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address, index) => (
              <div key={address.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{address.name}</span>
                      {address.isDefault && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded">
                          기본 배송지
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      {address.recipient}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {address.address1} {address.address2}
                    </p>
                    <p className="text-xs text-gray-500">
                      {address.zipcode} | {address.phone}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                    >
                      삭제
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        기본 설정
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t text-right">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressManagement;
