"use client";

import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  className,
  label,
  disabled = false,
}: ColorPickerProps) {
  // Normalize hex value
  const normalizeHex = (hex: string): string => {
    let normalized = hex.replace("#", "").toUpperCase();
    if (normalized.length === 3) {
      normalized = normalized
        .split("")
        .map((c) => c + c)
        .join("");
    }
    return "#" + normalized;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    // Allow # prefix
    if (!input.startsWith("#")) {
      input = "#" + input;
    }
    // Only allow valid hex characters
    const cleaned = input.replace(/[^#0-9A-Fa-f]/g, "").slice(0, 7);
    onChange(cleaned);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="block text-sm text-neutral-400">{label}</label>
      )}
      <div className="flex gap-4">
        {/* Color Picker */}
        <div
          className={cn(
            "rounded-xl overflow-hidden",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <HexColorPicker
            color={value || "#3B82F6"}
            onChange={onChange}
            style={{ width: 180, height: 180 }}
          />
        </div>

        {/* Preview and Input */}
        <div className="flex flex-col gap-3">
          {/* Color Preview */}
          <div
            className="w-16 h-16 rounded-xl border border-white/10"
            style={{ backgroundColor: value || "#3B82F6" }}
          />

          {/* Hex Input */}
          <div>
            <label className="block text-xs text-neutral-500 mb-1">
              Hex Code
            </label>
            <input
              type="text"
              value={value || "#3B82F6"}
              onChange={handleInputChange}
              disabled={disabled}
              placeholder="#000000"
              maxLength={7}
              className="w-24 px-3 py-2 text-sm font-mono rounded-lg bg-[#1E1E1E] border border-white/10 focus:border-blue-500/50 outline-none transition-colors text-neutral-200 uppercase disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
