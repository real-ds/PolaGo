import { ISignalingTransport } from "./ISignalingTransport";
import { generateRoomSlug } from "@/lib/utils";

export interface RoomEventCallbacks {
  onPartnerJoined: () => void;
  onPartnerLeft: () => void;
  onReadyStateChanged: (participantId: string, ready: boolean) => void;
  onShotProgress: (shotNumber: number) => void;
  onRoomExpired: () => void;
  onError: (error: string) => void;
}

export class RoomService {
  private transport: ISignalingTransport;
  private roomId: string = "";
  private participantId: string;
  private role: "host" | "guest" | null = null;
  private callbacks: RoomEventCallbacks | null = null;
  private _connected = false;
  private _partnerPresent = false;

  constructor(transport: ISignalingTransport, participantId: string) {
    this.transport = transport;
    this.participantId = participantId;
    this.setupListeners();
  }

  private setupListeners(): void {
    this.transport.on("hello", () => {
      if (!this._partnerPresent) {
        this._partnerPresent = true;
        this.callbacks?.onPartnerJoined();
        this.transport.send("hello", {});
      }
    });
    this.transport.on("partner-left", () => {
      this._partnerPresent = false;
      this.callbacks?.onPartnerLeft();
    });
    this.transport.on("ready-state", (payload) => {
      const data = payload as { participantId: string; ready: boolean };
      this.callbacks?.onReadyStateChanged(data.participantId, data.ready);
    });
    this.transport.on("room-expired", () => {
      this._connected = false;
      this.callbacks?.onRoomExpired();
    });
    this.transport.on("error", (payload) => {
      this.callbacks?.onError(payload as string);
    });
  }

  get connected(): boolean {
    return this._connected;
  }

  get partnerPresent(): boolean {
    return this._partnerPresent;
  }

  get currentRoomId(): string {
    return this.roomId;
  }

  get currentRole(): "host" | "guest" | null {
    return this.role;
  }

  setCallbacks(cbs: RoomEventCallbacks): void {
    this.callbacks = cbs;
  }

  async createRoom(): Promise<string> {
    const slug = generateRoomSlug();
    this.roomId = slug;
    this.role = "host";
    await this.transport.connect(slug);
    this._connected = true;
    return slug;
  }

  async joinRoom(roomId: string): Promise<void> {
    this.roomId = roomId;
    this.role = "guest";
    await this.transport.connect(roomId);
    this._connected = true;
    this.transport.send("hello", {});
  }

  async hostRoom(roomId: string): Promise<void> {
    this.roomId = roomId;
    this.role = "host";
    await this.transport.connect(roomId);
    this._connected = true;
    this.transport.send("hello", {});
  }

  sendReadyState(ready: boolean): void {
    this.transport.send("ready-state", {
      participantId: this.participantId,
      ready,
    });
  }

  endRoom(): void {
    this.transport.send("room-expired", {});
    this.transport.disconnect();
    this._connected = false;
    this._partnerPresent = false;
  }

  getTransport(): ISignalingTransport {
    return this.transport;
  }
}
