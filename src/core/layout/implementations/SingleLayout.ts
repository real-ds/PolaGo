import { LayoutStrategy } from "../LayoutStrategy";

export class SingleLayout extends LayoutStrategy {
  cols = 1;
  rows = 1;

  compose(frames: HTMLCanvasElement[], target: HTMLCanvasElement): void {
    const ctx = target.getContext("2d");
    if (!ctx || frames.length === 0) return;
    ctx.drawImage(frames[0], 0, 0, target.width, target.height);
  }
}
