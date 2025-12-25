"use client";

interface PublicHeaderProps {
  teamName: string;
  teamIcon: string;
  logoUrl?: string | null;
  brandColor?: string | null;
}

// Map icon names to simple letters/symbols for display
const getIconDisplay = (iconName: string) => {
  // Return first letter of icon name as fallback
  return iconName.charAt(0).toUpperCase();
};

export function PublicHeader({ teamName, teamIcon, logoUrl, brandColor }: PublicHeaderProps) {
  // Build the logo background style
  const logoStyle = brandColor
    ? { backgroundColor: brandColor }
    : undefined;

  // Default gradient classes (used when no brandColor)
  const defaultGradient = !brandColor ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "";

  return (
    <header className="border-b border-white/5 bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${teamName} logo`}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg ${defaultGradient}`}
              style={logoStyle}
            >
              {getIconDisplay(teamIcon)}
            </div>
          )}
          <div>
            <h1 className="text-lg font-semibold text-neutral-100">{teamName}</h1>
            <p className="text-xs text-neutral-500">Feedback Portal</p>
          </div>
        </div>
      </div>
    </header>
  );
}
