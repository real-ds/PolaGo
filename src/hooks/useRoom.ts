"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { RoomService, RoomEventCallbacks } from "@/core/room/RoomService";
import { ISignalingTransport } from "@/core/room/ISignalingTransport";
import { createSignalingTransport } from "@/lib/signaling";
import { generateId } from "@/lib/utils";

interface UseRoomReturn {
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

export function useRoom(transport?: ISignalingTransport): UseRoomReturn {
  const participantId = useRef(generateId());
  const [roomService, setRoomService] = useState<RoomService | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [role, setRole] = useState<"host" | "guest" | null>(null);
  const [connected, setConnected] = useState(false);
  const [partnerPresent, setPartnerPresent] = useState(false);

  const createRoom = useCallback(async () => {
    const t = transport ?? createSignalingTransport();
    const service = new RoomService(t, participantId.current);
    const callbacks: RoomEventCallbacks = {
      onPartnerJoined: () => setPartnerPresent(true),
      onPartnerLeft: () => setPartnerPresent(false),
      onReadyStateChanged: () => {},
      onShotProgress: () => {},
      onRoomExpired: () => {
        setConnected(false);
        setRoomId(null);
      },
      onError: (err) => console.error("Room error:", err),
    };
    service.setCallbacks(callbacks);
    const slug = await service.createRoom();
    setRoomService(service);
    setRoomId(slug);
    setRole("host");
    setConnected(true);
    return slug;
  }, [transport]);

  const joinRoom = useCallback(async (id: string) => {
    const t = transport ?? createSignalingTransport();
    const service = new RoomService(t, participantId.current);
    const callbacks: RoomEventCallbacks = {
      onPartnerJoined: () => setPartnerPresent(true),
      onPartnerLeft: () => setPartnerPresent(false),
      onReadyStateChanged: () => {},
      onShotProgress: () => {},
      onRoomExpired: () => {
        setConnected(false);
        setRoomId(null);
      },
      onError: (err) => console.error("Room error:", err),
    };
    service.setCallbacks(callbacks);
    await service.joinRoom(id);
    setRoomService(service);
    setRoomId(id);
    setRole("guest");
    setConnected(true);
  }, [transport]);

  const hostRoom = useCallback(async (id: string) => {
    const t = transport ?? createSignalingTransport();
    const service = new RoomService(t, participantId.current);
    const callbacks: RoomEventCallbacks = {
      onPartnerJoined: () => setPartnerPresent(true),
      onPartnerLeft: () => setPartnerPresent(false),
      onReadyStateChanged: () => {},
      onShotProgress: () => {},
      onRoomExpired: () => {
        setConnected(false);
        setRoomId(null);
      },
      onError: (err) => console.error("Room error:", err),
    };
    service.setCallbacks(callbacks);
    await service.hostRoom(id);
    setRoomService(service);
    setRoomId(id);
    setRole("host");
    setConnected(true);
  }, [transport]);

  const endRoom = useCallback(() => {
    roomService?.endRoom();
    setConnected(false);
    setPartnerPresent(false);
    setRoomId(null);
    setRole(null);
  }, [roomService]);

  useEffect(() => {
    return () => {
      roomService?.endRoom();
    };
  }, [roomService]);

  return { roomService, roomId, role, connected, partnerPresent, createRoom, joinRoom, hostRoom, endRoom };
}
