"use client";

import { ConvexAuthProvider as ConvexAuthProviderOriginal } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProviderOriginal client={convex}>
      {children}
    </ConvexAuthProviderOriginal>
  );
}
