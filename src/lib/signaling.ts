import { ISignalingTransport } from "@/core/room/ISignalingTransport";
import { InMemoryTransport } from "@/core/room/transports/InMemoryTransport";
import { HttpSignalingTransport } from "@/core/room/transports/HttpSignalingTransport";

export function createSignalingTransport(): ISignalingTransport {
  if (typeof window === "undefined") {
    return new InMemoryTransport();
  }

  try {
    const env = (typeof process !== "undefined" && process.env) as Record<string, string> | undefined;
    if (env && env["NEXT_PUBLIC_ABLY_API_KEY"]) {
      // AblyTransport not implemented for this fallback
    }
  } catch {
    // Ignore
  }

  // Use HTTP signaling for cross-device communication
  return new HttpSignalingTransport();
}
