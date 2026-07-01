"use client";

import { motion } from "framer-motion";

interface ShutterButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function ShutterButton({ onClick, disabled = false, label = "Ready" }: ShutterButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      className="relative w-16 h-16 rounded-full bg-pink-400 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
    >
      <span className="w-12 h-12 rounded-full border-2 border-white" />
      <span className="sr-only">{label}</span>
    </motion.button>
  );
}
