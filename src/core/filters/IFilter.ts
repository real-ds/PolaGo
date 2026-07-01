export interface IFilter {
  id: string;
  label: string;
  thumbnail: string;
  cssFilter: string;
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void;
}
