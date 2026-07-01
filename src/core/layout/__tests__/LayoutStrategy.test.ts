import { describe, it, expect } from "vitest";
import { SingleLayout } from "../implementations/SingleLayout";
import { Strip4Layout } from "../implementations/Strip4Layout";
import { GridLayout } from "../implementations/GridLayout";

function createTestCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  return canvas;
}

describe("LayoutStrategy implementations", () => {
  describe("SingleLayout", () => {
    it("should compose a single frame", () => {
      const target = createTestCanvas();
      const frame = createTestCanvas();
      const layout = new SingleLayout();
      expect(() => layout.compose([frame], target)).not.toThrow();
      expect(layout.cols).toBe(1);
      expect(layout.rows).toBe(1);
    });
  });

  describe("Strip4Layout", () => {
    it("should compose 4 frames into a vertical strip", () => {
      const target = createTestCanvas(200, 400);
      const frames = [createTestCanvas(), createTestCanvas(), createTestCanvas(), createTestCanvas()];
      const layout = new Strip4Layout();
      expect(() => layout.compose(frames, target)).not.toThrow();
      expect(layout.cols).toBe(1);
      expect(layout.rows).toBe(4);
    });
  });

  describe("GridLayout", () => {
    it("should compose 4 frames into a 2x2 grid", () => {
      const target = createTestCanvas(200, 200);
      const frames = [createTestCanvas(), createTestCanvas(), createTestCanvas(), createTestCanvas()];
      const layout = new GridLayout();
      expect(() => layout.compose(frames, target)).not.toThrow();
      expect(layout.cols).toBe(2);
      expect(layout.rows).toBe(2);
    });
  });
});
