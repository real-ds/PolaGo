"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownOverlayProps {
  active: boolean;
  from: number;
  onComplete: () => void;
}

export function CountdownOverlay({ active, from, onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!active) {
      setCount(from);
      return;
    }
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [active, count, from, onComplete]);

  return (
    <AnimatePresence>
      {active && count > 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key={count}
            className="text-white font-fredoka text-8xl"
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {count}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
