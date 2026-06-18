import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  ageVerified: boolean;
  setAgeVerified: (v: boolean) => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      ageVerified: false,
      setAgeVerified: (v) => set({ ageVerified: v }),

      isDarkMode: true,
      toggleDarkMode: () => set(s => ({ isDarkMode: !s.isDarkMode })),
    }),
    {
      name: 'oddslens-app',
      partialize: state => ({ ageVerified: state.ageVerified, isDarkMode: state.isDarkMode }),
    },
  ),
);
