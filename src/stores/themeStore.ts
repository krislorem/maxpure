// src/stores/themeStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface ThemeState {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set) => ({
      theme: 'light',
      toggleTheme: () => set((draft) => {
        draft.theme = draft.theme === 'light' ? 'dark' : 'light'
      })
    })),
    {
      name: 'theme', // localStorage key
      storage: createJSONStorage(() => localStorage)
    }
  )
)
