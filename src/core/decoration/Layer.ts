export abstract class Layer {
  public id: string;
  public x: number;
  public y: number;
  public rotation: number;
  public scale: number;
  public zIndex: number;
  public visible: boolean;

  constructor(id: string, x: number, y: number, rotation = 0, scale = 1, zIndex = 0) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.scale = scale;
    this.zIndex = zIndex;
    this.visible = true;
  }

  abstract render(ctx: CanvasRenderingContext2D): void;

  serialize(): Record<string, unknown> {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      scale: this.scale,
      zIndex: this.zIndex,
      visible: this.visible,
    };
  }
}
