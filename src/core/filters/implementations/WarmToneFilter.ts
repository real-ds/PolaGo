import { IFilter } from "../IFilter";

export class WarmToneFilter implements IFilter {
  id = "warm-tone";
  label = "Warm Tone";
  thumbnail = "/assets/filters/warm-tone.png";
  cssFilter = "sepia(0.3) saturate(1.1) hue-rotate(-10deg) brightness(1.05)";

  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.15);
      data[i + 1] = Math.min(255, data[i + 1] * 1.02);
      data[i + 2] = Math.min(255, data[i + 2] * 0.85);
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
