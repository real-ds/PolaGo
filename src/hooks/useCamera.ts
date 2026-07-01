"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CameraService } from "@/core/camera/CameraService";

interface UseCameraReturn {
  stream: MediaStream | null;
  error: string | null;
  loading: boolean;
  facingMode: "user" | "environment";
  startCamera: (facing?: "user" | "environment") => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => Promise<void>;
  captureFrame: (width?: number, height?: number) => HTMLCanvasElement | null;
}

export function useCamera(): UseCameraReturn {
  const serviceRef = useRef(new CameraService());
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const startCamera = useCallback(async (facing?: "user" | "environment") => {
    setLoading(true);
    setError(null);
    try {
      const s = await serviceRef.current.startStream(facing ?? facingMode);
      setStream(s);
      setFacingMode(serviceRef.current.getFacingMode());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    serviceRef.current.stopStream();
    setStream(null);
  }, []);

  const switchCamera = useCallback(async () => {
    setLoading(true);
    try {
      const s = await serviceRef.current.switchCamera();
      setStream(s);
      setFacingMode(serviceRef.current.getFacingMode());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const captureFrame = useCallback((width = 640, height = 480) => {
    try {
      return serviceRef.current.captureFrame(width, height);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    return () => {
      serviceRef.current.stopStream();
    };
  }, []);

  return { stream, error, loading, facingMode, startCamera, stopCamera, switchCamera, captureFrame };
}
