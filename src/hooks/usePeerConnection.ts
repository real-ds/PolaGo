"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PeerConnectionManager } from "@/core/peer/PeerConnectionManager";
import { ISignalingTransport } from "@/core/room/ISignalingTransport";
import { CameraService } from "@/core/camera/CameraService";
import { ConnectionStatus } from "@/types";

interface UsePeerConnectionReturn {
  peerManager: PeerConnectionManager | null;
  remoteStream: MediaStream | null;
  status: ConnectionStatus;
  initiateConnection: (stream: MediaStream) => Promise<void>;
  acceptConnection: (stream: MediaStream) => Promise<void>;
  sendData: (payload: unknown) => void;
  disconnect: () => Promise<void>;
}

export function usePeerConnection(signaling: ISignalingTransport): UsePeerConnectionReturn {
  const [peerManager] = useState(() => new PeerConnectionManager(signaling));
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  useEffect(() => {
    peerManager.onRemoteStream((stream) => setRemoteStream(stream));
    peerManager.onStatusChange((s) => setStatus(s));
  }, [peerManager]);

  const initiateConnection = useCallback(async (stream: MediaStream) => {
    await peerManager.initiateConnection(stream);
  }, [peerManager]);

  const acceptConnection = useCallback(async (stream: MediaStream) => {
    await peerManager.acceptConnection(stream);
  }, [peerManager]);

  const sendData = useCallback((payload: unknown) => {
    peerManager.sendData(payload);
  }, [peerManager]);

  const disconnect = useCallback(async () => {
    await peerManager.disconnect();
    setRemoteStream(null);
  }, [peerManager]);

  useEffect(() => {
    return () => {
      peerManager.disconnect();
    };
  }, [peerManager]);

  return { peerManager, remoteStream, status, initiateConnection, acceptConnection, sendData, disconnect };
}
