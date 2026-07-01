import { ISignalingTransport } from "@/core/room/ISignalingTransport";
import { InMemoryTransport } from "@/core/room/transports/InMemoryTransport";
import { AblyTransport } from "@/core/room/transports/AblyTransport";

export function createSignalingTransport(): ISignalingTransport {
  try {
    if (typeof process !== "undefined" && (process.env as Record<string, string>)["NEXT_PUBLIC_ABLY_API_KEY"]) {
      return new AblyTransport();
    }
  } catch {
  }
  return new InMemoryTransport();
}
