'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { getProductByBarcode } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      const productData = await getProductByBarcode(code);
      setProduct(productData);
      setIsLoading(false);
    };

    if (code) {
      loadProduct();
    }
  }, [code]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or couldn't be loaded.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const productName = product.product_name || product.product_name_en || 'Unknown Product';
  const imageUrl = product.image_url || product.image_small_url || '/placeholder-product.png';
  const ingredients = product.ingredients_text || product.ingredients_text_en || 'Not available';
  const grade = product.nutriscore_grade?.toUpperCase() || 'N/A';
  const categories = product.categories_tags || [];
  const labels = product.labels_tags || [];
  const nutriments = product.nutriments || {};

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-500';
      case 'B':
        return 'bg-yellow-400';
      case 'C':
        return 'bg-orange-400';
      case 'D':
        return 'bg-orange-600';
      case 'E':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 bg-gray-100 p-8 flex items-center justify-center">
            {imageUrl && imageUrl !== '/placeholder-product.png' ? (
              <div className="relative w-full h-96">
                <Image
                  src={imageUrl}
                  alt={productName}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-gray-400">
                <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{productName}</h1>
              <span
                className={`${getGradeColor(grade)} text-white text-sm font-bold px-3 py-1 rounded-full ml-4`}
              >
                Grade {grade}
              </span>
            </div>

            {product.brands && (
              <p className="text-lg text-gray-600 mb-4">
                <span className="font-semibold">Brand:</span> {product.brands}
              </p>
            )}

            {product.quantity && (
              <p className="text-lg text-gray-600 mb-4">
                <span className="font-semibold">Quantity:</span> {product.quantity}
              </p>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 5).map((category, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {category.replace('en:', '').replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Labels */}
            {labels.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Labels:</h3>
                <div className="flex flex-wrap gap-2">
                  {labels.map((label, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {label.replace('en:', '').replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                addToCart(product);
                setShowToast(true);
              }}
              className="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <div className="border-t border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
          <p className="text-gray-700 leading-relaxed">{ingredients}</p>
        </div>

        {/* Nutritional Information */}
        <div className="border-t border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nutritional Information (per 100g)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nutriments.energy_kcal_100g !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Energy</p>
                <p className="text-xl font-bold text-gray-800">{nutriments.energy_kcal_100g} kcal</p>
              </div>
            )}
            {nutriments.fat_100g !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Fat</p>
                <p className="text-xl font-bold text-gray-800">{nutriments.fat_100g}g</p>
              </div>
            )}
            {nutriments.carbohydrates_100g !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Carbohydrates</p>
                <p className="text-xl font-bold text-gray-800">{nutriments.carbohydrates_100g}g</p>
              </div>
            )}
            {nutriments.proteins_100g !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Proteins</p>
                <p className="text-xl font-bold text-gray-800">{nutriments.proteins_100g}g</p>
              </div>
            )}
            {nutriments.fiber_100g !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Fiber</p>
                <p className="text-xl font-bold text-gray-800">{nutriments.fiber_100g}g</p>
              </div>
            )}
            {nutriments.sugars_100g !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Sugars</p>
                <p className="text-xl font-bold text-gray-800">{nutriments.sugars_100g}g</p>
              </div>
            )}
            {nutriments.salt_100g !== undefined && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Salt</p>
                <p className="text-xl font-bold text-gray-800">{nutriments.salt_100g}g</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Code */}
        <div className="border-t border-gray-200 p-8 bg-gray-50">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Product Code (Barcode):</span> {product.code}
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message="Item added to cart"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={2500}
      />
    </div>
  );
}
