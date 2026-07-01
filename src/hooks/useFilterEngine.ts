"use client";

import { useState, useCallback } from "react";
import { IFilter } from "@/core/filters/IFilter";
import { FilterRegistry } from "@/core/filters/FilterRegistry";
import { VintageFilter } from "@/core/filters/implementations/VintageFilter";
import { SepiaFilter } from "@/core/filters/implementations/SepiaFilter";
import { BlackAndWhiteFilter } from "@/core/filters/implementations/BlackAndWhiteFilter";
import { PastelPopFilter } from "@/core/filters/implementations/PastelPopFilter";
import { VividFilter } from "@/core/filters/implementations/VividFilter";
import { SoftGlowFilter } from "@/core/filters/implementations/SoftGlowFilter";
import { WarmToneFilter } from "@/core/filters/implementations/WarmToneFilter";
import { CoolToneFilter } from "@/core/filters/implementations/CoolToneFilter";
import { FilmGrainFilter } from "@/core/filters/implementations/FilmGrainFilter";

interface UseFilterEngineReturn {
  filters: IFilter[];
  activeFilterId: string | null;
  setActiveFilter: (id: string | null) => void;
}

const defaultFilters = [
  new VintageFilter(),
  new SepiaFilter(),
  new BlackAndWhiteFilter(),
  new PastelPopFilter(),
  new VividFilter(),
  new SoftGlowFilter(),
  new WarmToneFilter(),
  new CoolToneFilter(),
  new FilmGrainFilter(),
];

if (FilterRegistry.list().length === 0) {
  defaultFilters.forEach((f) => FilterRegistry.register(f));
}

export function useFilterEngine(): UseFilterEngineReturn {
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  const setActiveFilter = useCallback((id: string | null) => {
    setActiveFilterId(id);
  }, []);

  return {
    filters: FilterRegistry.list(),
    activeFilterId,
    setActiveFilter,
  };
}
