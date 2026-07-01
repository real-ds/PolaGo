import { IFilter } from "../IFilter";

export class SoftGlowFilter implements IFilter {
  id = "soft-glow";
  label = "Soft Glow";
  thumbnail = "/assets/filters/soft-glow.png";
  cssFilter = "brightness(1.1) saturate(0.9) blur(0.5px)";

  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 0.85 + 30);
      data[i + 1] = Math.min(255, data[i + 1] * 0.85 + 25);
      data[i + 2] = Math.min(255, data[i + 2] * 0.85 + 35);
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
