"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Camera,
  Heart,
  Sparkles,
  Share2,
  Image as ImageIcon,
  Download,
  Zap,
  Stars,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/Card";

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="font-fredoka text-2xl font-bold text-foreground flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-primary text-primary-foreground border-[3px] border-orange-600 rounded-2xl p-2 shadow-clay"
            >
              <Camera className="h-5 w-5" />
            </motion.div>
            POLA GO
          </Link>
        </motion.div>
        <nav className="flex gap-3">
          <Link href="/gallery">
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
              Gallery
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              Settings
            </Button>
          </Link>
        </nav>
      </motion.header>

      <motion.section
        ref={heroRef}
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="relative flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto w-full pt-8 pb-16 min-h-[80vh]"
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.12) 0%, transparent 40%)",
              "radial-gradient(circle at 80% 70%, rgba(37, 99, 235, 0.12) 0%, transparent 40%)",
              "radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.12) 0%, transparent 40%)",
              "radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.12) 0%, transparent 40%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-4xl md:text-5xl opacity-40"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -15, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-32 right-12 text-4xl md:text-5xl opacity-40"
        >
          💕
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-32 left-16 text-3xl md:text-4xl opacity-40"
        >
          📸
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-card text-card-foreground border-[3px] border-border shadow-clay rounded-full px-5 py-2 mb-6 text-sm font-quicksand font-bold"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Heart className="h-4 w-4 text-primary fill-primary" />
          </motion.span>
          For long-distance couples
        </motion.div>

        <motion.h1
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
          className="font-fredoka text-6xl md:text-8xl text-foreground mb-6 leading-[0.95] font-bold"
        >
          <motion.span
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            Snap
          </motion.span>{" "}
          <span className="text-primary">Together</span>
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-quicksand text-lg md:text-xl text-muted-foreground max-w-xl mb-2"
        >
          A shared virtual photo booth for you and your partner — no matter the
          distance.
        </motion.p>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-quicksand text-sm text-muted-foreground mb-10 max-w-md"
        >
          Create a room, share a link, and capture 4 polaroid-style photos
          together in real time.
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/room/new">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <Button variant="default" size="xl" className="shadow-clay-xl">
                <Camera className="h-6 w-6" />
                Start a Room
              </Button>
            </motion.div>
          </Link>
          <Link href="/room/new">
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <Button variant="outline" size="xl" className="shadow-clay">
                <Heart className="h-6 w-6" />
                Join a Room
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.section>

      <section className="py-20 px-6 bg-gradient-to-b from-background via-card/30 to-background">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-foreground mb-3">
            How it works ✨
          </h2>
          <p className="font-quicksand text-muted-foreground">
            Three simple steps to capture memories together
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Share2 className="h-7 w-7" />,
              title: "Create & Share",
              description: "Start a private room and send the link to your partner.",
              color: "from-orange-400 to-orange-600",
              delay: 0,
            },
            {
              icon: <Sparkles className="h-7 w-7" />,
              title: "Pose Together",
              description:
                "See each other live, sync a countdown, and snap 4 polaroids.",
              color: "from-blue-400 to-blue-600",
              delay: 0.15,
            },
            {
              icon: <Download className="h-7 w-7" />,
              title: "Style & Export",
              description:
                "Add filters, stickers, frames and download your strip.",
              color: "from-pink-400 to-pink-600",
              delay: 0.3,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, rotate: -10 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: feature.delay,
              }}
              whileHover={{ y: -12, rotate: 0, scale: 1.03 }}
            >
              <Card className="text-left h-full shadow-clay">
                <CardContent className="p-6 flex flex-col gap-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white border-[3px] border-orange-600 shadow-clay w-fit`}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-center mb-12"
          >
            <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-foreground mb-3">
              Packed with magic
            </h2>
            <p className="font-quicksand text-muted-foreground">
              Every feature designed to make your moments unforgettable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                emoji: "🎬",
                title: "Realtime Together",
                desc: "See your partner live, side by side, no matter the miles.",
              },
              {
                emoji: "🎨",
                title: "9+ Filters",
                desc: "From vintage vibes to pastels, find your perfect look.",
              },
              {
                emoji: "📐",
                title: "5 Layouts",
                desc: "Polaroid strips, grids, hearts, splits — your call.",
              },
              {
                emoji: "📲",
                title: "1080p Downloads",
                desc: "High-quality strips ready to share with the world.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 14,
                  delay: i * 0.1,
                }}
                whileHover={{ scale: 1.04, y: -6 }}
              >
                <Card className="shadow-clay">
                  <CardContent className="p-6 flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut",
                      }}
                      className="text-5xl"
                    >
                      {item.emoji}
                    </motion.div>
                    <div>
                      <h3 className="font-fredoka text-xl font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="font-quicksand text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100 }}
        className="py-20 px-6 text-center bg-gradient-to-b from-background to-card/50"
      >
        <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-foreground mb-4">
          Ready to make memories?
        </h2>
        <p className="font-quicksand text-muted-foreground mb-8 max-w-md mx-auto">
          Create a room and invite your partner to join you. It only takes a
          moment.
        </p>
        <Link href="/room/new">
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="default" size="xl" className="shadow-clay-xl">
              <Zap className="h-6 w-6" />
              Get Started
            </Button>
          </motion.div>
        </Link>
      </motion.section>

      <footer className="text-center py-6 text-xs text-muted-foreground font-quicksand border-t-[3px] border-border bg-card/50">
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-block mr-1"
        >
          <Heart className="inline h-3 w-3 text-primary fill-primary" />
        </motion.span>
        Made for every couple counting down the days
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="inline-block ml-1"
        >
          <Heart className="inline h-3 w-3 text-primary fill-primary" />
        </motion.span>
      </footer>
    </div>
  );
}
