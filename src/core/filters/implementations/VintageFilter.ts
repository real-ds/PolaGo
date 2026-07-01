import { IFilter } from "../IFilter";

export class VintageFilter implements IFilter {
  id = "vintage";
  label = "Vintage";
  thumbnail = "/assets/filters/vintage.png";
  cssFilter = "sepia(0.4) saturate(1.2) contrast(0.9) brightness(1.05)";

  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = Math.min(255, r * 1.1 + 20);
      data[i + 1] = Math.min(255, g * 0.9 + 10);
      data[i + 2] = Math.min(255, b * 0.8);
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
