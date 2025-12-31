import {
  Building,
  Building2,
  Command,
  AudioWaveform,
  GalleryVerticalEnd,
  Briefcase,
  Rocket,
  Zap,
  Star,
  Heart,
  Globe,
  Code,
  Cpu,
  Database,
  Layers,
  Package,
  Shield,
  Target,
  Terminal,
  Workflow,
  type LucideIcon,
} from "lucide-react";

// Available icons for teams
export const TEAM_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Building", icon: Building },
  { name: "Building2", icon: Building2 },
  { name: "Command", icon: Command },
  { name: "AudioWaveform", icon: AudioWaveform },
  { name: "GalleryVerticalEnd", icon: GalleryVerticalEnd },
  { name: "Briefcase", icon: Briefcase },
  { name: "Rocket", icon: Rocket },
  { name: "Zap", icon: Zap },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Globe", icon: Globe },
  { name: "Code", icon: Code },
  { name: "Cpu", icon: Cpu },
  { name: "Database", icon: Database },
  { name: "Layers", icon: Layers },
  { name: "Package", icon: Package },
  { name: "Shield", icon: Shield },
  { name: "Target", icon: Target },
  { name: "Terminal", icon: Terminal },
  { name: "Workflow", icon: Workflow },
];

// Map of icon names to components for quick lookup
const iconMap: Record<string, LucideIcon> = {
  Building,
  Building2,
  Command,
  AudioWaveform,
  GalleryVerticalEnd,
  Briefcase,
  Rocket,
  Zap,
  Star,
  Heart,
  Globe,
  Code,
  Cpu,
  Database,
  Layers,
  Package,
  Shield,
  Target,
  Terminal,
  Workflow,
};

// Get icon component by name, defaults to Building if not found
export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Building;
}

// Generate a slug from a team name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
