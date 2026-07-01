"use client";

import { Slider } from "@/components/ui/Slider";

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  vignette: number;
}

interface AdjustmentSlidersProps {
  values: Adjustments;
  onChange: (key: keyof Adjustments, value: number) => void;
}

export function AdjustmentSliders({ values, onChange }: AdjustmentSlidersProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-pink-100">
      <h4 className="font-fredoka text-sm text-pink-700">Adjustments</h4>
      <Slider label="Brightness" value={values.brightness} onChange={(v) => onChange("brightness", v)} />
      <Slider label="Contrast" value={values.contrast} onChange={(v) => onChange("contrast", v)} />
      <Slider label="Saturation" value={values.saturation} onChange={(v) => onChange("saturation", v)} />
      <Slider label="Warmth" value={values.warmth} onChange={(v) => onChange("warmth", v)} />
      <Slider label="Vignette" value={values.vignette} onChange={(v) => onChange("vignette", v)} />
    </div>
  );
}
