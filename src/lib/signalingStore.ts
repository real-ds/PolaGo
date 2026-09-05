interface SignalingMessage {
  event: string;
  payload: unknown;
  timestamp: number;
}

interface RoomSignaling {
  messages: SignalingMessage[];
  peers: Set<string>;
}

class SignalingStore {
  private rooms = new Map<string, RoomSignaling>();

  createRoom(roomId: string): void {
    this.rooms.set(roomId, {
      messages: [],
      peers: new Set(),
    });
  }

  addMessage(roomId: string, peerId: string, message: { event: string; payload: unknown }): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      this.rooms.set(roomId, {
        messages: [{ ...message, timestamp: Date.now() }],
        peers: new Set([peerId]),
      });
      return;
    }

    room.peers.add(peerId);
    room.messages.push({ ...message, timestamp: Date.now() });

    // Keep only last 100 messages per room
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }
  }

  getMessages(roomId: string, peerId: string, since: number): SignalingMessage[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    // Mark peer as active
    room.peers.add(peerId);

    return room.messages.filter(
      (m) => m.timestamp > since && !JSON.stringify(m.payload).includes(peerId)
    );
  }

  getPeers(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.peers);
  }

  removePeer(roomId: string, peerId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.peers.delete(peerId);
    }
  }

  cleanup(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes

    for (const [roomId, room] of this.rooms.entries()) {
      // Remove messages older than maxAge
      room.messages = room.messages.filter((m) => now - m.timestamp < maxAge);

      // Remove rooms with no messages in 30 minutes
      if (room.messages.length === 0) {
        this.rooms.delete(roomId);
      }
    }
  }
}

// Cleanup every 5 minutes
const signalingStore = new SignalingStore();
setInterval(() => signalingStore.cleanup(), 5 * 60 * 1000);

export { signalingStore };
