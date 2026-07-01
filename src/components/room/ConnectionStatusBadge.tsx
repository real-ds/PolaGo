"use client";

import { ConnectionStatus } from "@/types";

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
}

const statusConfig: Record<ConnectionStatus, { label: string; color: string }> = {
  idle: { label: "Idle", color: "bg-gray-300 text-gray-600" },
  connecting: { label: "Connecting...", color: "bg-yellow-100 text-yellow-700" },
  connected: { label: "Connected", color: "bg-green-100 text-green-700" },
  reconnecting: { label: "Reconnecting...", color: "bg-orange-100 text-orange-700" },
  disconnected: { label: "Disconnected", color: "bg-red-100 text-red-700" },
};

export function ConnectionStatusBadge({ status }: ConnectionStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-quicksand font-medium ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "connected" ? "bg-green-500" : "bg-current"}`} />
      {config.label}
    </span>
  );
}
