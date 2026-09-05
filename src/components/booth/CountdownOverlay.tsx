"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownOverlayProps {
  active: boolean;
  from: number;
  onComplete: () => void;
}

export function CountdownOverlay({
  active,
  from,
  onComplete,
}: CountdownOverlayProps) {
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
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-20 rounded-3xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0) 0%, rgba(0,0,0,0.4) 100%)",
                "radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.3) 0%, rgba(0,0,0,0.4) 100%)",
                "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0) 0%, rgba(0,0,0,0.4) 100%)",
              ],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              className="relative"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 3, rotate: 180, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.span
                className="text-white font-fredoka font-bold text-[180px] md:text-[220px] tabular-nums leading-none"
                style={{
                  textShadow:
                    "0 0 40px rgba(249, 115, 22, 0.8), 0 0 80px rgba(251, 146, 60, 0.5), 4px 4px 0 rgba(0,0,0,0.3)",
                  WebkitTextStroke: "4px #f97316",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                {count}
              </motion.span>
            </motion.div>
          </AnimatePresence>

          {count === 1 && (
            <motion.div
              className="absolute bottom-10 text-white font-fredoka text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Smile! 📸
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
