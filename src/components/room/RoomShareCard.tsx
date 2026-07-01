"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface RoomShareCardProps {
  roomId: string;
  roomLink: string;
}

export function RoomShareCard({ roomId, roomLink }: RoomShareCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: roomLink });
      } catch {
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card variant="cute" className="p-6 text-center max-w-md mx-auto">
      <h3 className="font-fredoka text-xl text-pink-700 mb-2">Your Room is Ready!</h3>
      <p className="font-quicksand text-gray-500 text-sm mb-4">
        Share this link with your partner to start your photo session
      </p>
      <div className="bg-white rounded-xl p-3 mb-4 border border-pink-100">
        <code className="font-mono text-sm text-pink-600 break-all">{roomLink}</code>
      </div>
      <div className="flex gap-3 justify-center">
        <Button variant="primary" size="md" onClick={handleCopyLink}>
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        {typeof navigator.share === "function" && (
          <Button variant="secondary" size="md" onClick={handleShare}>
            Share
          </Button>
        )}
      </div>
    </Card>
  );
}
