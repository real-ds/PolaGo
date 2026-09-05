"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { IFilter } from "@/core/filters/IFilter";
import { cn } from "@/lib/utils";

interface FilterCarouselProps {
  filters: IFilter[];
  activeFilterId: string | null;
  onSelect: (id: string | null) => void;
}

const FILTER_COLORS = [
  "from-orange-200 to-pink-200",
  "from-amber-200 to-orange-200",
  "from-slate-300 to-slate-100",
  "from-pink-200 to-purple-200",
  "from-yellow-200 to-orange-200",
  "from-purple-200 to-pink-100",
  "from-orange-300 to-yellow-200",
  "from-blue-200 to-cyan-200",
  "from-gray-300 to-gray-100",
];

export function FilterCarousel({
  filters,
  activeFilterId,
  onSelect,
}: FilterCarouselProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-1">
      <FilterChip
        label="None"
        isActive={activeFilterId === null}
        onClick={() => onSelect(null)}
        colorClass="from-gray-100 to-gray-200"
      />
      {filters.map((filter, idx) => (
        <FilterChip
          key={filter.id}
          label={filter.label}
          isActive={activeFilterId === filter.id}
          onClick={() => onSelect(filter.id)}
          colorClass={FILTER_COLORS[idx % FILTER_COLORS.length]}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
  colorClass,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  colorClass: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        "flex-shrink-0 w-20 h-20 rounded-2xl border-[3px] transition-all duration-200 cursor-pointer",
        isActive
          ? "border-primary shadow-clay"
          : "border-border shadow-clay-sm hover:border-secondary"
      )}
      aria-label={`Apply ${label} filter`}
      aria-pressed={isActive}
    >
      <div
        className={cn(
          "w-full h-full rounded-xl bg-gradient-to-br flex items-center justify-center relative",
          colorClass
        )}
      >
        <span className="text-[11px] font-quicksand font-bold text-foreground text-center leading-tight px-1.5">
          {label}
        </span>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-primary text-primary-foreground border-[2px] border-orange-600 rounded-full p-0.5 shadow-clay-sm"
          >
            <Check className="h-3 w-3" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
