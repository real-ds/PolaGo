import { ISignalingTransport } from "../ISignalingTransport";

type Handler = (payload: unknown) => void;

interface SignalingMessage {
  event: string;
  payload: unknown;
  timestamp: number;
}

export class HttpSignalingTransport implements ISignalingTransport {
  private handlers = new Map<string, Set<Handler>>();
  private roomId = "";
  private peerId: string;
  private connected = false;
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private lastPollTime = 0;
  private baseUrl = "";

  constructor() {
    this.peerId = this.generateId();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  private getApiBase(): string {
    if (this.baseUrl) return this.baseUrl;
    if (typeof window !== "undefined") {
      this.baseUrl = `${window.location.protocol}//${window.location.host}`;
    }
    return this.baseUrl || "";
  }

  get _peerId(): string {
    return this.peerId;
  }

  async connect(roomId: string): Promise<void> {
    this.roomId = roomId;
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signal", roomId, peerId: this.peerId, event: "join", payload: { peerId: this.peerId } }),
      });
      void res;
    } catch {
      // Ignore join errors
    }
    this.connected = true;
    this.startPolling();
  }

  private startPolling(): void {
    if (this.pollInterval) return;
    this.lastPollTime = Date.now();

    this.pollInterval = setInterval(async () => {
      if (!this.roomId) return;

      try {
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "poll",
            roomId: this.roomId,
            peerId: this.peerId,
            since: this.lastPollTime,
          }),
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data.success && data.messages) {
          for (const msg of data.messages as SignalingMessage[]) {
            const handlers = this.handlers.get(msg.event);
            if (handlers) {
              handlers.forEach((h) => h(msg.payload));
            }
          }
          this.lastPollTime = Date.now();
        }
      } catch {
        // Ignore polling errors
      }
    }, 200);
  }

  private stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  disconnect(): void {
    this.stopPolling();
    this.connected = false;
    this.handlers.clear();

    if (this.roomId) {
      fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "leave", roomId: this.roomId, peerId: this.peerId }),
      }).catch(() => {});
    }

    this.roomId = "";
  }

  send(event: string, payload: unknown): void {
    if (!this.roomId || !this.connected) return;

    fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "signal",
        roomId: this.roomId,
        peerId: this.peerId,
        event,
        payload,
      }),
    }).catch(() => {});
  }

  on(event: string, handler: Handler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: Handler): void {
    this.handlers.get(event)?.delete(handler);
  }
}
