import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthProvider } from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Feedback App",
  description: "User feedback application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexAuthProvider>{children}</ConvexAuthProvider>
      </body>
    </html>
  );
}
