import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsStore {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'vi';
  reducedMotion: boolean;
  quickPaste: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'en' | 'vi') => void;
  setReducedMotion: (enabled: boolean) => void;
  setQuickPaste: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      reducedMotion: false,
      quickPaste: true,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setQuickPaste: (quickPaste) => set({ quickPaste }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? window.localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
    }
  )
);
