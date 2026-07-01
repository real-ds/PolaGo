"use client";

import { Button } from "@/components/ui/Button";

interface ReadyButtonProps {
  ready: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function ReadyButton({ ready, onToggle, disabled = false }: ReadyButtonProps) {
  return (
    <Button
      variant={ready ? "primary" : "secondary"}
      size="lg"
      onClick={onToggle}
      disabled={disabled}
    >
      {ready ? "Ready!" : "Tap when ready"}
    </Button>
  );
}
