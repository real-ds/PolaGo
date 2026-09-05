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
import { ThumbnailGallery } from "@/components/booth/ThumbnailGallery";
import { ResultModal } from "@/components/booth/ResultModal";
import { ShutterFlash } from "@/components/booth/ShutterFlash";
import { CompositeStyle } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createSignalingTransport } from "@/lib/signaling";
import { FilterRegistry } from "@/core/filters/FilterRegistry";
import { ExportService } from "@/core/export/ExportService";
import { generateFilename } from "@/lib/utils";
import { SplitScreenComposite } from "@/core/compositor/implementations/SplitScreenComposite";
import { PictureInPictureComposite } from "@/core/compositor/implementations/PictureInPictureComposite";
import { HeartFrameComposite } from "@/core/compositor/implementations/HeartFrameComposite";
import { CompositeStrategy } from "@/core/compositor/CompositeStrategy";
import { Camera, Download, ImageIcon, RotateCcw, Sparkles, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fireConfetti, fireBigConfetti } from "@/lib/confetti";

const SHOTS_TOTAL = 4;
const FRAME_W = 1920;
const FRAME_H = 1080;

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
  const [showPreview, setShowPreview] = useState(false);
  const [previewFrame, setPreviewFrame] = useState<HTMLCanvasElement | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const exportService = useRef(new ExportService());
  const shutterButtonRef = useRef<HTMLButtonElement>(null);

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
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 400);
    handleCapture();
  }, [handleCapture]);

  const handleShutter = useCallback(() => {
    setCountdownActive(true);
  }, []);

  const canShoot = ready && !countdownActive && !!localStream && shotCount < SHOTS_TOTAL;

  const resultCompositeRef = useRef<HTMLCanvasElement | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultComposite, setResultComposite] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    resultCompositeRef.current = resultComposite;
  }, [resultComposite]);

  const handleDownload = useCallback(async () => {
    if (!resultCompositeRef.current) return;
    setDownloading(true);
    try {
      await exportService.current.download(resultCompositeRef.current, "png");
    } catch (err) {
      console.error("Download failed:", err);
    }
    setDownloading(false);
  }, []);

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

  const handleViewResult = useCallback(() => {
    if (capturedFrames.length === 0) return;
    const composite = document.createElement("canvas");
    const stripWidth = 1080;
    const gap = 16;
    const frameHeight = 1080;
    const totalHeight = capturedFrames.length * frameHeight + (capturedFrames.length - 1) * gap + 160;
    composite.width = stripWidth;
    composite.height = totalHeight;
    const ctx = composite.getContext("2d")!;

    ctx.fillStyle = "#fff7ed";
    ctx.fillRect(0, 0, composite.width, composite.height);

    ctx.fillStyle = "#f97316";
    ctx.font = "bold 72px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("POLA GO", composite.width / 2, 72);

    capturedFrames.forEach((frame, i) => {
      const y = 100 + i * (frameHeight + gap);
      const polaroidX = 40;
      const polaroidW = stripWidth - 80;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(polaroidX, y, polaroidW, frameHeight, 16);
      ctx.fill();
      ctx.shadowBlur = 0;

      const imgX = polaroidX + 24;
      const imgMaxW = polaroidW - 48;
      const imgMaxH = frameHeight - 96;
      const imgAspect = frame.width / frame.height;
      let drawW = imgMaxW;
      let drawH = drawW / imgAspect;
      if (drawH > imgMaxH) {
        drawH = imgMaxH;
        drawW = drawH * imgAspect;
      }
      const drawX = imgX + (imgMaxW - drawW) / 2;
      const drawY = y + 24 + (imgMaxH - drawH) / 2;
      ctx.drawImage(frame, drawX, drawY, drawW, drawH);

      ctx.fillStyle = "#f97316";
      ctx.font = "24px Quicksand, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`#${i + 1}`, imgX, y + frameHeight - 24);
      ctx.textAlign = "right";
      ctx.fillText(new Date().toLocaleDateString(), imgX + imgMaxW, y + frameHeight - 24);
    });

    setResultComposite(composite);
    resultCompositeRef.current = composite;
    setShowResult(true);
    setTimeout(() => fireBigConfetti(), 300);
  }, [capturedFrames]);

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4 bg-background">
      <ShutterFlash active={showFlash} />

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex items-center justify-between max-w-6xl mx-auto w-full"
      >
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-primary text-primary-foreground border-[3px] border-orange-600 rounded-2xl p-2 shadow-clay">
            <Camera className="h-5 w-5" />
          </div>
          <h1 className="font-fredoka text-xl font-semibold text-foreground">
            POLA GO
          </h1>
        </motion.div>
        <div className="flex items-center gap-3">
          <ConnectionStatusBadge status={peer.status} />
          <motion.select
            value={layout}
            onChange={(e) => setLayout(e.target.value as CompositeStyle)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm px-3 py-2 rounded-xl border-[3px] border-border bg-card text-card-foreground font-quicksand font-medium shadow-clay-sm cursor-pointer"
          >
            <option value="split">Split</option>
            <option value="pip">PiP</option>
            <option value="heart">Heart</option>
          </motion.select>
        </div>
      </motion.header>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.1 }}
        className="flex-1 relative max-w-4xl mx-auto w-full"
      >
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 rounded-3xl"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              📷
            </motion.div>
            <p className="text-white font-quicksand text-base mb-4">Camera not active</p>
            <Button
              variant="default"
              onClick={() => startCamera()}
              className="shadow-clay"
            >
              Enable Camera
            </Button>
          </motion.div>
        )}
        {cameraError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 rounded-3xl p-6"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-4"
            >
              😢
            </motion.div>
            <p className="text-red-300 font-quicksand text-sm text-center mb-2 max-w-xs">
              {cameraError}
            </p>
            <p className="text-white/60 font-quicksand text-xs text-center mb-4">
              Make sure you're accessing over HTTPS and have allowed camera access.
            </p>
            <Button
              variant="default"
              onClick={() => startCamera()}
              className="shadow-clay"
            >
              Try Again
            </Button>
          </motion.div>
        )}
      </motion.div>

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

      <AnimatePresence mode="popLayout">
        {capturedFrames.length > 0 && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto w-full"
          >
            <ThumbnailGallery frames={capturedFrames} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.2 }}
      >
        <Card className="max-w-4xl mx-auto w-full">
          <CardContent className="p-5 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {showPreview && previewFrame && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden border-[3px] border-secondary shadow-clay-xl"
                  >
                    <img src={previewFrame.toDataURL()} alt="Preview" className="w-full" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>
                  <div className="flex justify-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={handleRetake}>
                        Retake
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleConfirmCapture}
                      >
                        <PartyPopper className="h-4 w-4" />
                        {shotCount === SHOTS_TOTAL - 1 ? "Finish" : "Use This"}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {!showPreview && !showResult && (
                <motion.div
                  key="controls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <FilterCarousel
                    filters={filters}
                    activeFilterId={activeFilterId}
                    onSelect={setActiveFilter}
                  />
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <ReadyButton ready={ready} onToggle={handleReadyToggle} />
                      <motion.div
                        whileHover={{ scale: canShoot ? 1.1 : 1 }}
                        whileTap={{ scale: canShoot ? 0.9 : 1 }}
                        animate={canShoot ? {
                          boxShadow: [
                            "0 0 0 0 rgba(249, 115, 22, 0.4)",
                            "0 0 0 15px rgba(249, 115, 22, 0)",
                          ],
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ShutterButton
                          onClick={handleShutter}
                          disabled={!canShoot}
                        />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-center"
                    >
                      <span className="font-fredoka text-sm text-primary font-semibold">
                        Shot {shotCount}/{SHOTS_TOTAL}
                      </span>
                      <div className="flex gap-1.5 mt-1">
                        {[...Array(SHOTS_TOTAL)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className={`w-2.5 h-2.5 rounded-full border-[2px] ${
                              i < shotCount
                                ? "bg-primary border-primary"
                                : "bg-transparent border-border"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {shotCount === SHOTS_TOTAL && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="default"
                            size="lg"
                            onClick={handleViewResult}
                            className="w-full"
                          >
                            <Sparkles className="h-5 w-5" />
                            View Strip & Download
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <ResultModal
        open={showResult}
        onOpenChange={setShowResult}
        frames={capturedFrames}
        resultComposite={resultComposite}
        onDownloadStrip={handleDownload}
        onDownloadAll={handleDownloadAll}
        onNewSession={handleNewSession}
      />
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
