"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const presetColors = [
  "#10a37f", // Teal (app primary)
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
];

export function ColorPicker({
  value,
  onChange,
  className,
  disabled = false,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    if (!input.startsWith("#")) {
      input = "#" + input;
    }
    const cleaned = input.replace(/[^#0-9A-Fa-f]/g, "").slice(0, 7);
    onChange(cleaned);
  };

  const currentColor = value || "#3B82F6";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "w-10 h-10 rounded-lg border-2 border-white/10 transition-all hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-authPrimary focus:ring-offset-2 focus:ring-offset-authBackground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{ backgroundColor: currentColor }}
            aria-label="Pick a color"
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-3 bg-[#1a1a1a] border-authBorder"
          align="start"
          sideOffset={8}
        >
          <div className="space-y-3">
            <HexColorPicker
              color={currentColor}
              onChange={onChange}
              style={{ width: 200, height: 160 }}
            />
            <div className="flex flex-wrap gap-1.5">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange(color)}
                  className={cn(
                    "w-6 h-6 rounded-md border transition-all hover:scale-110",
                    currentColor.toUpperCase() === color.toUpperCase()
                      ? "border-white ring-1 ring-white"
                      : "border-white/10 hover:border-white/30"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <input
        type="text"
        value={currentColor}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder="#000000"
        maxLength={7}
        className="w-24 px-3 py-2 text-sm font-mono rounded-lg bg-white/5 border border-authBorder focus:border-authPrimary outline-none transition-colors text-textMain uppercase disabled:opacity-50"
      />
    </div>
  );
}
