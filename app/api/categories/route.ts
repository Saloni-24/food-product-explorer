import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://world.openfoodfacts.org/categories.json', {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    // Return category names (display names) - the API route will normalize them
    // OpenFoodFacts returns tags with both 'name' (display) and 'id' (normalized)
    // We use 'name' for display, and normalize it in the category products API
    const categories = data.tags?.map((tag: any) => tag.name || tag.id) || [];
    return NextResponse.json(categories.slice(0, 50)); // Limit to top 50 categories
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json([], { status: 500 });
  }
}
