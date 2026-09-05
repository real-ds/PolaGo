"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ShutterFlashProps {
  active: boolean;
}

export function ShutterFlash({ active }: ShutterFlashProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[60] pointer-events-none"
          initial={{ opacity: 0, backgroundColor: "rgba(255, 255, 255, 0)" }}
          animate={{
            opacity: [0, 1, 1, 0],
            backgroundColor: [
              "rgba(255, 255, 255, 0)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 1)",
              "rgba(255, 255, 255, 0)",
            ],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            times: [0, 0.1, 0.3, 1],
          }}
        />
      )}
    </AnimatePresence>
  );
}
