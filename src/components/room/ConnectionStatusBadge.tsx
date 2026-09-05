"use client";

import { ConnectionStatus } from "@/types";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionStatusBadgeProps {
  status: ConnectionStatus;
}

const statusConfig: Record<
  ConnectionStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  idle: {
    label: "Idle",
    color: "text-muted-foreground",
    bg: "bg-muted",
    icon: <Wifi className="h-3.5 w-3.5" />,
  },
  connecting: {
    label: "Connecting...",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  connected: {
    label: "Connected",
    color: "text-green-700",
    bg: "bg-green-50",
    icon: <Wifi className="h-3.5 w-3.5" />,
  },
  reconnecting: {
    label: "Reconnecting...",
    color: "text-orange-700",
    bg: "bg-orange-50",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  disconnected: {
    label: "Disconnected",
    color: "text-red-700",
    bg: "bg-red-50",
    icon: <WifiOff className="h-3.5 w-3.5" />,
  },
};

export function ConnectionStatusBadge({ status }: ConnectionStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-quicksand font-semibold border-[2px] shadow-clay-sm",
        config.bg,
        config.color
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
