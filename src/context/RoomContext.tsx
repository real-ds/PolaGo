"use client";

import { createContext, useContext, ReactNode } from "react";
import { useRoom } from "@/hooks/useRoom";
import { RoomService } from "@/core/room/RoomService";

interface RoomContextValue {
  roomService: RoomService | null;
  roomId: string | null;
  role: "host" | "guest" | null;
  connected: boolean;
  partnerPresent: boolean;
  createRoom: () => Promise<string>;
  joinRoom: (id: string) => Promise<void>;
  hostRoom: (id: string) => Promise<void>;
  endRoom: () => void;
}

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const room = useRoom();
  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
}

export function useRoomContext(): RoomContextValue {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoomContext must be used within RoomProvider");
  return ctx;
}
