import { NextRequest, NextResponse } from "next/server";
import { generateRoomSlug } from "@/lib/utils";
import { signalingStore } from "@/lib/signalingStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action as string;

    if (action === "create") {
      const slug = generateRoomSlug();
      const roomUrl = `${req.headers.get("origin") || "http://localhost:3000"}/room/${slug}`;
      signalingStore.createRoom(slug);
      return NextResponse.json({
        success: true,
        roomId: slug,
        roomUrl,
        createdAt: Date.now(),
      });
    }

    if (action === "validate") {
      const roomId = body.roomId as string;
      if (!roomId || roomId.length !== 8) {
        return NextResponse.json(
          { success: false, error: "Invalid room ID" },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true, roomId, valid: true });
    }

    if (action === "signal") {
      const roomId = body.roomId as string;
      const peerId = body.peerId as string;
      const event = body.event as string;
      const payload = body.payload;

      if (!roomId || !peerId) {
        return NextResponse.json(
          { success: false, error: "Missing roomId or peerId" },
          { status: 400 }
        );
      }

      signalingStore.addMessage(roomId, peerId, { event, payload });
      return NextResponse.json({ success: true });
    }

    if (action === "poll") {
      const roomId = body.roomId as string;
      const peerId = body.peerId as string;
      const since = (body.since as number) || 0;

      if (!roomId || !peerId) {
        return NextResponse.json(
          { success: false, error: "Missing roomId or peerId" },
          { status: 400 }
        );
      }

      const messages = signalingStore.getMessages(roomId, peerId, since);
      const peers = signalingStore.getPeers(roomId);
      return NextResponse.json({
        success: true,
        messages,
        peers,
      });
    }

    if (action === "leave") {
      const roomId = body.roomId as string;
      const peerId = body.peerId as string;

      if (roomId && peerId) {
        signalingStore.removePeer(roomId, peerId);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Unknown action" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
