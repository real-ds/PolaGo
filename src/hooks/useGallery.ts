"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GalleryManager, GalleryEntry } from "@/core/gallery/GalleryManager";

interface UseGalleryReturn {
  entries: GalleryEntry[];
  loading: boolean;
  addEntry: (entry: GalleryEntry) => Promise<void>;
  removeEntry: (index: number) => Promise<void>;
  updateEntry: (index: number, dataUrl: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useGallery(roomId?: string): UseGalleryReturn {
  const managerRef = useRef<GalleryManager | null>(null);
  const [entries, setEntries] = useState<GalleryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    managerRef.current = new GalleryManager(roomId);
    managerRef.current.load().then((loaded) => {
      setEntries(loaded);
      setLoading(false);
    });
  }, [roomId]);

  const addEntry = useCallback(async (entry: GalleryEntry) => {
    if (!managerRef.current) return;
    await managerRef.current.add(entry);
    setEntries(managerRef.current.getAll());
  }, []);

  const removeEntry = useCallback(async (index: number) => {
    if (!managerRef.current) return;
    await managerRef.current.remove(index);
    setEntries(managerRef.current.getAll());
  }, []);

  const updateEntry = useCallback(async (index: number, dataUrl: string) => {
    if (!managerRef.current) return;
    await managerRef.current.update(index, dataUrl);
    setEntries(managerRef.current.getAll());
  }, []);

  const clearAll = useCallback(async () => {
    if (!managerRef.current) return;
    await managerRef.current.clearAll();
    setEntries([]);
  }, []);

  return { entries, loading, addEntry, removeEntry, updateEntry, clearAll };
}
