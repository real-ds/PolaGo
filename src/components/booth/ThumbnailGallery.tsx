"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ThumbnailGalleryProps {
  frames: HTMLCanvasElement[];
  onRemove?: (index: number) => void;
}

export function ThumbnailGallery({ frames, onRemove }: ThumbnailGalleryProps) {
  if (frames.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-1">
      <AnimatePresence mode="popLayout">
        {frames.map((frame, i) => (
          <ThumbnailItem
            key={i}
            frame={frame}
            index={i}
            onRemove={onRemove ? () => onRemove(i) : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ThumbnailItem({
  frame,
  index,
  onRemove,
}: {
  frame: HTMLCanvasElement;
  index: number;
  onRemove?: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.05,
      }}
      className="relative flex-shrink-0"
    >
      <div className="w-16 h-16 rounded-2xl bg-card border-[3px] border-border shadow-clay overflow-hidden">
        <img
          src={frame.toDataURL("image/jpeg", 0.8)}
          alt={`Shot ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-[2px] border-orange-600 shadow-clay-sm"
      >
        {index + 1}
      </motion.div>
      {onRemove && (
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-clay-sm opacity-0 hover:opacity-100 transition-opacity"
        >
          ×
        </motion.button>
      )}
    </motion.div>
  );
}
