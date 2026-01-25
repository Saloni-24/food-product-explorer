'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image_url || product.image_small_url || '/placeholder-product.png';
  const productName = product.product_name || product.product_name_en || 'Unknown Product';
  const category = product.categories?.split(',')[0]?.trim() || 'Uncategorized';
  const grade = product.nutriscore_grade?.toUpperCase() || 'N/A';
  const ingredients = product.ingredients_text || product.ingredients_text_en || 'Not available';

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
    <Link href={`/product/${product.code}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative w-full h-48 bg-gray-100">
          {imageUrl && imageUrl !== '/placeholder-product.png' ? (
            <Image
              src={imageUrl}
              alt={productName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
            {productName}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {category}
            </span>
            <span
              className={`${getGradeColor(grade)} text-white text-xs font-bold px-2 py-1 rounded-full`}
            >
              Grade {grade}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mt-auto">
            {ingredients.length > 100 ? `${ingredients.substring(0, 100)}...` : ingredients}
          </p>
        </div>
      </div>
    </Link>
  );
}
