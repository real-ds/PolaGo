"use client";

import { useCallback, useRef } from "react";
import { ExportService, ExportFormat } from "@/core/export/ExportService";

interface UseExportReturn {
  downloadCanvas: (canvas: HTMLCanvasElement, format?: ExportFormat, quality?: number) => Promise<void>;
  downloadMultiple: (canvases: HTMLCanvasElement[], format?: ExportFormat, quality?: number) => Promise<void>;
  copyToClipboard: (canvas: HTMLCanvasElement) => Promise<void>;
  shareViaWebAPI: (canvas: HTMLCanvasElement, format?: ExportFormat) => Promise<void>;
}

export function useExport(): UseExportReturn {
  const serviceRef = useRef(new ExportService());

  const downloadCanvas = useCallback(async (canvas: HTMLCanvasElement, format: ExportFormat = "png", quality = 90) => {
    await serviceRef.current.download(canvas, format, quality);
  }, []);

  const downloadMultiple = useCallback(async (canvases: HTMLCanvasElement[], format: ExportFormat = "png", quality = 90) => {
    await serviceRef.current.downloadMultiple(canvases, format, quality);
  }, []);

  const copyToClipboard = useCallback(async (canvas: HTMLCanvasElement) => {
    await serviceRef.current.copyToClipboard(canvas);
  }, []);

  const shareViaWebAPI = useCallback(async (canvas: HTMLCanvasElement, format: ExportFormat = "png") => {
    await serviceRef.current.shareViaWebAPI(canvas, format);
  }, []);

  return { downloadCanvas, downloadMultiple, copyToClipboard, shareViaWebAPI };
}
