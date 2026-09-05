"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RotateCcw, X, Heart, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedPolaroidStrip } from "./AnimatedPolaroidStrip";
import { fireBigConfetti, fireHeartConfetti } from "@/lib/confetti";

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frames: HTMLCanvasElement[];
  resultComposite: HTMLCanvasElement | null;
  onDownloadStrip: () => Promise<void>;
  onDownloadAll: () => Promise<void>;
  onNewSession: () => void;
}

export function ResultModal({
  open,
  onOpenChange,
  frames,
  resultComposite,
  onDownloadStrip,
  onDownloadAll,
  onNewSession,
}: ResultModalProps) {
  const [downloading, setDownloading] = useState<"strip" | "all" | null>(null);

  useEffect(() => {
    if (open) {
      const t1 = setTimeout(() => fireHeartConfetti(), 300);
      const t2 = setTimeout(() => fireBigConfetti(), 1200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [open]);

  const handleDownloadStrip = async () => {
    setDownloading("strip");
    await onDownloadStrip();
    setDownloading(null);
  };

  const handleDownloadAll = async () => {
    setDownloading("all");
    await onDownloadAll();
    setDownloading(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative bg-card border-[4px] border-border shadow-clay-xl rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden mx-4 flex flex-col"
            initial={{ scale: 0.5, opacity: 0, y: 60, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40, rotate: 5 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
            }}
          >
            <motion.div
              className="flex-shrink-0 flex items-center justify-between p-5 border-b-[3px] border-border bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-primary text-primary-foreground border-[3px] border-orange-600 rounded-2xl p-2 shadow-clay"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                <div>
                  <h2 className="font-fredoka text-2xl font-bold text-foreground">
                    Your POLA GO Strip
                  </h2>
                  <p className="font-quicksand text-xs text-muted-foreground">
                    Made with{" "}
                    <Heart className="inline h-3 w-3 text-primary fill-primary" />{" "}
                    for your memories
                  </p>
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onOpenChange(false)}
                className="bg-muted border-[3px] border-border rounded-2xl p-2 shadow-clay-sm cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-foreground" />
              </motion.button>
            </motion.div>

            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background/50 to-card">
              {resultComposite ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                  className="bg-white rounded-2xl p-3 shadow-clay-xl border-[3px] border-border max-w-sm mx-auto"
                >
                  <img
                    src={resultComposite.toDataURL("image/png")}
                    alt="POLA GO Strip"
                    className="w-full h-auto rounded-xl"
                  />
                </motion.div>
              ) : (
                <AnimatedPolaroidStrip frames={frames} />
              )}
            </div>

            <motion.div
              className="flex-shrink-0 p-5 border-t-[3px] border-border bg-card/80 backdrop-blur-sm flex flex-col sm:flex-row gap-3"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleDownloadStrip}
                  disabled={downloading !== null}
                  className="w-full"
                >
                  {downloading === "strip" ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block"
                    >
                      ⏳
                    </motion.span>
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  {downloading === "strip"
                    ? "Saving 1080p..."
                    : "Download Strip (1080p)"}
                </Button>
              </motion.div>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleDownloadAll}
                  disabled={downloading !== null}
                  className="w-full"
                >
                  <ImageIcon className="h-5 w-5" />
                  {downloading === "all" ? "Saving..." : "All Photos"}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95, rotate: 2 }}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onNewSession}
                  aria-label="New Session"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
