"use client";

import { IFilter } from "@/core/filters/IFilter";

interface FilterCarouselProps {
  filters: IFilter[];
  activeFilterId: string | null;
  onSelect: (id: string | null) => void;
}

export function FilterCarousel({ filters, activeFilterId, onSelect }: FilterCarouselProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 w-16 h-16 rounded-2xl border-2 transition-all ${
          activeFilterId === null ? "border-pink-400 shadow-md" : "border-transparent hover:border-pink-200"
        }`}
      >
        <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center">
          <span className="text-xs font-quicksand text-gray-500">None</span>
        </div>
      </button>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onSelect(filter.id)}
          className={`flex-shrink-0 w-16 h-16 rounded-2xl border-2 transition-all overflow-hidden ${
            activeFilterId === filter.id ? "border-pink-400 shadow-md" : "border-transparent hover:border-pink-200"
          }`}
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <span className="text-[10px] font-quicksand font-medium text-pink-600 text-center leading-tight px-1">
              {filter.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
