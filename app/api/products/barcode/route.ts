import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get('code');

    if (!barcode) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();

    if (data.status === 1 && data.product) {
      return NextResponse.json(data.product);
    }

    return NextResponse.json(null, { status: 404 });
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    return NextResponse.json(null, { status: 500 });
  }
}
