"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { AppPreferences } from "@/types";
import { PreferencesService } from "@/core/preferences/PreferencesService";

interface ThemeContextValue {
  theme: "light" | "dark" | "cute";
  setTheme: (theme: "light" | "dark" | "cute") => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "cute",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function ThemeProvider({ children, prefService }: { children: ReactNode; prefService?: PreferencesService }) {
  const prefs = prefService ?? new PreferencesService();
  const [theme, setThemeState] = useState<"light" | "dark" | "cute">(() => prefs.get("theme"));

  const setTheme = useCallback(
    (t: "light" | "dark" | "cute") => {
      setThemeState(t);
      prefs.set("theme", t);
    },
    [prefs]
  );

  const resolvedTheme: "light" | "dark" =
    theme === "dark" ? "dark" : "light";

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
