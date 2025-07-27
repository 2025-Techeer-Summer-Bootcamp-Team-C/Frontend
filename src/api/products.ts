import axiosInstance from "./axiosInstance";
import type {
  ProductDetail,
  ProductListResponse,
  CategoryResponse,
} from "../types/product";

// 상품 목록 조회
export const fetchProducts = async (): Promise<ProductListResponse> => {
  const response = await axiosInstance.get<ProductListResponse>(
    "api/v1/products/"
  );
  return response.data;
};

// 상품 상세 조회
export const fetchProductDetail = async (
  productId: number
): Promise<ProductDetail> => {
  const response = await axiosInstance.get<ProductDetail>(
    `api/v1/products/${productId}`
  );
  return response.data;
};

// 카테고리별 상품 조회
export const fetchCategoryProducts = async (categoryId: number): Promise<CategoryResponse> => {
  const response = await axiosInstance.get<CategoryResponse>(`api/v1/categories/${categoryId}`);
  return response.data;
};

export interface ProductFittingImageResponse {
  product_id: number;
  user_image_id: number;
  fitting_image: string;
}

export interface ProductFittingErrorResponse {
  error: string;
}

// 상품별 피팅 이미지 조회
export const fetchProductFittingImage = async (
  productId: number, 
  userImageId: number
): Promise<ProductFittingImageResponse> => {
  const response = await axiosInstance.get<ProductFittingImageResponse>(
    `api/v1/products/${productId}/images/${userImageId}`
  );
  return response.data;
};