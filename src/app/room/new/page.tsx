"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { RoomProvider, useRoomContext } from "@/context/RoomContext";
import { RoomShareCard } from "@/components/room/RoomShareCard";
import { WaitingForPartner } from "@/components/room/WaitingForPartner";
import { Camera, Plus, ArrowRight, Sparkles } from "lucide-react";

function NewRoomContent() {
  const router = useRouter();
  const { createRoom, roomId, partnerPresent } = useRoomContext();
  const [creating, setCreating] = useState(false);
  const [joinSlug, setJoinSlug] = useState("");
  const [isInsecureContext, setIsInsecureContext] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isHttps = window.location.protocol.includes("https");
      const isLocalhost = window.location.hostname.includes("localhost") ||
                         window.location.hostname.includes("127.0.0.1");
      setIsInsecureContext(!isHttps && !isLocalhost);
    }
  }, []);

  const handleCreateRoom = async () => {
    setCreating(true);
    try {
      await createRoom();
    } catch (err) {
      console.error("Failed to create room:", err);
    } finally {
      setCreating(false);
    }
  };

  const roomLink = roomId ? `${window.location.origin}/room/${roomId}` : null;

  if (roomId && roomLink) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 18 }}
        className="flex flex-col items-center gap-6 w-full"
      >
        <RoomShareCard roomId={roomId} roomLink={roomLink} />
        {!partnerPresent && <WaitingForPartner />}
        {partnerPresent && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-fredoka text-green-700 text-xl font-bold mb-3 flex items-center gap-2 justify-center"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.span>
              Your partner has joined!
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.span>
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="default"
                size="lg"
                onClick={() => router.push(`/room/${roomId}?role=host`)}
              >
                Go to Booth
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
      <div className="flex flex-col items-center gap-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-clay-xl border-[3px]">
            <CardContent className="p-8 text-center flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="bg-primary text-primary-foreground border-[3px] border-orange-600 rounded-3xl p-4 shadow-clay"
              >
                <Plus className="h-8 w-8" />
              </motion.div>
              <CardTitle className="text-3xl">Start a New Room</CardTitle>
              <CardDescription className="text-base">
                Create a private room and share the link with your partner to
                begin your photo session.
              </CardDescription>
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className="w-full"
              >
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleCreateRoom}
                  disabled={creating}
                  className="w-full shadow-clay"
                >
                  <Camera className="h-5 w-5" />
                  {creating ? "Creating..." : "Create Room"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {isInsecureContext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md bg-secondary/10 border-[3px] border-secondary rounded-2xl p-4 text-center"
          >
            <p className="font-quicksand text-xs text-foreground font-semibold">
              💡 Mobile devices need HTTPS for camera access. Run{" "}
              <code className="bg-card px-1.5 py-0.5 rounded font-mono">npm run dev:ngrok</code>{" "}
              to share a secure link.
            </p>
          </motion.div>
        )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="font-quicksand text-xs text-muted-foreground font-medium">
            or join an existing room
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={joinSlug}
            onChange={(e) => setJoinSlug(e.target.value)}
            placeholder="Paste room link or code"
            className="flex-1"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const slug = joinSlug.trim().split("/").pop() || joinSlug.trim();
                if (slug) router.push(`/room/${slug}`);
              }}
              disabled={!joinSlug.trim()}
            >
              <ArrowRight className="h-5 w-5" />
              Join
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function NewRoomPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 30% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      />

      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-10 left-10 text-4xl opacity-30"
      >
        📸
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 right-10 text-4xl opacity-30"
      >
        💕
      </motion.div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="font-fredoka text-4xl font-bold text-foreground mb-8 flex items-center gap-3 z-10"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="bg-primary text-primary-foreground border-[3px] border-orange-600 rounded-2xl p-2 shadow-clay"
        >
          <Camera className="h-7 w-7" />
        </motion.div>
        POLA GO
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="h-6 w-6 text-secondary" />
        </motion.div>
      </motion.h1>

      <RoomProvider>
        <NewRoomContent />
      </RoomProvider>
    </div>
  );
}
