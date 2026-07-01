import { ISignalingTransport } from "@/core/room/ISignalingTransport";
import { ConnectionStatus } from "@/types";

export class PeerConnectionManager {
  private connection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private signaling: ISignalingTransport;
  private _status: ConnectionStatus = "idle";
  private _remoteStream: MediaStream | null = null;
  private onRemoteStreamCb: ((stream: MediaStream) => void) | null = null;
  private onDataCb: ((data: unknown) => void) | null = null;
  private onStatusChangeCb: ((status: ConnectionStatus) => void) | null = null;
  private _localStream: MediaStream | null = null;

  private readonly iceServers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  constructor(signaling: ISignalingTransport) {
    this.signaling = signaling;
    this.setupSignaling();
  }

  get status(): ConnectionStatus {
    return this._status;
  }

  get remoteStream(): MediaStream | null {
    return this._remoteStream;
  }

  private setStatus(s: ConnectionStatus): void {
    this._status = s;
    this.onStatusChangeCb?.(s);
  }

  onRemoteStream(cb: (stream: MediaStream) => void): void {
    this.onRemoteStreamCb = cb;
  }

  onData(cb: (data: unknown) => void): void {
    this.onDataCb = cb;
  }

  onStatusChange(cb: (status: ConnectionStatus) => void): void {
    this.onStatusChangeCb = cb;
  }

  private ensureConnection(): RTCPeerConnection {
    if (!this.connection) {
      this.connection = new RTCPeerConnection({ iceServers: this.iceServers });
      this.setupConnectionHandlers();
      if (this._localStream) {
        this.addLocalStream(this._localStream);
      }
    }
    return this.connection;
  }

  private setupSignaling(): void {
    this.signaling.on("signal", async (payload: unknown) => {
      const msg = payload as { type: string; data: unknown };
      try {
        if (msg.type === "offer") {
          this.setStatus("connecting");
          const conn = this.ensureConnection();
          await conn.setRemoteDescription(new RTCSessionDescription(msg.data as RTCSessionDescriptionInit));
          const answer = await conn.createAnswer();
          await conn.setLocalDescription(answer);
          this.signaling.send("signal", { type: "answer", data: answer });
        } else if (msg.type === "answer") {
          if (!this.connection) return;
          await this.connection.setRemoteDescription(new RTCSessionDescription(msg.data as RTCSessionDescriptionInit));
        } else if (msg.type === "ice") {
          if (!this.connection) return;
          await this.connection.addIceCandidate(new RTCIceCandidate(msg.data as RTCIceCandidateInit));
        }
      } catch (err) {
        console.error("Signal handling error:", err);
      }
    });
  }

  initiateConnection(localStream: MediaStream): void {
    this._localStream = localStream;
    this.setStatus("connecting");
    const conn = this.ensureConnection();
    this.createDataChannel();
    conn.createOffer().then((offer) => {
      conn.setLocalDescription(offer);
      this.signaling.send("signal", { type: "offer", data: offer });
    }).catch((err) => console.error("Create offer error:", err));
  }

  acceptConnection(localStream: MediaStream): void {
    this._localStream = localStream;
    this.setStatus("connecting");
    this.ensureConnection();
  }

  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signaling.send("signal", { type: "ice", data: event.candidate });
      }
    };

    this.connection.onconnectionstatechange = () => {
      const state = this.connection?.connectionState;
      if (state === "connected") this.setStatus("connected");
      else if (state === "disconnected" || state === "failed") this.setStatus("disconnected");
      else if (state === "connecting") this.setStatus("reconnecting");
    };

    this.connection.ontrack = (event) => {
      this._remoteStream = event.streams[0] ?? null;
      if (this._remoteStream) {
        this.onRemoteStreamCb?.(this._remoteStream);
      }
    };

    this.connection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannelHandlers();
    };
  }

  private addLocalStream(stream: MediaStream): void {
    stream.getTracks().forEach((track) => {
      if (this.connection) {
        this.connection.addTrack(track, stream);
      }
    });
  }

  private createDataChannel(): void {
    if (!this.connection) return;
    this.dataChannel = this.connection.createDataChannel("polago-sync");
    this.setupDataChannelHandlers();
  }

  private setupDataChannelHandlers(): void {
    if (!this.dataChannel) return;
    this.dataChannel.onopen = () => {};
    this.dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onDataCb?.(data);
      } catch {
        this.onDataCb?.(event.data);
      }
    };
  }

  sendData(payload: unknown): void {
    if (this.dataChannel?.readyState === "open") {
      this.dataChannel.send(JSON.stringify(payload));
    }
  }

  async disconnect(): Promise<void> {
    this.dataChannel?.close();
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    this._remoteStream = null;
    this.setStatus("disconnected");
  }
}
