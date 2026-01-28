import { Product, ProductResponse } from '@/types/product';

// Use Next.js API routes to avoid CORS issues
const API_BASE = '/api';

export async function searchProductsByName(
  searchTerm: string,
  page: number = 1,
  pageSize: number = 24
): Promise<ProductResponse> {
  try {
    const response = await fetch(
      `${API_BASE}/products/search?q=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`
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
    const response = await fetch(`${API_BASE}/products/barcode?code=${barcode}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    return data;
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
      `${API_BASE}/products/category?category=${encodeURIComponent(category)}&page=${page}&pageSize=${pageSize}`
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
      `${API_BASE}/products/popular?page=${page}&pageSize=${pageSize}`
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
    const response = await fetch(`${API_BASE}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
