import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 전화번호를 포맷팅합니다. (00000000000 -> 000-0000-0000)
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return "-";
  
  // 숫자만 추출
  const numbers = phoneNumber.replace(/\D/g, "");
  
  // 11자리 숫자인 경우 (010-0000-0000 형식)
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  
  // 10자리 숫자인 경우 (02-000-0000 형식)
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  
  // 9자리 숫자인 경우 (02-000-000 형식)
  if (numbers.length === 9) {
    return numbers.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  
  // 형식에 맞지 않는 경우 원본 반환
  return phoneNumber;
}
