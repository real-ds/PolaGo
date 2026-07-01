import { LayoutStrategy } from "../LayoutStrategy";

export class GridLayout extends LayoutStrategy {
  cols = 2;
  rows = 2;

  compose(frames: HTMLCanvasElement[], target: HTMLCanvasElement): void {
    const ctx = target.getContext("2d");
    if (!ctx) return;
    const gap = 8;
    const cellW = (target.width - gap) / 2;
    const cellH = (target.height - gap) / 2;
    frames.forEach((frame, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = col * (cellW + gap);
      const y = row * (cellH + gap);
      ctx.drawImage(frame, x, y, cellW, cellH);
    });
  }
}
