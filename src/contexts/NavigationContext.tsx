"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type View = "dashboard" | "features" | "bugs" | "improvements" | "all" | "roadmap" | "changelog";
export type QuickFilter = "voted" | "recent" | "mine" | null;

interface NavigationContextType {
  activeView: View;
  quickFilter: QuickFilter;
  setActiveView: (view: View) => void;
  setQuickFilter: (filter: QuickFilter) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<View>("features");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(null);

  return (
    <NavigationContext.Provider
      value={{
        activeView,
        quickFilter,
        setActiveView,
        setQuickFilter,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
