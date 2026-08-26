"use client";

import { Music2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUPPORTED_LOCALES, useLocale } from "../i18n";
import { useSound } from "../lib/sound";

export function ExperienceControls({
  className,
  disabled = false,
  compact = false,
}: {
  className?: string;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { locale, setLocale, t } = useLocale();
  const sound = useSound();
  const musicLabel = sound.musicEnabled ? t("musicOn") : t("musicOff");

  const handleMusic = () => {
    if (sound.musicEnabled && !sound.musicPlaying) sound.startMusic();
    else sound.toggleMusic();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/90 p-1 text-slate-300 shadow-lg backdrop-blur",
        className,
      )}
      aria-label={t("languageLabel")}
      aria-hidden={disabled ? true : undefined}
    >
      <button
        type="button"
        onClick={sound.toggleMute}
        disabled={disabled}
        className="rounded-lg p-2 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
        aria-label={sound.muted ? t("unmuteAll") : t("muteAll")}
        title={sound.muted ? t("unmuteAll") : t("muteAll")}
      >
        {sound.muted
          ? <VolumeX className="h-4 w-4" />
          : <Volume2 className="h-4 w-4" />}
      </button>

      <button
        type="button"
        onClick={handleMusic}
        disabled={disabled || sound.muted}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50",
          sound.musicEnabled && "text-cyan-300",
        )}
        aria-label={musicLabel}
        aria-pressed={sound.musicEnabled}
        data-music-playing={sound.musicPlaying}
        title={musicLabel}
      >
        <Music2 className={cn("h-4 w-4", sound.musicPlaying && "animate-pulse")} />
        {!compact && <span className="hidden sm:inline">{t("music")}</span>}
      </button>

      <label className="relative">
        <span className="sr-only">{t("languageLabel")}</span>
        <select
          value={locale}
          onChange={event => setLocale(event.target.value as typeof locale)}
          disabled={disabled}
          aria-label={t("languageLabel")}
          className="h-8 cursor-pointer appearance-none rounded-lg border border-slate-700 bg-slate-900 pl-2 pr-6 text-xs font-bold text-slate-200 outline-none hover:bg-slate-800 focus:ring-2 focus:ring-cyan-500/60 disabled:pointer-events-none disabled:opacity-50"
        >
          {SUPPORTED_LOCALES.map(option => (
            <option key={option.code} value={option.code}>
              {compact ? option.shortLabel : option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-500" aria-hidden="true">▾</span>
      </label>
    </div>
  );
}
