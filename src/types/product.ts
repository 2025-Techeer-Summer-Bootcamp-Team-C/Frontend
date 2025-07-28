// 기본 상품 정보 (목록용)
export interface Product {
  product_id: number;
  name: string;
  price: number;
  image: string;
  content: string;
  fittingImage?: string | null; // 피팅 이미지 URL (선택적)
}

// 상품 상세 정보
export interface ProductDetail {
  product_id: number;
  category_id: number;
  name: string;
  content: string;
  price: number;
  count: number;
  model_image: string;
  product_images: string[];
}

// API 응답 타입
export interface ProductListResponse {
  products: Product[];
}

export type Category = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};


export interface CategoryResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    products: Product[];
  }
}
