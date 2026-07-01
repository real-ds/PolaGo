import { describe, it, expect, beforeEach } from "vitest";
import { PreferencesService } from "../PreferencesService";
import { DEFAULT_PREFERENCES } from "../../../types";

describe("PreferencesService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return default preferences when nothing is stored", () => {
    const service = new PreferencesService();
    const all = service.getAll();
    expect(all.theme).toBe("cute");
    expect(all.countdownDuration).toBe(3);
    expect(all.defaultExportFormat).toBe("png");
  });

  it("should set and get a preference", () => {
    const service = new PreferencesService();
    service.set("theme", "dark");
    expect(service.get("theme")).toBe("dark");
  });

  it("should persist to localStorage", () => {
    const service = new PreferencesService();
    service.set("theme", "dark");
    const stored = JSON.parse(localStorage.getItem("polago-preferences")!);
    expect(stored.theme).toBe("dark");
  });

  it("should load persisted preferences from localStorage", () => {
    localStorage.setItem(
      "polago-preferences",
      JSON.stringify({ ...DEFAULT_PREFERENCES, theme: "light" })
    );
    const service = new PreferencesService();
    expect(service.get("theme")).toBe("light");
  });

  it("should reset to defaults", () => {
    const service = new PreferencesService();
    service.set("theme", "dark");
    service.set("countdownDuration", 10);
    service.reset();
    expect(service.get("theme")).toBe("cute");
    expect(service.get("countdownDuration")).toBe(3);
  });
});
