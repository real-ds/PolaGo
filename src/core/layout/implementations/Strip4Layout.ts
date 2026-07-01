import { LayoutStrategy } from "../LayoutStrategy";

export class Strip4Layout extends LayoutStrategy {
  cols = 1;
  rows = 4;

  compose(frames: HTMLCanvasElement[], target: HTMLCanvasElement): void {
    const ctx = target.getContext("2d");
    if (!ctx) return;
    const margin = 16;
    const gap = 8;
    const usableH = target.height - margin * 2;
    const usableW = target.width - margin * 2;
    const shotH = (usableH - gap * (frames.length - 1)) / frames.length;
    frames.forEach((frame, i) => {
      const y = margin + i * (shotH + gap);
      ctx.drawImage(frame, margin, y, usableW, shotH);
    });
  }
}
