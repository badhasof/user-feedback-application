"use client";

import { useEffect } from "react";

interface PortalThemeProviderProps {
  brandColor: string | null;
  children: React.ReactNode;
}

// Convert hex color to HSL for CSS variables
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex values
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

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

export function PortalThemeProvider({ brandColor, children }: PortalThemeProviderProps) {
  useEffect(() => {
    if (brandColor) {
      const hsl = hexToHSL(brandColor);
      const root = document.documentElement;

      // Set CSS variables for portal theming
      root.style.setProperty("--portal-primary", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      root.style.setProperty(
        "--portal-primary-foreground",
        hsl.l > 50 ? "0 0% 0%" : "0 0% 100%"
      );
    }

    return () => {
      // Cleanup on unmount
      document.documentElement.style.removeProperty("--portal-primary");
      document.documentElement.style.removeProperty("--portal-primary-foreground");
    };
  }, [brandColor]);

  return <>{children}</>;
}
