"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useGallery } from "@/hooks/useGallery";
import { AnimatedGalleryGrid } from "@/components/gallery/AnimatedGalleryGrid";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Camera, Sparkles, Heart, Images } from "lucide-react";

export default function GalleryPage() {
  const [roomId, setRoomId] = useState("");
  const { entries, loading, removeEntry, clearAll } = useGallery(roomId || undefined);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/10 via-secondary/5 to-background"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 30% 70%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 70%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 text-6xl opacity-20"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 text-6xl opacity-20"
        >
          💕
        </motion.div>

        <div className="text-center z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 12 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-primary text-primary-foreground border-[4px] border-orange-600 rounded-3xl p-4 shadow-clay-xl"
            >
              <Images className="h-10 w-10" />
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="font-fredoka text-5xl font-bold text-foreground mb-2"
          >
            Your Gallery
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-quicksand text-muted-foreground text-lg flex items-center justify-center gap-2"
          >
            <Heart className="h-4 w-4 text-primary fill-primary" />
            {entries.length} {entries.length === 1 ? "memory" : "memories"} captured
            <Heart className="h-4 w-4 text-primary fill-primary" />
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 pb-16 -mt-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          <Card className="shadow-clay-xl border-[3px]">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID to load gallery"
                  className="flex-1"
                />
                <Link href="/room/new">
                  <Button variant="default" size="lg">
                    <Camera className="h-5 w-5" />
                    New Session
                  </Button>
                </Link>
                {entries.length > 0 && (
                  <Button variant="destructive" size="lg" onClick={clearAll}>
                    Clear All
                  </Button>
                )}
              </div>

              {loading ? (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-center py-12"
                >
                  <span className="text-4xl">📸</span>
                  <p className="font-quicksand text-muted-foreground mt-2">
                    Loading your memories...
                  </p>
                </motion.div>
              ) : (
                <AnimatedGalleryGrid entries={entries} onDelete={removeEntry} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {entries.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <Link href="/room/new">
              <Button variant="secondary" size="lg" className="shadow-clay">
                <Sparkles className="h-5 w-5" />
                Start Your First Session
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
