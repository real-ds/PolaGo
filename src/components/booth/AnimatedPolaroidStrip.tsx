"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedPolaroidStripProps {
  frames: HTMLCanvasElement[];
}

export function AnimatedPolaroidStrip({ frames }: AnimatedPolaroidStripProps) {
  return (
    <div className="space-y-3">
      {frames.map((frame, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 60, rotate: -8, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          transition={{
            delay: i * 0.18,
            type: "spring",
            stiffness: 120,
            damping: 14,
          }}
        >
          <PolaroidFrame frame={frame} index={i} />
        </motion.div>
      ))}
    </div>
  );
}

function PolaroidFrame({
  frame,
  index,
}: {
  frame: HTMLCanvasElement;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        rotate: index % 2 === 0 ? 1.5 : -1.5,
        y: -4,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl p-3 shadow-clay-xl border-[3px] border-border cursor-pointer"
    >
      <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden relative">
        <img
          src={frame.toDataURL("image/png")}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover"
        />
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent flex items-end justify-center pb-2"
          >
            <span className="text-white font-fredoka text-sm font-bold">
              📸 Snap!
            </span>
          </motion.div>
        )}
      </div>
      <div className="flex justify-between items-center mt-2 px-1">
        <span className="font-fredoka text-xs text-primary font-bold">
          #{index + 1}
        </span>
        <span className="font-quicksand text-xs text-muted-foreground">
          {new Date().toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
