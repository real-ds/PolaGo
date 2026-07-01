"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { RoomProvider, useRoomContext } from "@/context/RoomContext";
import { useCamera } from "@/hooks/useCamera";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import { useFilterEngine } from "@/hooks/useFilterEngine";
import { BoothStage } from "@/components/booth/BoothStage";
import { CountdownOverlay } from "@/components/booth/CountdownOverlay";
import { ShutterButton } from "@/components/booth/ShutterButton";
import { ReadyButton } from "@/components/booth/ReadyButton";
import { FilterCarousel } from "@/components/filters/FilterCarousel";
import { ConnectionStatusBadge } from "@/components/room/ConnectionStatusBadge";
import { CompositeStyle } from "@/types";
import { Card } from "@/components/ui/Card";
import { createSignalingTransport } from "@/lib/signaling";
import { FilterRegistry } from "@/core/filters/FilterRegistry";
import { ExportService } from "@/core/export/ExportService";
import { generateFilename } from "@/lib/utils";
import { SplitScreenComposite } from "@/core/compositor/implementations/SplitScreenComposite";
import { PictureInPictureComposite } from "@/core/compositor/implementations/PictureInPictureComposite";
import { HeartFrameComposite } from "@/core/compositor/implementations/HeartFrameComposite";
import { CompositeStrategy } from "@/core/compositor/CompositeStrategy";

const SHOTS_TOTAL = 4;
const FRAME_W = 640;
const FRAME_H = 480;

const strategies: Record<CompositeStyle, CompositeStrategy> = {
  split: new SplitScreenComposite(),
  pip: new PictureInPictureComposite(),
  heart: new HeartFrameComposite(),
};

function captureFilteredComposite(
  localVideo: HTMLVideoElement,
  remoteVideo: HTMLVideoElement | null,
  filterId: string | null,
  layout: CompositeStyle,
  width = FRAME_W,
  height = FRAME_H
): HTMLCanvasElement {
  const localCanvas = document.createElement("canvas");
  localCanvas.width = width;
  localCanvas.height = height;
  const localCtx = localCanvas.getContext("2d")!;
  localCtx.drawImage(localVideo, 0, 0, width, height);

  const target = document.createElement("canvas");
  target.width = width;
  target.height = height;

  if (remoteVideo && remoteVideo.videoWidth) {
    const remoteCanvas = document.createElement("canvas");
    remoteCanvas.width = width;
    remoteCanvas.height = height;
    const remoteCtx = remoteCanvas.getContext("2d")!;
    remoteCtx.drawImage(remoteVideo, 0, 0, width, height);
    strategies[layout].compose(localCanvas, remoteCanvas, target);
  } else {
    const ctx = target.getContext("2d")!;
    ctx.drawImage(localCanvas, 0, 0);
  }

  if (filterId) {
    const filter = FilterRegistry.get(filterId);
    if (filter) {
      filter.apply(target.getContext("2d")!, width, height);
    }
  }

  return target;
}

