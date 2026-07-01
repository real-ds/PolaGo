export abstract class CompositeStrategy {
  abstract compose(
    localFrame: HTMLCanvasElement,
    remoteFrame: HTMLCanvasElement,
    target: HTMLCanvasElement
  ): void;
}
