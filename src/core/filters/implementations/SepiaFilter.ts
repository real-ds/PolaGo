import { IFilter } from "../IFilter";

export class SepiaFilter implements IFilter {
  id = "sepia";
  label = "Sepia";
  thumbnail = "/assets/filters/sepia.png";
  cssFilter = "sepia(1)";

  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;
      data[i] = Math.min(255, tr);
      data[i + 1] = Math.min(255, tg);
      data[i + 2] = Math.min(255, tb);
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
