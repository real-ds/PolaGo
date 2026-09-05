"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CompositeStyle } from "@/types";
import { FilterRegistry } from "@/core/filters/FilterRegistry";
import { User, Users } from "lucide-react";

interface BoothStageProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  layout: CompositeStyle;
  localFlipped?: boolean;
  activeFilterId?: string | null;
}

function VideoFeed({
  stream,
  flipped,
  label,
  filterStyle,
  position,
}: {
  stream: MediaStream | null;
  flipped?: boolean;
  label?: string;
  filterStyle?: string;
  position: "local" | "remote";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative flex-1 min-w-0 min-h-0">
      <AnimatePresence mode="wait">
        {stream ? (
          <motion.video
            key="video"
            ref={videoRef}
            autoPlay
            playsInline
            muted={position === "local"}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className={`w-full h-full object-cover ${flipped ? "scale-x-[-1]" : ""}`}
            style={filterStyle ? { filter: filterStyle } : undefined}
          />
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 border-[3px] border-border"
          >
            {position === "remote" ? (
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="h-16 w-16 text-muted-foreground mb-3" />
              </motion.div>
            ) : (
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <User className="h-16 w-16 text-muted-foreground mb-3" />
              </motion.div>
            )}
            <span className="text-muted-foreground font-quicksand text-sm">
              {position === "remote"
                ? "Waiting for partner..."
                : "No camera"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-3 left-3 text-white text-xs font-quicksand font-bold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30"
        >
          {label}
        </motion.span>
      )}
      {stream && position === "local" && (
        <motion.div
          className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-500 border border-white/50"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

export function BoothStage({
  localStream,
  remoteStream,
  layout,
  localFlipped = true,
  activeFilterId,
}: BoothStageProps) {
  const filterStyle = useMemo(() => {
    if (!activeFilterId) return undefined;
    const filter = FilterRegistry.get(activeFilterId);
    return filter?.cssFilter;
  }, [activeFilterId]);

  if (layout === "split") {
    return (
      <motion.div
        key="split"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-[3px] border-border shadow-clay-xl bg-gray-900 flex"
      >
        <VideoFeed
          stream={localStream}
          flipped={localFlipped}
          label="You"
          filterStyle={filterStyle}
          position="local"
        />
        <motion.div
          animate={{
            background: [
              "linear-gradient(to bottom, transparent, rgba(251, 146, 60, 0.8), transparent)",
            ],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[3px] flex-shrink-0"
        />
        <VideoFeed
          stream={remoteStream}
          label="Partner"
          filterStyle={filterStyle}
          position="remote"
        />
      </motion.div>
    );
  }

  if (layout === "pip") {
    return (
      <motion.div
        key="pip"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-[3px] border-border shadow-clay-xl bg-gray-900"
      >
        <VideoFeed
          stream={remoteStream || localStream}
          label={remoteStream ? "Partner" : undefined}
          filterStyle={filterStyle}
          position="remote"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-4 right-4 w-1/3 aspect-[4/3] rounded-2xl overflow-hidden border-[3px] border-secondary shadow-clay-lg"
        >
          <VideoFeed
            stream={localStream}
            flipped={localFlipped}
            label="You"
            filterStyle={filterStyle}
            position="local"
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="heart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-[3px] border-border shadow-clay-xl bg-gray-900"
    >
      <VideoFeed
        stream={localStream}
        flipped={localFlipped}
        label="You"
        filterStyle={filterStyle}
        position="local"
      />
      {remoteStream && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-4 right-4 w-1/3 aspect-[4/3] rounded-2xl overflow-hidden border-[3px] border-secondary shadow-clay-lg"
        >
          <VideoFeed
            stream={remoteStream}
            label="Partner"
            filterStyle={filterStyle}
            position="remote"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
