"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

export function WaitingForPartner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="bg-card border-[3px] border-border rounded-full p-4 shadow-clay">
        <Users className="h-8 w-8 text-primary" />
      </div>
      <motion.div
        className="flex gap-2"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="w-3 h-3 bg-primary rounded-full" />
        <span className="w-3 h-3 bg-secondary rounded-full animation-delay-200" />
        <span className="w-3 h-3 bg-accent rounded-full animation-delay-400" />
      </motion.div>
      <p className="font-quicksand text-foreground text-lg font-medium">
        Waiting for your partner to join...
      </p>
      <p className="font-quicksand text-muted-foreground text-sm">
        Share the room link to get started
      </p>
    </div>
  );
}
