import { ISignalingTransport } from "../ISignalingTransport";
import * as Ably from "ably";

type Handler = (payload: unknown) => void;

export class AblyTransport implements ISignalingTransport {
  private client: Ably.Realtime | null = null;
  private channel: Ably.RealtimeChannel | null = null;
  private handlers = new Map<string, Set<Handler>>();
  private _roomId = "";
  private _connected = false;

  async connect(roomId: string): Promise<void> {
    this._roomId = roomId;
    const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;
    if (!apiKey) {
      throw new Error("Ably API key not configured. Set NEXT_PUBLIC_ABLY_API_KEY.");
    }
    this.client = new Ably.Realtime({ key: apiKey, clientId: `polago-${roomId}` });
    await this.client.connection.once("connected");
    this.channel = this.client.channels.get(`room:${roomId}`);
    await this.channel.attach();
    await this.channel.subscribe((msg: Ably.InboundMessage) => {
      const data = msg.data as { event: string; payload: unknown };
      if (data && data.event) {
        const handlers = this.handlers.get(data.event);
        if (handlers) {
          handlers.forEach((h) => h(data.payload));
        }
      }
    });
    this._connected = true;
  }

  disconnect(): void {
    if (this.channel) {
      this.channel.detach();
      this.channel = null;
    }
    if (this.client) {
      this.client.close();
      this.client = null;
    }
    this._connected = false;
    this.handlers.clear();
  }

  send(event: string, payload: unknown): void {
    if (this.channel && this._connected) {
      this.channel.publish("message", { event, payload });
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

  get roomId(): string {
    return this._roomId;
  }

  get connected(): boolean {
    return this._connected;
  }
}
