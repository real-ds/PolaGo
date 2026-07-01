"use client";

import { useRef, useEffect, useMemo } from "react";
import { CompositeStyle } from "@/types";
import { FilterRegistry } from "@/core/filters/FilterRegistry";

interface BoothStageProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  layout: CompositeStyle;
  localFlipped?: boolean;
  activeFilterId?: string | null;
}

function VideoFeed({ stream, flipped, label, filterStyle, position }: {
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
    <div className="relative flex-1 min-w-0">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={position === "local"}
          className={`w-full h-full object-cover ${flipped ? "scale-x-[-1]" : ""}`}
          style={filterStyle ? { filter: filterStyle } : undefined}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <span className="text-gray-400 font-quicksand text-sm">
            {position === "remote" ? "Waiting for partner..." : "No camera"}
          </span>
        </div>
      )}
      {label && (
        <span className="absolute bottom-2 left-2 text-white text-xs font-quicksand bg-black/40 px-2 py-0.5 rounded-full">
          {label}
        </span>
      )}
    </div>
  );
}

export function BoothStage({ localStream, remoteStream, layout, localFlipped = true, activeFilterId }: BoothStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const filterStyle = useMemo(() => {
    if (!activeFilterId) return undefined;
    const filter = FilterRegistry.get(activeFilterId);
    return filter?.cssFilter;
  }, [activeFilterId]);

  if (layout === "split") {
    return (
      <div ref={containerRef} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 shadow-lg flex">
        <VideoFeed stream={localStream} flipped={localFlipped} label="You" filterStyle={filterStyle} position="local" />
        <div className="w-0.5 bg-pink-300 flex-shrink-0" />
        <VideoFeed stream={remoteStream} label="Partner" filterStyle={filterStyle} position="remote" />
      </div>
    );
  }

  if (layout === "pip") {
    return (
      <div ref={containerRef} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 shadow-lg">
        <VideoFeed stream={remoteStream || localStream} label={remoteStream ? "Partner" : undefined} filterStyle={filterStyle} position="remote" />
        <div className="absolute bottom-4 right-4 w-1/3 aspect-[4/3] rounded-xl overflow-hidden border-2 border-white shadow-lg">
          <VideoFeed stream={localStream} flipped={localFlipped} label="You" filterStyle={filterStyle} position="local" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 shadow-lg">
      <VideoFeed stream={localStream} flipped={localFlipped} label="You" filterStyle={filterStyle} position="local" />
      {remoteStream && (
        <div className="absolute bottom-4 right-4 w-1/3 aspect-[4/3] rounded-xl overflow-hidden border-2 border-pink-300 shadow-lg">
          <VideoFeed stream={remoteStream} label="Partner" filterStyle={filterStyle} position="remote" />
        </div>
      )}
    </div>
  );
}
