import { IFilter } from "../IFilter";

export class FilmGrainFilter implements IFilter {
  id = "film-grain";
  label = "Film Grain";
  thumbnail = "/assets/filters/film-grain.png";
  cssFilter = "contrast(1.05) brightness(0.95)";

  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 30;
      data[i] = Math.min(255, Math.max(0, data[i] + grain));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
