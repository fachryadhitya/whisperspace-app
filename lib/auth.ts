"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserPreferences {
  ageGroup: string;
  supportCategory: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userPreferences: UserPreferences | null;
  setAuthenticated: (preferences: UserPreferences) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userPreferences: null,
      setAuthenticated: (preferences) =>
        set({ isAuthenticated: true, userPreferences: preferences }),
      logout: () => set({ isAuthenticated: false, userPreferences: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userPreferences: state.userPreferences,
      }),
    }
  )
);
