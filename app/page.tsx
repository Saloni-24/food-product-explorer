'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, SortOption } from '@/types/product';
import { searchProductsByName, getProductByBarcode, getProductsByCategory, getPopularProducts, getCategories } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import SortDropdown from '@/components/SortDropdown';
import LoadMoreButton from '@/components/LoadMoreButton';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [barcodeQuery, setBarcodeQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchMode, setSearchMode] = useState<'popular' | 'search' | 'category' | 'barcode'>('popular');

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  // Load initial products
  useEffect(() => {
    const loadInitialProducts = async () => {
      setIsLoading(true);
      const response = await getPopularProducts(1, 24);
      setProducts(response.products);
      setCurrentPage(1);
      setHasMore(response.page < response.page_count);
      setIsLoading(false);
    };
    loadInitialProducts();
  }, []);

  // Handle name search
  const handleNameSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setBarcodeQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
    
    if (!query.trim()) {
      setIsLoading(true);
      const response = await getPopularProducts(1, 24);
      setProducts(response.products);
      setHasMore(response.page < response.page_count);
      setSearchMode('popular');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSearchMode('search');
    const response = await searchProductsByName(query, 1, 24);
    setProducts(response.products);
    setHasMore(response.page < response.page_count);
    setIsLoading(false);
  }, []);

  // Handle barcode search
  const handleBarcodeSearch = useCallback(async (barcode: string) => {
    if (!barcode.trim()) return;
    
    setBarcodeQuery(barcode);
    setSearchQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
    setIsLoading(true);
    setSearchMode('barcode');
    
    const product = await getProductByBarcode(barcode);
    if (product) {
      setProducts([product]);
      setHasMore(false);
    } else {
      setProducts([]);
      setHasMore(false);
    }
    setIsLoading(false);
  }, []);

  // Handle category filter
  const handleCategoryChange = useCallback(async (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setBarcodeQuery('');
    setCurrentPage(1);
    
    if (!category) {
      setIsLoading(true);
      const response = await getPopularProducts(1, 24);
      setProducts(response.products);
      setHasMore(response.page < response.page_count);
      setSearchMode('popular');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSearchMode('category');
    const response = await getProductsByCategory(category, 1, 24);
    setProducts(response.products);
    setHasMore(response.page < response.page_count);
    setIsLoading(false);
  }, []);

  // Load more products
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    let response;
    if (searchMode === 'search' && searchQuery) {
      response = await searchProductsByName(searchQuery, nextPage, 24);
    } else if (searchMode === 'category' && selectedCategory) {
      response = await getProductsByCategory(selectedCategory, nextPage, 24);
    } else {
      response = await getPopularProducts(nextPage, 24);
    }

    setProducts((prev) => [...prev, ...response.products]);
    setCurrentPage(nextPage);
    setHasMore(response.page < response.page_count);
    setIsLoadingMore(false);
  }, [currentPage, hasMore, isLoadingMore, searchMode, searchQuery, selectedCategory]);

  // Sort products
  useEffect(() => {
    const sorted = [...products].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return (a.product_name || '').localeCompare(b.product_name || '');
        case 'name-desc':
          return (b.product_name || '').localeCompare(a.product_name || '');
        case 'grade-asc': {
          const gradeOrder: { [key: string]: number } = { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 };
          const aGrade = (a.nutriscore_grade || '').toLowerCase();
          const bGrade = (b.nutriscore_grade || '').toLowerCase();
          return (gradeOrder[aGrade] || 99) - (gradeOrder[bGrade] || 99);
        }
        case 'grade-desc': {
          const gradeOrder: { [key: string]: number } = { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 };
          const aGrade = (a.nutriscore_grade || '').toLowerCase();
          const bGrade = (b.nutriscore_grade || '').toLowerCase();
          return (gradeOrder[bGrade] || 99) - (gradeOrder[aGrade] || 99);
        }
        default:
          return 0;
      }
    });
    setFilteredProducts(sorted);
  }, [products, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Food Product Explorer</h1>
        <p className="text-gray-600">Discover and explore food products from around the world</p>
      </div>

      {/* Search Bars */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Product Name
          </label>
          <SearchBar onSearch={handleNameSearch} placeholder="Enter product name..." searchType="name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Barcode
          </label>
          <SearchBar onSearch={handleBarcodeSearch} placeholder="Enter barcode (e.g., 737628064502)..." searchType="barcode" />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
        />
        <SortDropdown sortOption={sortOption} onSortChange={setSortOption} />
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          <ProductGrid products={filteredProducts} />
          {searchMode !== 'barcode' && (
            <LoadMoreButton
              onClick={handleLoadMore}
              isLoading={isLoadingMore}
              hasMore={hasMore}
            />
          )}
        </>
      )}
    </div>
  );
}
