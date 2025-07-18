import axiosInstance from "./axiosInstance";
import type {
  ProductDetail,
  ProductListResponse,
  CategoryResponse,
} from "../types/product";

// 상품 목록 조회
export const fetchProducts = async (showFitting?: boolean): Promise<ProductListResponse> => {
  const params = showFitting !== undefined ? { show_fitting: showFitting } : {};
  const response = await axiosInstance.get<ProductListResponse>(
    "api/v1/products/", 
    { params }
  );
  return response.data;
};

// 상품 상세 조회
export const fetchProductDetail = async (
  productId: number, 
  showFitting?: boolean
): Promise<ProductDetail> => {
  const params = showFitting !== undefined ? { show_fitting: showFitting } : {};
  const response = await axiosInstance.get<ProductDetail>(
    `api/v1/products/${productId}`, 
    { params }
  );
  return response.data;
};

// 카테고리별 상품 조회
export const fetchCategories = async (): Promise<CategoryResponse> => {
  const response = await axiosInstance.get<CategoryResponse>("api/v1/categories/");
  return response.data;
};