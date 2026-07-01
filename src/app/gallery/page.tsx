"use client";

import { useState } from "react";
import Link from "next/link";
import { useGallery } from "@/hooks/useGallery";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Button } from "@/components/ui/Button";

export default function GalleryPage() {
  const [roomId, setRoomId] = useState("");
  const { entries, loading, removeEntry, clearAll } = useGallery(roomId || undefined);

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="font-fredoka text-xl text-pink-600">
          POLA GO
        </Link>
        <h1 className="font-fredoka text-2xl text-pink-700">Gallery</h1>
        <div />
      </header>

      <div className="max-w-lg mx-auto">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID to load gallery"
            className="flex-1 px-4 py-2.5 bg-white border border-pink-200 rounded-xl font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {entries.length > 0 && (
            <Button variant="danger" size="sm" onClick={clearAll}>
              Clear
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-center font-quicksand text-gray-400">Loading...</p>
        ) : (
          <GalleryGrid entries={entries} onDelete={(i) => removeEntry(i)} />
        )}
      </div>
    </div>
  );
}
