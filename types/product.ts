export interface Product {
  code: string;
  product_name: string;
  product_name_en?: string;
  image_url?: string;
  image_small_url?: string;
  categories?: string;
  categories_tags?: string[];
  ingredients_text?: string;
  ingredients_text_en?: string;
  nutriscore_grade?: string;
  nutriscore_score?: number;
  nutriments?: {
    energy_kcal_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
    proteins_100g?: number;
    fiber_100g?: number;
    salt_100g?: number;
    sugars_100g?: number;
  };
  labels?: string;
  labels_tags?: string[];
  brands?: string;
  quantity?: string;
  packaging?: string;
}

export interface ProductResponse {
  products: Product[];
  count: number;
  page: number;
  page_size: number;
  page_count: number;
}

export interface ProductDetailResponse {
  status: number;
  product: Product;
}

export interface Category {
  id: string;
  name: string;
  products: number;
}

export type SortOption = 'name-asc' | 'name-desc' | 'grade-asc' | 'grade-desc';