function BoothRoomContent() {
  const params = useParams<{ roomId: string }>();
  const searchParams = useSearchParams();
  const { roomService, role, joinRoom, hostRoom, connected, partnerPresent } = useRoomContext();
  const {
    stream: localStream,
    startCamera,
    error: cameraError,
    loading: cameraLoading,
  } = useCamera();
  const [ready, setReady] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [shotCount, setShotCount] = useState(0);
  const [layout, setLayout] = useState<CompositeStyle>("split");
  const { filters, activeFilterId, setActiveFilter } = useFilterEngine();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [capturedFrames, setCapturedFrames] = useState<HTMLCanvasElement[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [resultComposite, setResultComposite] = useState<HTMLCanvasElement | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFrame, setPreviewFrame] = useState<HTMLCanvasElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const exportService = useRef(new ExportService());

  const transport = roomService?.getTransport();
  const peer = usePeerConnection(transport ?? createSignalingTransport());

  useEffect(() => {
    if (params.roomId && !connected) {
      const userRole = searchParams.get("role");
      if (userRole === "host") {
        hostRoom(params.roomId);
      } else {
        joinRoom(params.roomId);
      }
    }
  }, [params.roomId, connected, joinRoom, hostRoom, searchParams]);

  useEffect(() => {
    if (connected && !cameraLoading && !cameraError && !localStream) {
      startCamera();
    }
  }, [connected, cameraLoading, cameraError, localStream, startCamera]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && peer.remoteStream) {
      remoteVideoRef.current.srcObject = peer.remoteStream;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [peer.remoteStream]);

  useEffect(() => {
    if (!localStream || !partnerPresent) return;
    if (role === "host" && peer.status === "idle") {
      peer.initiateConnection(localStream);
    } else if (role === "guest" && peer.status === "idle") {
      peer.acceptConnection(localStream);
    }
  }, [localStream, partnerPresent, role, peer]);

  const handleReadyToggle = useCallback(() => {
    const newReady = !ready;
    setReady(newReady);
    roomService?.sendReadyState(newReady);
  }, [ready, roomService]);

  const handleCapture = useCallback(() => {
    const localEl = localVideoRef.current;
    if (!localEl || !localEl.videoWidth) return;

    const remoteEl = remoteVideoRef.current;
    const capture = captureFilteredComposite(
      localEl,
      remoteEl?.videoWidth ? remoteEl : null,
      activeFilterId,
      layout
    );
    setPreviewFrame(capture);
    setShowPreview(true);
  }, [activeFilterId, layout]);

  const handleConfirmCapture = useCallback(() => {
    if (previewFrame) {
      setCapturedFrames((prev) => [...prev, previewFrame!]);
      setShotCount((c) => Math.min(c + 1, SHOTS_TOTAL));
    }
    setShowPreview(false);
    setPreviewFrame(null);
  }, [previewFrame]);

  const handleRetake = useCallback(() => {
    setShowPreview(false);
    setPreviewFrame(null);
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setCountdownActive(false);
    handleCapture();
  }, [handleCapture]);

  const handleShutter = useCallback(() => {
    setCountdownActive(true);
  }, []);

  const canShoot = ready && !countdownActive && !!localStream && shotCount < SHOTS_TOTAL;

  const handleViewResult = useCallback(() => {
    if (capturedFrames.length === 0) return;
    const composite = document.createElement("canvas");
    const stripWidth = 400;
    const gap = 8;
    const frameHeight = 500;
    const totalHeight = capturedFrames.length * frameHeight + (capturedFrames.length - 1) * gap + 80;
    composite.width = stripWidth;
    composite.height = totalHeight;
    const ctx = composite.getContext("2d")!;

    ctx.fillStyle = "#fff5f7";
    ctx.fillRect(0, 0, composite.width, composite.height);

    ctx.fillStyle = "#ec4899";
    ctx.font = "bold 18px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("POLA GO", composite.width / 2, 36);

    capturedFrames.forEach((frame, i) => {
      const y = 56 + i * (frameHeight + gap);
      const polaroidX = 20;
      const polaroidW = stripWidth - 40;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.roundRect(polaroidX, y, polaroidW, frameHeight, 8);
      ctx.fill();
      ctx.shadowBlur = 0;

      const imgX = polaroidX + 12;
      const imgMaxW = polaroidW - 24;
      const imgMaxH = frameHeight - 48;
      const imgAspect = frame.width / frame.height;
      let drawW = imgMaxW;
      let drawH = drawW / imgAspect;
      if (drawH > imgMaxH) {
        drawH = imgMaxH;
        drawW = drawH * imgAspect;
      }
      const drawX = imgX + (imgMaxW - drawW) / 2;
      const drawY = y + 12 + (imgMaxH - drawH) / 2;
      ctx.drawImage(frame, drawX, drawY, drawW, drawH);

      ctx.fillStyle = "#ec4899";
      ctx.font = "10px Quicksand, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`#${i + 1}`, imgX, y + frameHeight - 16);
      ctx.textAlign = "right";
      ctx.fillText(new Date().toLocaleDateString(), imgX + imgMaxW, y + frameHeight - 16);
    });

    setResultComposite(composite);
    setShowResult(true);
  }, [capturedFrames]);

  const handleDownload = useCallback(async () => {
    if (!resultComposite) return;
    setDownloading(true);
    try {
      await exportService.current.download(resultComposite, "png");
    } catch (err) {
      console.error("Download failed:", err);
    }
    setDownloading(false);
  }, [resultComposite]);

  const handleDownloadAll = useCallback(async () => {
    if (capturedFrames.length === 0) return;
    setDownloading(true);
    try {
      for (let i = 0; i < capturedFrames.length; i++) {
        const a = document.createElement("a");
        a.href = capturedFrames[i].toDataURL("image/png");
        a.download = generateFilename("png");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err) {
      console.error("Download all failed:", err);
    }
    setDownloading(false);
  }, [capturedFrames]);

  const handleNewSession = useCallback(() => {
    setCapturedFrames([]);
    setShotCount(0);
    setShowResult(false);
    setResultComposite(null);
    setReady(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <header className="flex items-center justify-between">
        <h1 className="font-fredoka text-xl text-pink-600">POLA GO</h1>
        <div className="flex items-center gap-3">
          <ConnectionStatusBadge status={peer.status} />
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value as CompositeStyle)}
            className="text-xs px-2 py-1 rounded-lg border border-pink-200 bg-white font-quicksand"
          >
            <option value="split">Split</option>
            <option value="pip">PiP</option>
            <option value="heart">Heart</option>
          </select>
        </div>
      </header>

      <div className="flex-1 relative">
        <BoothStage
          localStream={localStream}
          remoteStream={peer.remoteStream}
          layout={layout}
          activeFilterId={activeFilterId}
        />
        <CountdownOverlay
          active={countdownActive}
          from={3}
          onComplete={handleCountdownComplete}
        />

        {!localStream && !cameraLoading && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-2xl">
            <p className="text-white font-quicksand text-sm">Camera not available</p>
          </div>
        )}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 rounded-2xl">
            <p className="text-red-300 font-quicksand text-sm">{cameraError}</p>
          </div>
        )}
      </div>

      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute opacity-0 pointer-events-none"
        style={{ width: FRAME_W, height: FRAME_H }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute opacity-0 pointer-events-none"
        style={{ width: FRAME_W, height: FRAME_H }}
      />

      {capturedFrames.length > 0 && !showResult && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {capturedFrames.map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-lg bg-pink-100 border border-pink-200 flex items-center justify-center flex-shrink-0"
            >
              <span className="font-fredoka text-xs text-pink-500">#{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      <Card className="p-4 flex flex-col gap-3">
        {showPreview && previewFrame && (
          <div className="flex flex-col gap-2">
            <div className="relative w-full max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-pink-300">
              <img src={previewFrame.toDataURL()} alt="Preview" className="w-full" />
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-quicksand text-sm hover:bg-gray-200 transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleConfirmCapture}
                className="px-4 py-2 rounded-xl bg-pink-400 text-white font-quicksand text-sm hover:bg-pink-500 transition-colors"
              >
                {shotCount === SHOTS_TOTAL - 1 ? "Finish" : "Use This"}
              </button>
            </div>
          </div>
        )}

        {!showPreview && !showResult && (
          <>
            <FilterCarousel
              filters={filters}
              activeFilterId={activeFilterId}
              onSelect={setActiveFilter}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ReadyButton ready={ready} onToggle={handleReadyToggle} />
                <ShutterButton
                  onClick={handleShutter}
                  disabled={!canShoot}
                />
              </div>
              <div className="text-center">
                <span className="font-fredoka text-sm text-pink-600">
                  Shot {shotCount}/{SHOTS_TOTAL}
                </span>
              </div>
            </div>
            {shotCount === SHOTS_TOTAL && (
              <button
                onClick={handleViewResult}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-fredoka text-lg hover:from-pink-500 hover:to-purple-500 transition-all shadow-md"
              >
                View Strip & Download
              </button>
            )}
          </>
        )}
      </Card>

      {showResult && resultComposite && (
        <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="font-fredoka text-lg text-pink-600 text-center mb-3">Your POLA GO Strip</h2>
            <div className="rounded-xl overflow-hidden mb-4">
              <img src={resultComposite.toDataURL()} alt="Strip" className="w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3 rounded-xl bg-pink-400 text-white font-fredoka hover:bg-pink-500 transition-colors disabled:opacity-50"
              >
                {downloading ? "Downloading..." : "Download Strip"}
              </button>
              <button
                onClick={handleDownloadAll}
                disabled={downloading}
                className="w-full py-2 rounded-xl bg-purple-100 text-purple-600 font-quicksand text-sm hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                Download All Photos
              </button>
              <button
                onClick={handleNewSession}
                className="w-full py-2 rounded-xl bg-gray-100 text-gray-500 font-quicksand text-sm hover:bg-gray-200 transition-colors"
              >
                New Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoomPage() {
  return (
    <RoomProvider>
      <BoothRoomContent />
    </RoomProvider>
  );
}
