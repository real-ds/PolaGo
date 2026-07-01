import { ISignalingTransport } from "../ISignalingTransport";

type Handler = (payload: unknown) => void;

export class InMemoryTransport implements ISignalingTransport {
  private handlers = new Map<string, Set<Handler>>();
  private peer: InMemoryTransport | null = null;
  private channel: BroadcastChannel | null = null;
  private _roomId: string = "";
  private _connected = false;

  static createPair(): [InMemoryTransport, InMemoryTransport] {
    const a = new InMemoryTransport();
    const b = new InMemoryTransport();
    a.peer = b;
    b.peer = a;
    return [a, b];
  }

  get roomId(): string {
    return this._roomId;
  }

  get connected(): boolean {
    return this._connected;
  }

  async connect(roomId: string): Promise<void> {
    this._roomId = roomId;
    this._connected = true;
    try {
      this.channel = new BroadcastChannel(`polago:${roomId}`);
      this.channel.onmessage = (event) => {
        const { event: evt, payload } = event.data;
        const handlers = this.handlers.get(evt);
        if (handlers) {
          handlers.forEach((h) => h(payload));
        }
      };
    } catch {}
  }

  disconnect(): void {
    this._connected = false;
    this.handlers.clear();
    this.peer = null;
    this.channel?.close();
    this.channel = null;
  }

  send(event: string, payload: unknown): void {
    if (this.channel) {
      this.channel.postMessage({ event, payload });
    }
    if (this.peer && this.peer._connected) {
      const peerHandlers = this.peer.handlers.get(event);
      if (peerHandlers) {
        peerHandlers.forEach((h) => h(payload));
      }
    }
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
