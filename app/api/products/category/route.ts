import { NextResponse } from 'next/server';

/**
 * Normalize category name for OpenFoodFacts URL format
 * - Convert to lowercase
 * - Replace spaces with hyphens
 * - Remove special characters
 * - Handle common category name variations
 */
function normalizeCategoryName(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '24');

    if (!category) {
      return NextResponse.json(
        {
          products: [],
          count: 0,
          page: 1,
          page_size: pageSize,
          page_count: 0,
        },
        { status: 400 }
      );
    }

    // Normalize category name for URL
    const normalizedCategory = normalizeCategoryName(category);

    // Try the category endpoint first: /category/{category}.json
    // This is the format requested by the user
    try {
      const categoryController = new AbortController();
      const categoryTimeoutId = setTimeout(() => categoryController.abort(), 30000);
      
      const categoryResponse = await fetch(
        `https://world.openfoodfacts.org/category/${normalizedCategory}.json`,
        {
          next: { revalidate: 3600 }, // Cache for 1 hour
          signal: categoryController.signal,
        }
      );
      clearTimeout(categoryTimeoutId);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        
        // The category endpoint structure may vary, try different possible structures
        let products = [];
        if (categoryData.products) {
          products = Array.isArray(categoryData.products) ? categoryData.products : [];
        } else if (categoryData.tags && categoryData.tags[0] && categoryData.tags[0].products) {
          products = Array.isArray(categoryData.tags[0].products) ? categoryData.tags[0].products : [];
        } else if (Array.isArray(categoryData)) {
          products = categoryData;
        }

        // If we got products from category endpoint
        if (products.length > 0) {
          // For pagination, slice the products array
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedProducts = products.slice(startIndex, endIndex);
          const totalCount = products.length;
          const totalPages = Math.ceil(totalCount / pageSize);

          return NextResponse.json({
            products: paginatedProducts,
            count: totalCount,
            page: page,
            page_size: pageSize,
            page_count: totalPages,
          });
        }
      }
    } catch (categoryError: any) {
      // If category endpoint fails, fall through to search endpoint
      if (categoryError.name === 'AbortError') {
        console.log('Category endpoint timeout, using search endpoint');
      } else {
        console.log('Category endpoint failed, using search endpoint:', categoryError);
      }
    }

    // Fallback: Use search endpoint for better pagination support
    // This endpoint properly supports pagination and category filtering
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(normalizedCategory)}&page_size=${pageSize}&page=${page}&json=true`;
    
    // Add timeout to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(searchUrl, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle empty results
      if (!data.products || data.products.length === 0) {
        return NextResponse.json({
          products: [],
          count: 0,
          page: page,
          page_size: pageSize,
          page_count: 0,
        });
      }

      return NextResponse.json({
        products: data.products || [],
        count: data.count || 0,
        page: data.page || page,
        page_size: data.page_size || pageSize,
        page_count: data.page_count || 0,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('Category search timeout:', fetchError);
      } else {
        console.error('Error fetching products by category:', fetchError);
      }
      // Return empty results instead of error for better UX
      return NextResponse.json({
        products: [],
        count: 0,
        page: 1,
        page_size: 24,
        page_count: 0,
      });
    }
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      {
        products: [],
        count: 0,
        page: 1,
        page_size: 24,
        page_count: 0,
      },
      { status: 200 } // Return 200 with empty results instead of 500
    );
  }
}
