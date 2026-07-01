"use client";

import { useState, useCallback } from "react";
import { Layer } from "@/core/decoration/Layer";
import { StickerLayer } from "@/core/decoration/StickerLayer";
import { TextLayer, TextStyle } from "@/core/decoration/TextLayer";
import { FrameLayer } from "@/core/decoration/FrameLayer";
import { generateId } from "@/lib/utils";

interface UseDecorationCanvasReturn {
  layers: Layer[];
  addSticker: (x: number, y: number, imageSrc: string) => void;
  addText: (x: number, y: number, text: string, style?: Partial<TextStyle>) => void;
  addFrame: (x: number, y: number, imageSrc: string) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  bringToFront: (id: string) => void;
  renderAll: (ctx: CanvasRenderingContext2D) => void;
  clearAll: () => void;
}

export function useDecorationCanvas(): UseDecorationCanvasReturn {
  const [layers, setLayers] = useState<Layer[]>([]);

  const addSticker = useCallback((x: number, y: number, imageSrc: string) => {
    const layer = new StickerLayer(generateId(), x, y, imageSrc);
    setLayers((prev) => [...prev, layer]);
  }, []);

  const addText = useCallback((x: number, y: number, text: string, style?: Partial<TextStyle>) => {
    const layer = new TextLayer(generateId(), x, y, text, style);
    setLayers((prev) => [...prev, layer]);
  }, []);

  const addFrame = useCallback((x: number, y: number, imageSrc: string) => {
    const layer = new FrameLayer(generateId(), x, y, imageSrc, 0, 0);
    setLayers((prev) => [...prev, layer]);
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        Object.assign(l, updates);
        return l;
      })
    );
  }, []);

  const bringToFront = useCallback((id: string) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.push(item);
      return copy;
    });
  }, []);

  const renderAll = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      [...layers]
        .sort((a, b) => a.zIndex - b.zIndex)
        .forEach((layer) => layer.render(ctx));
    },
    [layers]
  );

  const clearAll = useCallback(() => {
    setLayers([]);
  }, []);

  return {
    layers,
    addSticker,
    addText,
    addFrame,
    removeLayer,
    updateLayer,
    bringToFront,
    renderAll,
    clearAll,
  };
}
