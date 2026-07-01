import { describe, it, expect, vi } from "vitest";
import { RoomService } from "../RoomService";
import { InMemoryTransport } from "../transports/InMemoryTransport";
import { generateRoomSlug } from "@/lib/utils";

describe("RoomService", () => {
  it("should create a room and return a slug", async () => {
    const [hostTransport] = InMemoryTransport.createPair();
    const service = new RoomService(hostTransport, "host-1");
    const slug = await service.createRoom();
    expect(slug).toBeDefined();
    expect(slug.length).toBe(8);
    expect(service.currentRoomId).toBe(slug);
    expect(service.connected).toBe(true);
    expect(service.currentRole).toBe("host");
  });

  it("should allow a guest to join an existing room", async () => {
    const [hostTransport, guestTransport] = InMemoryTransport.createPair();
    const hostService = new RoomService(hostTransport, "host-1");
    const slug = await hostService.createRoom();

    const guestService = new RoomService(guestTransport, "guest-1");
    const onPartnerJoined = vi.fn();
    hostService.setCallbacks({ onPartnerJoined, onPartnerLeft: vi.fn(), onReadyStateChanged: vi.fn(), onShotProgress: vi.fn(), onRoomExpired: vi.fn(), onError: vi.fn() });

    await guestService.joinRoom(slug);
    expect(guestService.connected).toBe(true);
    expect(guestService.currentRole).toBe("guest");
    expect(guestService.currentRoomId).toBe(slug);
  });

  it("should notify host when guest joins", async () => {
    const [hostTransport, guestTransport] = InMemoryTransport.createPair();
    const hostService = new RoomService(hostTransport, "host-1");
    const guestService = new RoomService(guestTransport, "guest-1");
    const slug = await hostService.createRoom();

    const onPartnerJoined = vi.fn();
    hostService.setCallbacks({ onPartnerJoined, onPartnerLeft: vi.fn(), onReadyStateChanged: vi.fn(), onShotProgress: vi.fn(), onRoomExpired: vi.fn(), onError: vi.fn() });

    await guestService.joinRoom(slug);
    expect(onPartnerJoined).toHaveBeenCalledTimes(1);
    expect(hostService.partnerPresent).toBe(true);
  });

  it("should broadcast ready state", async () => {
    const [hostTransport, guestTransport] = InMemoryTransport.createPair();
    const hostService = new RoomService(hostTransport, "host-1");
    const guestService = new RoomService(guestTransport, "guest-1");
    const slug = await hostService.createRoom();
    await guestService.joinRoom(slug);

    const onReady = vi.fn();
    hostService.setCallbacks({ onPartnerJoined: vi.fn(), onPartnerLeft: vi.fn(), onReadyStateChanged: onReady, onShotProgress: vi.fn(), onRoomExpired: vi.fn(), onError: vi.fn() });

    guestService.sendReadyState(true);
    expect(onReady).toHaveBeenCalledWith("guest-1", true);
  });

  it("should end room and disconnect", async () => {
    const [hostTransport] = InMemoryTransport.createPair();
    const service = new RoomService(hostTransport, "host-1");
    await service.createRoom();
    expect(service.connected).toBe(true);
    service.endRoom();
    expect(service.connected).toBe(false);
  });

  it("should handle room expiry notification", async () => {
    const [hostTransport, guestTransport] = InMemoryTransport.createPair();
    const hostService = new RoomService(hostTransport, "host-1");
    const guestService = new RoomService(guestTransport, "guest-1");
    const slug = await hostService.createRoom();
    await guestService.joinRoom(slug);

    const onExpired = vi.fn();
    guestService.setCallbacks({ onPartnerJoined: vi.fn(), onPartnerLeft: vi.fn(), onReadyStateChanged: vi.fn(), onShotProgress: vi.fn(), onRoomExpired: onExpired, onError: vi.fn() });

    hostService.endRoom();
    expect(onExpired).toHaveBeenCalled();
  });
});
