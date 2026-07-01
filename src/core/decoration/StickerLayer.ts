import { Layer } from "./Layer";

export class StickerLayer extends Layer {
  private image: HTMLImageElement | null = null;
  private imageSrc: string;

  constructor(id: string, x: number, y: number, imageSrc: string) {
    super(id, x, y);
    this.imageSrc = imageSrc;
    this.loadImage();
  }

  private loadImage(): void {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.imageSrc;
    img.onload = () => {
      this.image = img;
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.image || !this.visible) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(this.scale, this.scale);
    ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    ctx.restore();
  }

  serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      type: "sticker",
      imageSrc: this.imageSrc,
    };
  }
}
