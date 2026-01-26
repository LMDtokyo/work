import { create } from "zustand";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

const useTheme = create<ThemeStore>((set) => ({
  theme: "dark",
  setTheme: (theme: string) => set({ theme }),
}));

export default useTheme;
