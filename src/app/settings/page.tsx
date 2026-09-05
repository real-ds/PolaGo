"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PreferencesService } from "@/core/preferences/PreferencesService";
import { AppPreferences } from "@/types";
import { Camera, RotateCcw, Check } from "lucide-react";

const prefService = new PreferencesService();

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<AppPreferences>(() => prefService.getAll());
  const [saved, setSaved] = useState(false);

  const updatePref = <K extends keyof AppPreferences>(
    key: K,
    value: AppPreferences[K]
  ) => {
    prefService.set(key, value);
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <header className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        <Link
          href="/"
          className="font-fredoka text-xl font-semibold text-foreground flex items-center gap-2"
        >
          <div className="bg-primary text-primary-foreground border-[3px] border-orange-600 rounded-2xl p-1.5 shadow-clay">
            <Camera className="h-5 w-5" />
          </div>
          POLA GO
        </Link>
        <h1 className="font-fredoka text-2xl font-semibold text-foreground">
          Settings
        </h1>
        <div />
      </header>

      <div className="max-w-md mx-auto flex flex-col gap-4">
        <Card>
          <CardContent className="p-5">
            <CardTitle className="text-lg mb-4">Theme</CardTitle>
            <div className="flex gap-2">
              {(["light", "dark", "cute"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updatePref("theme", t)}
                  className={`px-4 py-2 rounded-xl font-quicksand text-sm border-[3px] transition-all cursor-pointer ${
                    prefs.theme === t
                      ? "bg-primary text-primary-foreground border-orange-600 shadow-clay"
                      : "bg-card text-card-foreground border-border hover:border-secondary shadow-clay-sm"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <CardTitle className="text-lg mb-4">Countdown Duration</CardTitle>
            <div className="flex gap-2">
              {([3, 5, 10] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => updatePref("countdownDuration", d)}
                  className={`px-4 py-2 rounded-xl font-quicksand text-sm border-[3px] transition-all cursor-pointer ${
                    prefs.countdownDuration === d
                      ? "bg-primary text-primary-foreground border-orange-600 shadow-clay"
                      : "bg-card text-card-foreground border-border hover:border-secondary shadow-clay-sm"
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <CardTitle className="text-lg mb-4">Default Export</CardTitle>
            <div className="flex gap-2">
              {(["png", "jpeg", "jpg"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => updatePref("defaultExportFormat", f)}
                  className={`px-4 py-2 rounded-xl font-quicksand text-sm border-[3px] transition-all cursor-pointer ${
                    prefs.defaultExportFormat === f
                      ? "bg-primary text-primary-foreground border-orange-600 shadow-clay"
                      : "bg-card text-card-foreground border-border hover:border-secondary shadow-clay-sm"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex flex-col items-center gap-4">
            <CardTitle className="text-lg">Preferences</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                prefService.reset();
                setPrefs(prefService.getAll());
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>

        {saved && (
          <div className="flex items-center justify-center gap-2 text-green-700 font-quicksand font-semibold">
            <Check className="h-4 w-4" />
            Saved!
          </div>
        )}
      </div>
    </div>
  );
}
