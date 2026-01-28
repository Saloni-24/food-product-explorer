import { NextResponse } from 'next/server';

// Create a fetch with timeout helper
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: The API took too long to respond');
    }
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '24');

    if (!searchTerm) {
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

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&page_size=${pageSize}&page=${page}&json=true`;
    
    const response = await fetchWithTimeout(
      url,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
      30000 // 30 second timeout
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle empty results gracefully
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
  } catch (error: any) {
    console.error('Error searching products:', error);
    
    // Return empty results instead of 500 error for better UX
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
