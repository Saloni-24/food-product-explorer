import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '24');

    // Add timeout to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?action=process&sort_by=popularity&page_size=${pageSize}&page=${page}&json=true`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch popular products: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      products: data.products || [],
      count: data.count || 0,
      page: data.page || page,
      page_size: data.page_size || pageSize,
      page_count: data.page_count || 0,
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Popular products request timeout');
    } else {
      console.error('Error fetching popular products:', error);
    }
    // Return empty results instead of 500 error for better UX
    return NextResponse.json(
      {
        products: [],
        count: 0,
        page: 1,
        page_size: 24,
        page_count: 0,
      },
      { status: 200 }
    );
  }
}
