"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RoomProvider, useRoomContext } from "@/context/RoomContext";
import { RoomShareCard } from "@/components/room/RoomShareCard";
import { WaitingForPartner } from "@/components/room/WaitingForPartner";

function NewRoomContent() {
  const router = useRouter();
  const { createRoom, roomId, connected, partnerPresent } = useRoomContext();
  const [creating, setCreating] = useState(false);
  const [joinSlug, setJoinSlug] = useState("");

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
      <div className="flex flex-col items-center gap-6">
        <RoomShareCard roomId={roomId} roomLink={roomLink} />
        {!partnerPresent && <WaitingForPartner />}
        {partnerPresent && (
          <div className="text-center">
            <p className="font-fredoka text-green-600 text-lg mb-2">Your partner has joined!</p>
            <Button variant="primary" onClick={() => router.push(`/room/${roomId}?role=host`)}>
              Go to Booth
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <Card variant="cute" className="p-8 text-center max-w-md mx-auto">
        <h2 className="font-fredoka text-2xl text-pink-700 mb-2">Start a New Room</h2>
        <p className="font-quicksand text-gray-500 text-sm mb-6">
          Create a private room and share the link with your partner to begin your photo session.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={handleCreateRoom}
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Room"}
        </Button>
      </Card>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-pink-200" />
          <span className="font-quicksand text-xs text-gray-400">or join an existing room</span>
          <div className="flex-1 h-px bg-pink-200" />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={joinSlug}
            onChange={(e) => setJoinSlug(e.target.value)}
            placeholder="Paste room link or code"
            className="flex-1 px-4 py-3 bg-white border border-pink-200 rounded-xl font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <Button
            variant="secondary"
            onClick={() => {
              const slug = joinSlug.trim().split("/").pop() || joinSlug.trim();
              if (slug) router.push(`/room/${slug}`);
            }}
            disabled={!joinSlug.trim()}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NewRoomPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="font-fredoka text-3xl text-pink-600 mb-8">POLA GO</h1>
      <RoomProvider>
        <NewRoomContent />
      </RoomProvider>
    </div>
  );
}
