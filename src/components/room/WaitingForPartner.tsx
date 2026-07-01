"use client";

import { motion } from "framer-motion";

export function WaitingForPartner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        className="flex gap-2"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="w-3 h-3 bg-pink-400 rounded-full" />
        <span className="w-3 h-3 bg-purple-400 rounded-full animation-delay-200" />
        <span className="w-3 h-3 bg-pink-300 rounded-full animation-delay-400" />
      </motion.div>
      <p className="font-quicksand text-gray-500 text-lg">
        Waiting for your partner to join...
      </p>
      <p className="font-quicksand text-gray-400 text-sm">
        Share the room link to get started
      </p>
    </div>
  );
}
