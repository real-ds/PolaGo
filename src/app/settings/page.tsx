"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PreferencesService } from "@/core/preferences/PreferencesService";
import { AppPreferences } from "@/types";

const prefService = new PreferencesService();

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<AppPreferences>(() => prefService.getAll());
  const [saved, setSaved] = useState(false);

  const updatePref = <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    prefService.set(key, value);
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-8">
        <Link href="/" className="font-fredoka text-xl text-pink-600">
          POLA GO
        </Link>
        <h1 className="font-fredoka text-2xl text-pink-700">Settings</h1>
        <div />
      </header>

      <div className="max-w-md mx-auto flex flex-col gap-4">
        <Card className="p-5">
          <h2 className="font-fredoka text-lg text-pink-700 mb-4">Theme</h2>
          <div className="flex gap-2">
            {(["light", "dark", "cute"] as const).map((t) => (
              <button
                key={t}
                onClick={() => updatePref("theme", t)}
                className={`px-4 py-2 rounded-xl font-quicksand text-sm border transition-all ${
                  prefs.theme === t
                    ? "bg-pink-400 text-white border-pink-400"
                    : "bg-white text-gray-600 border-pink-200 hover:bg-pink-50"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-fredoka text-lg text-pink-700 mb-4">Countdown Duration</h2>
          <div className="flex gap-2">
            {([3, 5, 10] as const).map((d) => (
              <button
                key={d}
                onClick={() => updatePref("countdownDuration", d)}
                className={`px-4 py-2 rounded-xl font-quicksand text-sm border transition-all ${
                  prefs.countdownDuration === d
                    ? "bg-pink-400 text-white border-pink-400"
                    : "bg-white text-gray-600 border-pink-200 hover:bg-pink-50"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-fredoka text-lg text-pink-700 mb-4">Default Export</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="font-quicksand text-xs text-gray-500 mb-1 block">Format</label>
              <div className="flex gap-2">
                {(["png", "jpeg", "jpg"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => updatePref("defaultExportFormat", f)}
                    className={`px-4 py-2 rounded-xl font-quicksand text-sm border transition-all ${
                      prefs.defaultExportFormat === f
                        ? "bg-pink-400 text-white border-pink-400"
                        : "bg-white text-gray-600 border-pink-200 hover:bg-pink-50"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-fredoka text-lg text-pink-700 mb-4">Preferences</h2>
          <Button variant="danger" size="sm" onClick={() => { prefService.reset(); setPrefs(prefService.getAll()); setSaved(true); setTimeout(() => setSaved(false), 1500); }}>
            Reset to Defaults
          </Button>
        </Card>

        {saved && (
          <p className="text-center font-quicksand text-sm text-green-600">Saved!</p>
        )}
      </div>
    </div>
  );
}
