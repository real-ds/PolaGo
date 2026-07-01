import { generateFilename } from "@/lib/utils";

export type ExportFormat = "png" | "jpeg" | "jpg";

export class ExportService {
  async exportCanvas(
    canvas: HTMLCanvasElement,
    format: ExportFormat = "png",
    quality: number = 90
  ): Promise<Blob> {
    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const qualityFraction = quality / 100;
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        mimeType,
        qualityFraction
      );
    });
  }

  async download(canvas: HTMLCanvasElement, format: ExportFormat = "png", quality = 90): Promise<void> {
    const blob = await this.exportCanvas(canvas, format, quality);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generateFilename(format);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async downloadMultiple(
    canvases: HTMLCanvasElement[],
    format: ExportFormat = "png",
    quality = 90
  ): Promise<void> {
    for (const canvas of canvases) {
      await this.download(canvas, format, quality);
    }
  }

  async copyToClipboard(canvas: HTMLCanvasElement): Promise<void> {
    const blob = await this.exportCanvas(canvas, "png");
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    } catch {
      throw new Error("Clipboard write failed");
    }
  }

  async shareViaWebAPI(canvas: HTMLCanvasElement, format: ExportFormat = "png"): Promise<void> {
    const blob = await this.exportCanvas(canvas, format);
    const file = new File([blob], generateFilename(format), { type: blob.type });
    try {
      await navigator.share({ files: [file] });
    } catch {
      throw new Error("Web Share API failed");
    }
  }
}
