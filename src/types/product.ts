export interface Product {
  product_id: number; // 상품 아이디
  category_id: number; // 카테고리 아이디
  name: string; // 상품명
  content: string; // 상세 설명
  price: number; // 가격
  count: number; // 재고
  created_at: string; // 생성일시 (ISO 문자열)
  updated_at?: string | null; // 수정일시 (nullable, ISO 문자열)
  is_deleted?: boolean | null; // 삭제여부 (nullable)
}
