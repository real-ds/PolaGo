"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";

interface ShutterButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function ShutterButton({
  onClick,
  disabled = false,
  label = "Capture",
}: ShutterButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      className="relative w-20 h-20 rounded-full bg-primary hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer
        border-[4px] border-orange-600 shadow-clay-button
        flex items-center justify-center
        transition-colors duration-200"
      aria-label={label}
    >
      <div className="w-14 h-14 rounded-full bg-white border-[3px] border-orange-200 flex items-center justify-center">
        <Camera className="h-6 w-6 text-primary" />
      </div>
      <span className="sr-only">{label}</span>
    </motion.button>
  );
}
