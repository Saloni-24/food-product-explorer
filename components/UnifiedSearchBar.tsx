'use client';

import { useState } from 'react';

interface UnifiedSearchBarProps {
  onNameSearch: (query: string) => void;
  onBarcodeSearch: (barcode: string) => void;
}

export default function UnifiedSearchBar({ onNameSearch, onBarcodeSearch }: UnifiedSearchBarProps) {
  const [nameQuery, setNameQuery] = useState('');
  const [barcodeQuery, setBarcodeQuery] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameQuery.trim()) {
      onNameSearch(nameQuery.trim());
    }
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeQuery.trim()) {
      onBarcodeSearch(barcodeQuery.trim());
    }
  };

  const handleNameButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (nameQuery.trim()) {
      onNameSearch(nameQuery.trim());
    }
  };

  const handleBarcodeButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (barcodeQuery.trim()) {
      onBarcodeSearch(barcodeQuery.trim());
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameQuery(value);
    // Clear search when input is empty
    if (value.trim() === '') {
      onNameSearch('');
    }
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBarcodeQuery(value);
    // Clear search when input is empty
    if (value.trim() === '') {
      onBarcodeSearch('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Product Name Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search by Product Name
        </label>
        <form onSubmit={handleNameSubmit} className="w-full">
          <div className="relative">
            <input
              type="text"
              value={nameQuery}
              onChange={handleNameChange}
              placeholder="Enter product name..."
              className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="button"
              onClick={handleNameButtonClick}
              className="absolute inset-y-0 right-0 px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors font-medium z-10"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Barcode Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search by Barcode
        </label>
        <form onSubmit={handleBarcodeSubmit} className="w-full">
          <div className="relative">
            <input
              type="text"
              value={barcodeQuery}
              onChange={handleBarcodeChange}
              placeholder="Enter barcode (e.g., 737628064502)..."
              className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="button"
              onClick={handleBarcodeButtonClick}
              className="absolute inset-y-0 right-0 px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors font-medium z-10"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
