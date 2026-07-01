export abstract class LayoutStrategy {
  abstract compose(frames: HTMLCanvasElement[], target: HTMLCanvasElement): void;
  abstract get cols(): number;
  abstract get rows(): number;
}
