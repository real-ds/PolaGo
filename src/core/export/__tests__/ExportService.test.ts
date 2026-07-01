import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ExportService } from "../ExportService";

function createTestCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, 100, 100);
  return canvas;
}

describe("ExportService", () => {
  let service: ExportService;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
    service = new ExportService();
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn(() => "blob:test");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it("should export canvas as PNG blob", async () => {
    const canvas = createTestCanvas();
    const blob = await service.exportCanvas(canvas, "png");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/png");
  });

  it("should export canvas as JPEG blob", async () => {
    const canvas = createTestCanvas();
    const blob = await service.exportCanvas(canvas, "jpeg", 80);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/jpeg");
  });

  it("should trigger download without throwing", async () => {
    const canvas = createTestCanvas();
    const appendChild = vi.spyOn(document.body, "appendChild");
    const removeChild = vi.spyOn(document.body, "removeChild");
    await service.download(canvas, "png");
    expect(appendChild).toHaveBeenCalled();
    expect(removeChild).toHaveBeenCalled();
    appendChild.mockRestore();
    removeChild.mockRestore();
  });

  it("should copy to clipboard without throwing", async () => {
    const canvas = createTestCanvas();
    const write = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { write },
      configurable: true,
    });
    await expect(service.copyToClipboard(canvas)).resolves.not.toThrow();
    expect(write).toHaveBeenCalled();
  });
});
