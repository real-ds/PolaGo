"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Copy, Share2, Check } from "lucide-react";

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
    } catch {}
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: roomLink });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className="max-w-md mx-auto w-full">
      <CardContent className="p-6 text-center flex flex-col items-center gap-4">
        <div className="bg-primary text-primary-foreground border-[3px] border-orange-600 rounded-3xl p-3 shadow-clay">
          <Share2 className="h-7 w-7" />
        </div>
        <CardTitle className="text-xl">Your Room is Ready!</CardTitle>
        <CardDescription>
          Share this link with your partner to start your photo session
        </CardDescription>
        <div className="bg-muted rounded-xl p-3 w-full border-[3px] border-border shadow-clay-sm">
          <code className="font-mono text-sm text-foreground break-all">
            {roomLink}
          </code>
        </div>
        <div className="flex gap-3 justify-center w-full">
          <Button variant="default" onClick={handleCopyLink} className="flex-1">
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          {typeof navigator.share === "function" && (
            <Button variant="secondary" onClick={handleShare} className="flex-1">
              <Share2 className="h-5 w-5" />
              Share
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
