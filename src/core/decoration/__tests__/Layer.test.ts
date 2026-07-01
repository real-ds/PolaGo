import { describe, it, expect } from "vitest";
import { StickerLayer } from "../StickerLayer";
import { TextLayer } from "../TextLayer";
import { FrameLayer } from "../FrameLayer";

describe("Layer implementations", () => {
  describe("StickerLayer", () => {
    it("should create a sticker layer with correct properties", () => {
      const layer = new StickerLayer("sticker-1", 100, 200, "/heart.svg");
      expect(layer.id).toBe("sticker-1");
      expect(layer.x).toBe(100);
      expect(layer.y).toBe(200);
      expect(layer.visible).toBe(true);
    });

    it("should serialize correctly", () => {
      const layer = new StickerLayer("s1", 50, 50, "/heart.svg");
      const data = layer.serialize();
      expect(data.type).toBe("sticker");
      expect(data.imageSrc).toBe("/heart.svg");
    });
  });

  describe("TextLayer", () => {
    it("should create a text layer with default style", () => {
      const layer = new TextLayer("text-1", 150, 250, "Hello");
      expect(layer.id).toBe("text-1");
      expect(layer.serialize().text).toBe("Hello");
    });

    it("should update text via setText", () => {
      const layer = new TextLayer("t1", 0, 0, "Old");
      layer.setText("New");
      expect(layer.serialize().text).toBe("New");
    });

    it("should serialize with style info", () => {
      const layer = new TextLayer("t1", 0, 0, "Test", {
        fontSize: 32,
        color: "#ff0000",
      });
      const data = layer.serialize();
      expect((data.style as Record<string, unknown>).fontSize).toBe(32);
      expect((data.style as Record<string, unknown>).color).toBe("#ff0000");
    });
  });

  describe("FrameLayer", () => {
    it("should create a frame layer", () => {
      const layer = new FrameLayer("frame-1", 200, 200, "/frame.svg");
      expect(layer.id).toBe("frame-1");
      expect(layer.serialize().type).toBe("frame");
    });
  });
});
