export interface ISignalingTransport {
  connect(roomId: string): Promise<void>;
  disconnect(): void;
  send(event: string, payload: unknown): void;
  on(event: string, handler: (payload: unknown) => void): void;
  off(event: string, handler: (payload: unknown) => void): void;
}
