import { CompositeStrategy } from "../CompositeStrategy";

export class HeartFrameComposite extends CompositeStrategy {
  compose(localFrame: HTMLCanvasElement, remoteFrame: HTMLCanvasElement, target: HTMLCanvasElement): void {
    const ctx = target.getContext("2d");
    if (!ctx) return;
    const cx = target.width / 2;
    const cy = target.height / 2;
    const r = Math.min(target.width, target.height) * 0.42;

    ctx.save();
    this.clipHeart(ctx, cx, cy, r);
    ctx.drawImage(localFrame, 0, 0, target.width, target.height);
    ctx.restore();

    const insetR = r * 0.55;
    const insetCx = cx;
    const insetCy = cy - r * 0.15;
    ctx.save();
    this.clipHeart(ctx, insetCx, insetCy, insetR);
    ctx.drawImage(remoteFrame, 0, 0, target.width, target.height);
    ctx.restore();

    ctx.strokeStyle = "#ff6b9d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    this.heartPath(ctx, cx, cy, r);
    ctx.stroke();
    ctx.beginPath();
    this.heartPath(ctx, insetCx, insetCy, insetR);
    ctx.stroke();
  }

  private clipHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    this.heartPath(ctx, cx, cy, r);
    ctx.clip();
  }

  private heartPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    const s = r / 2;
    ctx.moveTo(cx, cy + s);
    ctx.bezierCurveTo(cx - s * 0.5, cy, cx - s, cy - s * 1.2, cx, cy - s * 1.5);
    ctx.bezierCurveTo(cx + s, cy - s * 1.2, cx + s * 0.5, cy, cx, cy + s);
  }
}
