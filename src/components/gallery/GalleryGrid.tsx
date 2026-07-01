"use client";

import { GalleryEntry } from "@/core/gallery/GalleryManager";

interface GalleryGridProps {
  entries: GalleryEntry[];
  onRetake?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export function GalleryGrid({ entries, onRetake, onDelete }: GalleryGridProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-quicksand text-gray-400">No photos yet. Start a session to capture memories!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {entries.map((entry) => (
        <div key={entry.index} className="relative group rounded-2xl overflow-hidden border border-pink-100">
          <img
            src={entry.dataUrl}
            alt={`Photo ${entry.index + 1}`}
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            {onRetake && (
              <button
                onClick={() => onRetake(entry.index)}
                className="px-3 py-1 bg-white rounded-full text-xs font-quicksand font-medium text-pink-600"
              >
                Retake
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(entry.index)}
                className="px-3 py-1 bg-red-400 rounded-full text-xs font-quicksand font-medium text-white"
              >
                Delete
              </button>
            )}
          </div>
          <span className="absolute top-2 left-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full font-quicksand">
            #{entry.index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}
