'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, SortOption } from '@/types/product';
import { searchProductsByName, getProductByBarcode, getProductsByCategory, getPopularProducts, getCategories } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import UnifiedSearchBar from '@/components/UnifiedSearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import SortDropdown from '@/components/SortDropdown';
import LoadMoreButton from '@/components/LoadMoreButton';

type FilterMode = 'barcode' | 'name' | 'category' | 'popular';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [barcodeQuery, setBarcodeQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Determine the active filter mode based on priority: barcode > name > category > popular
  const activeFilterMode = useMemo<FilterMode>(() => {
    if (barcodeQuery.trim()) return 'barcode';
    if (searchQuery.trim()) return 'name';
    if (selectedCategory) return 'category';
    return 'popular';
  }, [barcodeQuery, searchQuery, selectedCategory]);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setCurrentPage(1);

      try {
        let response;
        
        switch (activeFilterMode) {
          case 'barcode':
            if (barcodeQuery.trim()) {
              const product = await getProductByBarcode(barcodeQuery.trim());
              setProducts(product ? [product] : []);
              setHasMore(false);
            } else {
              setProducts([]);
              setHasMore(false);
            }
            setIsLoading(false);
            return;

          case 'name':
            response = await searchProductsByName(searchQuery.trim(), 1, 24);
            setProducts(response.products);
            setCurrentPage(response.page);
            setHasMore(response.page < response.page_count);
            setIsLoading(false);
            return;

          case 'category':
            response = await getProductsByCategory(selectedCategory, 1, 24);
            setProducts(response.products);
            setCurrentPage(response.page);
            setHasMore(response.page < response.page_count);
            setIsLoading(false);
            return;

          case 'popular':
          default:
            response = await getPopularProducts(1, 24);
            setProducts(response.products);
            setCurrentPage(response.page);
            setHasMore(response.page < response.page_count);
            setIsLoading(false);
            return;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setHasMore(false);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilterMode, barcodeQuery, searchQuery, selectedCategory]);

  // Handle name search - works independently
  const handleNameSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // Don't clear other filters - let them work independently
  }, []);

  // Handle barcode search - works independently
  const handleBarcodeSearch = useCallback((barcode: string) => {
    setBarcodeQuery(barcode);
    setCurrentPage(1);
    // Don't clear other filters - let them work independently
  }, []);

  // Handle category filter - works independently
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    // Don't clear other filters - let them work independently
  }, []);

  // Load more products based on current active filter
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || activeFilterMode === 'barcode') return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      let response;
      
      switch (activeFilterMode) {
        case 'name':
          response = await searchProductsByName(searchQuery.trim(), nextPage, 24);
          break;
        case 'category':
          response = await getProductsByCategory(selectedCategory, nextPage, 24);
          break;
        case 'popular':
        default:
          response = await getPopularProducts(nextPage, 24);
          break;
      }

      setProducts((prev) => [...prev, ...response.products]);
      setCurrentPage(response.page);
      setHasMore(response.page < response.page_count);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, activeFilterMode, searchQuery, selectedCategory]);

  // Sort products - works on current displayed list
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
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
  }, [products, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Food Product Explorer</h1>
        <p className="text-gray-600">Discover and explore food products from around the world</p>
      </div>

      {/* Search Bars */}
      <div className="mb-6">
        <UnifiedSearchBar
          onNameSearch={handleNameSearch}
          onBarcodeSearch={handleBarcodeSearch}
        />
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
          <ProductGrid products={sortedProducts} />
          {activeFilterMode !== 'barcode' && (
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
