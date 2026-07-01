import { describe, it, expect } from "vitest";
import { VintageFilter } from "../implementations/VintageFilter";
import { SepiaFilter } from "../implementations/SepiaFilter";
import { BlackAndWhiteFilter } from "../implementations/BlackAndWhiteFilter";
import { PastelPopFilter } from "../implementations/PastelPopFilter";
import { VividFilter } from "../implementations/VividFilter";
import { SoftGlowFilter } from "../implementations/SoftGlowFilter";
import { WarmToneFilter } from "../implementations/WarmToneFilter";
import { CoolToneFilter } from "../implementations/CoolToneFilter";
import { FilmGrainFilter } from "../implementations/FilmGrainFilter";

describe("Filter implementations", () => {
  const filters = [
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

  it.each(filters)("$id should have required properties", (filter) => {
    expect(filter.id).toBeDefined();
    expect(filter.label).toBeDefined();
    expect(filter.thumbnail).toBeDefined();
    expect(typeof filter.apply).toBe("function");
  });

  it("should apply filter to canvas context", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgb(128, 128, 128)";
    ctx.fillRect(0, 0, 2, 2);

    const filter = new SepiaFilter();
    expect(() => filter.apply(ctx, 2, 2)).not.toThrow();
  });
});
