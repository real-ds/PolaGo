import { NextRequest, NextResponse } from "next/server";
import { generateRoomSlug } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action as string;

    if (action === "create") {
      const slug = generateRoomSlug();
      const roomUrl = `${req.headers.get("origin") || "http://localhost:3000"}/room/${slug}`;
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
