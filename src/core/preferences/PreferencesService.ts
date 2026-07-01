import { AppPreferences, DEFAULT_PREFERENCES } from "@/types";

const STORAGE_KEY = "polago-preferences";

export class PreferencesService {
  private current: AppPreferences;

  constructor() {
    this.current = this.load();
  }

  private load(): AppPreferences {
    if (typeof window === "undefined") return { ...DEFAULT_PREFERENCES };
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch {
    }
    return { ...DEFAULT_PREFERENCES };
  }

  private save(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.current));
    } catch {
    }
  }

  get<K extends keyof AppPreferences>(key: K): AppPreferences[K] {
    return this.current[key];
  }

  set<K extends keyof AppPreferences>(key: K, value: AppPreferences[K]): void {
    this.current[key] = value;
    this.save();
  }

  getAll(): AppPreferences {
    return { ...this.current };
  }

  reset(): void {
    this.current = { ...DEFAULT_PREFERENCES };
    this.save();
  }
}
