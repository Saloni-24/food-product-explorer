import { Product, ProductResponse, ProductDetailResponse } from '@/types/product';

const BASE_URL = 'https://world.openfoodfacts.org';

export async function searchProductsByName(
  searchTerm: string,
  page: number = 1,
  pageSize: number = 24
): Promise<ProductResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&page_size=${pageSize}&page=${page}&json=true`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return {
      products: data.products || [],
      count: data.count || 0,
      page: data.page || page,
      page_size: data.page_size || pageSize,
      page_count: data.page_count || 0,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      products: [],
      count: 0,
      page: 1,
      page_size: pageSize,
      page_count: 0,
    };
  }
}

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v0/product/${barcode}.json`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data: ProductDetailResponse = await response.json();
    
    if (data.status === 1 && data.product) {
      return data.product;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    return null;
  }
}

export async function getProductsByCategory(
  category: string,
  page: number = 1,
  pageSize: number = 24
): Promise<ProductResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}&page_size=${pageSize}&page=${page}&json=true`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    
    const data = await response.json();
    return {
      products: data.products || [],
      count: data.count || 0,
      page: data.page || page,
      page_size: data.page_size || pageSize,
      page_count: data.page_count || 0,
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return {
      products: [],
      count: 0,
      page: 1,
      page_size: pageSize,
      page_count: 0,
    };
  }
}

export async function getPopularProducts(page: number = 1, pageSize: number = 24): Promise<ProductResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?action=process&sort_by=popularity&page_size=${pageSize}&page=${page}&json=true`,
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular products');
    }
    
    const data = await response.json();
    return {
      products: data.products || [],
      count: data.count || 0,
      page: data.page || page,
      page_size: data.page_size || pageSize,
      page_count: data.page_count || 0,
    };
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return {
      products: [],
      count: 0,
      page: 1,
      page_size: pageSize,
      page_count: 0,
    };
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/categories.json`,
      { next: { revalidate: 86400 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    const categories = data.tags?.map((tag: any) => tag.name) || [];
    return categories.slice(0, 50); // Limit to top 50 categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
