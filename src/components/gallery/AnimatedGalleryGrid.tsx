"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { GalleryEntry } from "@/core/gallery/GalleryManager";
import { Download, Trash2, Eye } from "lucide-react";

interface AnimatedGalleryGridProps {
  entries: GalleryEntry[];
  onRetake?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export function AnimatedGalleryGrid({
  entries,
  onDelete,
}: AnimatedGalleryGridProps) {
  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-6xl mb-4"
        >
          📸
        </motion.div>
        <p className="font-quicksand text-muted-foreground">
          No photos yet. Start a session to capture memories!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {entries.map((entry, i) => (
        <GalleryCard
          key={`${entry.index}-${entry.createdAt}`}
          entry={entry}
          index={i}
          onDelete={onDelete ? () => onDelete(entry.index) : undefined}
        />
      ))}
    </motion.div>
  );
}

function GalleryCard({
  entry,
  index,
  onDelete,
}: {
  entry: GalleryEntry;
  index: number;
  onDelete?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);
  const yOffset = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateZ, y: yOffset }}
      initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 14,
        delay: index * 0.08,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative"
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -6 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="bg-white rounded-2xl p-2.5 shadow-clay border-[3px] border-border overflow-hidden cursor-pointer"
      >
        <div className="aspect-[4/3] bg-muted rounded-xl overflow-hidden relative">
          <motion.img
            src={entry.dataUrl}
            alt={`Photo ${entry.index + 1}`}
            className="w-full h-full object-cover"
            animate={hovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-2"
          >
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                const a = document.createElement("a");
                a.href = entry.dataUrl;
                a.download = `pola-go-${entry.index + 1}.png`;
                a.click();
              }}
              className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-clay-sm border-[2px] border-orange-600"
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </motion.button>
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-clay-sm border-[2px] border-red-700"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 + 0.3 }}
          className="flex justify-between items-center mt-2 px-1.5"
        >
          <span className="font-fredoka text-xs text-primary font-bold">
            #{entry.index + 1}
          </span>
          <span className="font-quicksand text-[10px] text-muted-foreground">
            {new Date(entry.createdAt).toLocaleDateString()}
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.08 + 0.2, type: "spring" }}
        className="absolute -top-2 -left-2 bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-[2px] border-orange-500 shadow-clay-sm z-10"
      >
        {index + 1}
      </motion.div>
    </motion.div>
  );
}
