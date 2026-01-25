'use client';

import { SortOption } from '@/types/product';

interface SortDropdownProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export default function SortDropdown({ sortOption, onSortChange }: SortDropdownProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'grade-asc', label: 'Nutrition Grade (Best First)' },
    { value: 'grade-desc', label: 'Nutrition Grade (Worst First)' },
  ];

  return (
    <div className="w-full sm:w-auto">
      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
        Sort By
      </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
