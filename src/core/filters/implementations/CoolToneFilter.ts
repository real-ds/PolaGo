import { IFilter } from "../IFilter";

export class CoolToneFilter implements IFilter {
  id = "cool-tone";
  label = "Cool Tone";
  thumbnail = "/assets/filters/cool-tone.png";
  cssFilter = "sepia(0.2) saturate(0.85) hue-rotate(30deg) brightness(0.95)";

  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 0.88);
      data[i + 1] = Math.min(255, data[i + 1] * 0.96);
      data[i + 2] = Math.min(255, data[i + 2] * 1.12);
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
