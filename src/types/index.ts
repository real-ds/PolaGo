export interface Room {
  id: string;
  slug: string;
  createdAt: number;
  hostId: string;
  guestId?: string;
  status: RoomStatus;
  shotNumber: number;
  activeFilterId: string | null;
  activeCompositeStyle: CompositeStyle;
}

export type RoomStatus = "waiting" | "connected" | "capturing" | "editing" | "finished" | "expired";

export type CompositeStyle = "split" | "pip" | "heart";

export type ShotStatus = "pending" | "ready" | "countdown" | "captured" | "retake-requested" | "locked";

export interface Shot {
  index: number;
  status: ShotStatus;
  localFrame?: ImageData;
  remoteFrame?: ImageData;
  compositeCanvas?: HTMLCanvasElement;
}

export interface Participant {
  id: string;
  role: "host" | "guest";
  ready: boolean;
  cameraFacing: "user" | "environment";
}

export interface FilterDefinition {
  id: string;
  label: string;
  thumbnail: string;
}

export interface DecorationLayer {
  id: string;
  type: "sticker" | "text" | "frame";
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
  content: string;
  visible: boolean;
}

export interface LayoutOption {
  id: string;
  label: string;
  cols: number;
  rows: number;
}

export interface ExportOptions {
  format: "png" | "jpeg" | "jpg";
  quality: number;
  includeStrip: boolean;
  includeIndividuals: boolean;
}

export interface AppPreferences {
  theme: "light" | "dark" | "cute";
  countdownDuration: 3 | 5 | 10;
  defaultExportFormat: "png" | "jpeg" | "jpg";
  defaultExportQuality: number;
  lastFilterId: string | null;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  theme: "cute",
  countdownDuration: 3,
  defaultExportFormat: "png",
  defaultExportQuality: 90,
  lastFilterId: null,
};

export type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected";

export interface SignalingMessage {
  type: string;
  senderId: string;
  payload: unknown;
}
