"use client";

interface StickerPickerProps {
  onSelect: (src: string) => void;
}

const STICKERS = [
  { id: "heart-pink", src: "/assets/stickers/heart-pink.svg", label: "💗" },
  { id: "heart-gold", src: "/assets/stickers/heart-gold.svg", label: "💛" },
  { id: "kiss", src: "/assets/stickers/kiss.svg", label: "💋" },
  { id: "cupid", src: "/assets/stickers/cupid.svg", label: "🏹" },
  { id: "star", src: "/assets/stickers/star.svg", label: "⭐" },
  { id: "sparkle", src: "/assets/stickers/sparkle.svg", label: "✨" },
];

export function StickerPicker({ onSelect }: StickerPickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {STICKERS.map((sticker) => (
        <button
          key={sticker.id}
          onClick={() => onSelect(sticker.src)}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 flex items-center justify-center text-lg transition-all"
          title={sticker.id}
        >
          {sticker.label}
        </button>
      ))}
    </div>
  );
}
