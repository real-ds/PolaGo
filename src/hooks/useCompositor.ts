"use client";

import { useState, useCallback } from "react";
import { CompositeStrategy } from "@/core/compositor/CompositeStrategy";
import { SplitScreenComposite } from "@/core/compositor/implementations/SplitScreenComposite";
import { PictureInPictureComposite } from "@/core/compositor/implementations/PictureInPictureComposite";
import { HeartFrameComposite } from "@/core/compositor/implementations/HeartFrameComposite";
import { CompositeStyle } from "@/types";

const strategies: Record<CompositeStyle, CompositeStrategy> = {
  split: new SplitScreenComposite(),
  pip: new PictureInPictureComposite(),
  heart: new HeartFrameComposite(),
};

interface UseCompositorReturn {
  activeStyle: CompositeStyle;
  setStyle: (style: CompositeStyle) => void;
  compose: (local: HTMLCanvasElement, remote: HTMLCanvasElement, target: HTMLCanvasElement) => void;
}

export function useCompositor(): UseCompositorReturn {
  const [activeStyle, setActiveStyle] = useState<CompositeStyle>("split");

  const setStyle = useCallback((style: CompositeStyle) => {
    setActiveStyle(style);
  }, []);

  const compose = useCallback(
    (local: HTMLCanvasElement, remote: HTMLCanvasElement, target: HTMLCanvasElement) => {
      strategies[activeStyle].compose(local, remote, target);
    },
    [activeStyle]
  );

  return { activeStyle, setStyle, compose };
}
