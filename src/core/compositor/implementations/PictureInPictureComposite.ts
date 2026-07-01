import { CompositeStrategy } from "../CompositeStrategy";

export class PictureInPictureComposite extends CompositeStrategy {
  compose(localFrame: HTMLCanvasElement, remoteFrame: HTMLCanvasElement, target: HTMLCanvasElement): void {
    const ctx = target.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(localFrame, 0, 0, target.width, target.height);
    const pipW = target.width * 0.35;
    const pipH = target.height * 0.35;
    const pipX = target.width - pipW - 16;
    const pipY = target.height - pipH - 16;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 10;
    ctx.drawImage(remoteFrame, pipX, pipY, pipW, pipH);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.strokeRect(pipX, pipY, pipW, pipH);
  }
}
