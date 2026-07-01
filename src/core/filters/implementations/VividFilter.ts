import { IFilter } from "../IFilter";

export class VividFilter implements IFilter {
  id = "vivid";
  label = "Vivid";
  thumbnail = "/assets/filters/vivid.png";
  cssFilter = "saturate(1.5) contrast(1.3)";

  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.3 + 128));
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.3 + 128));
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.3 + 128));
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
