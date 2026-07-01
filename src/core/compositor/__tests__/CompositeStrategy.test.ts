import { describe, it, expect } from "vitest";
import { SplitScreenComposite } from "../implementations/SplitScreenComposite";
import { PictureInPictureComposite } from "../implementations/PictureInPictureComposite";
import { HeartFrameComposite } from "../implementations/HeartFrameComposite";

function createTestCanvas(width = 200, height = 200): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

describe("CompositeStrategy implementations", () => {
  describe("SplitScreenComposite", () => {
    it("should compose without throwing", () => {
      const local = createTestCanvas();
      const remote = createTestCanvas();
      const target = createTestCanvas(400, 200);
      const strategy = new SplitScreenComposite();
      expect(() => strategy.compose(local, remote, target)).not.toThrow();
    });
  });

  describe("PictureInPictureComposite", () => {
    it("should compose without throwing", () => {
      const local = createTestCanvas();
      const remote = createTestCanvas();
      const target = createTestCanvas(400, 300);
      const strategy = new PictureInPictureComposite();
      expect(() => strategy.compose(local, remote, target)).not.toThrow();
    });
  });

  describe("HeartFrameComposite", () => {
    it("should compose without throwing", () => {
      const local = createTestCanvas();
      const remote = createTestCanvas();
      const target = createTestCanvas(400, 400);
      const strategy = new HeartFrameComposite();
      expect(() => strategy.compose(local, remote, target)).not.toThrow();
    });
  });
});
