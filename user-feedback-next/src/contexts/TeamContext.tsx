"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export interface Team {
  _id: Id<"teams">;
  name: string;
  slug: string;
  plan: string;
  iconName: string;
  ownerId: Id<"users">;
  createdAt: number;
  role: string;
  brandColor?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  tagline?: string | null;
  description?: string | null;
}

interface TeamContextType {
  teams: Team[];
  activeTeam: Team | null;
  setActiveTeam: (team: Team) => void;
  isLoading: boolean;
}

const TeamContext = createContext<TeamContextType | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const teamsData = useQuery(api.teams.listUserTeams);
  const [activeTeam, setActiveTeamState] = useState<Team | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Cast the teams data to our Team type
  const teams = (teamsData as Team[]) || [];

  // Initialize active team from localStorage or first team
  useEffect(() => {
    if (teams.length > 0 && !initialized) {
      const savedTeamId = localStorage.getItem("activeTeamId");
      const savedTeam = teams.find((t) => t._id === savedTeamId);
      setActiveTeamState(savedTeam || teams[0]);
      setInitialized(true);
    } else if (teams.length === 0 && teamsData !== undefined) {
      // Teams loaded but empty
      setInitialized(true);
    }
  }, [teams, teamsData, initialized]);

  // Update active team if it was deleted or user was removed
  useEffect(() => {
    if (initialized && activeTeam && teams.length > 0) {
      const stillMember = teams.find((t) => t._id === activeTeam._id);
      if (!stillMember) {
        // Active team no longer accessible, switch to first available
        setActiveTeamState(teams[0]);
        localStorage.setItem("activeTeamId", teams[0]._id);
      }
    }
  }, [teams, activeTeam, initialized]);

  const setActiveTeam = (team: Team) => {
    setActiveTeamState(team);
    localStorage.setItem("activeTeamId", team._id);
  };

  const isLoading = teamsData === undefined;

  return (
    <TeamContext.Provider
      value={{
        teams,
        activeTeam,
        setActiveTeam,
        isLoading,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within TeamProvider");
  }
  return context;
}
