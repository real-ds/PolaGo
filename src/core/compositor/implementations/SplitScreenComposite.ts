import { CompositeStrategy } from "../CompositeStrategy";

export class SplitScreenComposite extends CompositeStrategy {
  compose(localFrame: HTMLCanvasElement, remoteFrame: HTMLCanvasElement, target: HTMLCanvasElement): void {
    const ctx = target.getContext("2d");
    if (!ctx) return;
    const halfW = target.width / 2;
    ctx.drawImage(localFrame, 0, 0, halfW, target.height);
    ctx.drawImage(remoteFrame, halfW, 0, halfW, target.height);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(halfW, 0);
    ctx.lineTo(halfW, target.height);
    ctx.stroke();
  }
}
