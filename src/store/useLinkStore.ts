import { create } from "zustand";
import { Profile } from "@/types";
import { MOCK_PROFILES } from "@/data/mockData";

interface LinkState {
  currentProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfileByUsername: (username: string) => void;
  // In a real app, we'd have update/add/delete actions here for the admin side
}

export const useLinkStore = create<LinkState>((set) => ({
  currentProfile: null,
  isLoading: false,
  error: null,

  fetchProfileByUsername: (username: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API call
    setTimeout(() => {
      const profile = MOCK_PROFILES.find((p) => p.username === username);
      
      if (profile) {
        set({ currentProfile: profile, isLoading: false });
      } else {
        set({ error: "Profile not found", isLoading: false, currentProfile: null });
      }
    }, 500); // 500ms delay to simulate network
  },
}));
