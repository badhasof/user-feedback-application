import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback Portal",
  description: "Share your feedback and feature requests",
};

export default function UserViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090b]">
      {children}
    </div>
  );
}
