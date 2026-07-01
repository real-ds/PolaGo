import { vi } from "vitest";

function createMockContext(): CanvasRenderingContext2D {
  let imageData: ImageData | null = null;
  const mock: Partial<CanvasRenderingContext2D> = {
    fillStyle: "#000",
    strokeStyle: "#000",
    lineWidth: 1,
    shadowColor: "",
    shadowBlur: 0,
    globalAlpha: 1,
    font: "",
    textAlign: "start" as CanvasTextAlign,
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    getImageData: vi.fn((_x: number, _y: number, w: number, h: number) => {
      const data = new Uint8ClampedArray(w * h * 4);
      imageData = { data, width: w, height: h, colorSpace: "srgb" as PredefinedColorSpace };
      return imageData;
    }),
    putImageData: vi.fn((data: ImageData) => {
      imageData = data;
    }),
  };
  return mock as CanvasRenderingContext2D;
}

HTMLCanvasElement.prototype.getContext = function () {
  return createMockContext() as unknown as CanvasRenderingContext2D | null;
};

HTMLCanvasElement.prototype.toBlob = function (
  callback: (blob: Blob | null) => void,
  type?: string
): void {
  callback(new Blob(["fake-image"], { type: type || "image/png" }));
};

if (!globalThis.ClipboardItem) {
  (globalThis as Record<string, unknown>).ClipboardItem = class ClipboardItem {
    constructor(public items: Record<string, Blob>) {}
  };
}
