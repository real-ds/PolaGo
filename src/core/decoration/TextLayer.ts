import { Layer } from "./Layer";

export interface TextStyle {
  font: string;
  fontSize: number;
  color: string;
  textAlign: CanvasTextAlign;
}

export class TextLayer extends Layer {
  private text: string;
  private style: TextStyle;

  constructor(id: string, x: number, y: number, text: string, style?: Partial<TextStyle>) {
    super(id, x, y);
    this.text = text;
    this.style = {
      font: "Quicksand",
      fontSize: 24,
      color: "#ffffff",
      textAlign: "center",
      ...style,
    };
  }

  setText(text: string): void {
    this.text = text;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(this.scale, this.scale);
    ctx.font = `${this.style.fontSize}px ${this.style.font}`;
    ctx.textAlign = this.style.textAlign;
    ctx.fillStyle = this.style.color;
    ctx.fillText(this.text, 0, 0);
    ctx.restore();
  }

  serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      type: "text",
      text: this.text,
      style: this.style,
    };
  }
}
