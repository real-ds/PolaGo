import { IFilter } from "../IFilter";

export class PastelPopFilter implements IFilter {
  id = "pastel-pop";
  label = "Pastel Pop";
  thumbnail = "/assets/filters/pastel-pop.png";
  cssFilter = "saturate(0.9) brightness(1.1) contrast(0.95)";

  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 0.9 + 40);
      data[i + 1] = Math.min(255, data[i + 1] * 0.9 + 30);
      data[i + 2] = Math.min(255, data[i + 2] * 0.9 + 50);
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
