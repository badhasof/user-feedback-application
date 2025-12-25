"use client";

import { useEffect, ReactNode } from "react";
import { useTeam } from "@/contexts/TeamContext";

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

interface WorkspaceThemeProviderProps {
  children: ReactNode;
}

export function WorkspaceThemeProvider({ children }: WorkspaceThemeProviderProps) {
  const { activeTeam } = useTeam();
  const brandColor = activeTeam?.brandColor;

  useEffect(() => {
    if (brandColor) {
      const hsl = hexToHSL(brandColor);
      const root = document.documentElement;

      // Set CSS variables for brand color
      root.style.setProperty("--brand-primary", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      root.style.setProperty(
        "--brand-primary-foreground",
        hsl.l > 50 ? "0 0% 0%" : "0 0% 100%"
      );
      // Also set the raw hex for simple use cases
      root.style.setProperty("--brand-color", brandColor);
    }

    return () => {
      const root = document.documentElement;
      root.style.removeProperty("--brand-primary");
      root.style.removeProperty("--brand-primary-foreground");
      root.style.removeProperty("--brand-color");
    };
  }, [brandColor]);

  return <>{children}</>;
}
