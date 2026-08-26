// Procedural sound and background music — Web Audio API, zero asset files.
import { useCallback, useEffect, useState } from "react";

export type SoundType =
  | "success" | "wrong" | "combo" | "levelUp"
  | "tick" | "whooshUp" | "sparkle" | "fire";

export interface AudioSettings {
  muted: boolean;
  music: boolean;
}

interface AudioSnapshot extends AudioSettings {
  musicPlaying: boolean;
}

const SOUND_STORAGE_KEY = "neural-arcade-sound";
const DEFAULT_AUDIO_SETTINGS: AudioSettings = { muted: false, music: true };

// A quiet, four-chord ambient loop. Keeping it procedural makes the PWA fully
// offline and avoids shipping or licensing an audio asset.
const BACKGROUND_CHORDS = [
  [130.81, 164.81, 196.0],
  [146.83, 174.61, 220.0],
  [110.0, 130.81, 164.81],
  [98.0, 123.47, 146.83],
] as const;

let audioCtx: AudioContext | null = null;
let settings: AudioSettings = { ...DEFAULT_AUDIO_SETTINGS };
let settingsHydrated = false;
let audioUnlocked = false;
let musicMaster: GainNode | null = null;
let musicVoices: OscillatorNode[] = [];
let chordTimer: ReturnType<typeof setInterval> | null = null;
let chordIndex = 0;
const subscribers = new Set<(snapshot: AudioSnapshot) => void>();

export function normalizeAudioSettings(stored: string | null): AudioSettings {
  if (stored === null) return { ...DEFAULT_AUDIO_SETTINGS };

  // Migration from the original preference, which stored only the mute flag.
  if (stored === "true" || stored === "false") {
    return { muted: stored === "true", music: true };
  }

  try {
    const parsed = JSON.parse(stored) as Partial<AudioSettings> | null;
    if (!parsed || typeof parsed !== "object") return { ...DEFAULT_AUDIO_SETTINGS };
    return {
      muted: typeof parsed.muted === "boolean" ? parsed.muted : false,
      music: typeof parsed.music === "boolean" ? parsed.music : true,
    };
  } catch {
    return { ...DEFAULT_AUDIO_SETTINGS };
  }
}

function snapshot(): AudioSnapshot {
  return {
    ...settings,
    musicPlaying: musicVoices.length > 0 && !settings.muted && settings.music,
  };
}

function emit(): void {
  const next = snapshot();
  for (const subscriber of subscribers) subscriber(next);
}

function persistSettings(): void {
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable in privacy modes; audio still works in-memory.
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const BrowserAudioContext = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!BrowserAudioContext) return null;
  if (!audioCtx) audioCtx = new BrowserAudioContext();
  return audioCtx;
}

async function getRunningCtx(): Promise<AudioContext | null> {
  const ctx = getCtx();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }
  audioUnlocked = ctx.state === "running";
  return audioUnlocked ? ctx : null;
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.15,
): void {
  const osc = ctx.createOscillator();
  const volume = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  volume.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  volume.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
  volume.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  osc.connect(volume);
  volume.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}

export function playSound(type: SoundType, muted = false): void {
  if (muted || settings.muted) return;
  void getRunningCtx().then(ctx => {
    if (!ctx || settings.muted) return;
    const t = 0;
    switch (type) {
      case "success":
        tone(ctx, 523, t, 0.1, "sine", 0.15);
        tone(ctx, 659, t + 0.08, 0.1, "sine", 0.15);
        tone(ctx, 784, t + 0.16, 0.15, "sine", 0.15);
        break;
      case "wrong":
        tone(ctx, 220, t, 0.2, "sawtooth", 0.12);
        tone(ctx, 180, t + 0.1, 0.2, "sawtooth", 0.1);
        break;
      case "combo":
        tone(ctx, 660, t, 0.08, "triangle", 0.12);
        tone(ctx, 880, t + 0.05, 0.08, "triangle", 0.12);
        break;
      case "levelUp":
        tone(ctx, 523, t, 0.12, "sine", 0.15);
        tone(ctx, 659, t + 0.1, 0.12, "sine", 0.15);
        tone(ctx, 784, t + 0.2, 0.12, "sine", 0.15);
        tone(ctx, 1047, t + 0.3, 0.2, "sine", 0.15);
        break;
      case "tick":
        tone(ctx, 1200, t, 0.03, "square", 0.05);
        break;
      case "whooshUp":
        tone(ctx, 400, t, 0.15, "sine", 0.1);
        tone(ctx, 800, t + 0.05, 0.15, "sine", 0.1);
        tone(ctx, 1600, t + 0.1, 0.1, "sine", 0.08);
        break;
      case "sparkle":
        tone(ctx, 2093, t, 0.08, "triangle", 0.1);
        tone(ctx, 2637, t + 0.04, 0.08, "triangle", 0.1);
        tone(ctx, 3136, t + 0.08, 0.08, "triangle", 0.1);
        break;
      case "fire":
        tone(ctx, 150, t, 0.3, "sawtooth", 0.15);
        tone(ctx, 300, t + 0.05, 0.2, "square", 0.08);
        break;
    }
  });
}

async function startBackgroundMusic(): Promise<boolean> {
  if (settings.muted || !settings.music || musicVoices.length > 0) {
    return musicVoices.length > 0;
  }
  const ctx = await getRunningCtx();
  if (!ctx || settings.muted || !settings.music) return false;
  // Two gesture listeners may resolve the same resume() concurrently.
  if (musicVoices.length > 0) return true;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.028, ctx.currentTime + 0.8);
  master.connect(ctx.destination);

  chordIndex = 0;
  musicVoices = BACKGROUND_CHORDS[0].map((frequency, index) => {
    const oscillator = ctx.createOscillator();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.connect(master);
    oscillator.start();
    return oscillator;
  });
  musicMaster = master;

  chordTimer = setInterval(() => {
    if (!audioCtx || musicVoices.length === 0) return;
    chordIndex = (chordIndex + 1) % BACKGROUND_CHORDS.length;
    const nextChord = BACKGROUND_CHORDS[chordIndex];
    musicVoices.forEach((voice, index) => {
      voice.frequency.exponentialRampToValueAtTime(
        nextChord[index],
        audioCtx!.currentTime + 1.2,
      );
    });
  }, 4400);
  emit();
  return true;
}

function stopBackgroundMusic(): void {
  if (chordTimer) clearInterval(chordTimer);
  chordTimer = null;
  const voices = musicVoices;
  const master = musicMaster;
  const ctx = audioCtx;
  musicVoices = [];
  musicMaster = null;

  if (ctx && master) {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    window.setTimeout(() => {
      for (const voice of voices) {
        try { voice.stop(); } catch { /* already stopped */ }
        voice.disconnect();
      }
      master.disconnect();
    }, 300);
  }
  emit();
}

function updateSettings(next: AudioSettings): void {
  settings = next;
  persistSettings();
  if (settings.muted || !settings.music) stopBackgroundMusic();
  else void startBackgroundMusic();
  emit();
}

export function useSound(): {
  play: (type: SoundType) => void;
  muted: boolean;
  musicEnabled: boolean;
  musicPlaying: boolean;
  startMusic: () => void;
  toggleMute: () => void;
  toggleMusic: () => void;
} {
  const [current, setCurrent] = useState<AudioSnapshot>(() => snapshot());

  useEffect(() => {
    if (!settingsHydrated) {
      try {
        settings = normalizeAudioSettings(window.localStorage.getItem(SOUND_STORAGE_KEY));
      } catch {
        settings = { ...DEFAULT_AUDIO_SETTINGS };
      }
      settingsHydrated = true;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the external audio preference after SSR
    setCurrent(snapshot());
    subscribers.add(setCurrent);

    // Browsers require a user gesture before Web Audio can run. The first tap
    // or keyboard action unlocks the context and starts the opted-in music.
    const unlock = () => {
      // Keep resume()/AudioContext creation in the trusted-event call stack;
      // iOS Safari may reject audio if it is deferred even by one timer tick.
      if (!settings.muted && settings.music) void startBackgroundMusic();
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);

    const onVisibility = () => {
      if (document.hidden) stopBackgroundMusic();
      else if (audioUnlocked && !settings.muted && settings.music) void startBackgroundMusic();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      subscribers.delete(setCurrent);
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const toggleMute = useCallback(() => {
    updateSettings({ ...settings, muted: !settings.muted });
  }, []);

  const toggleMusic = useCallback(() => {
    updateSettings({ ...settings, music: !settings.music });
  }, []);

  const startMusic = useCallback(() => {
    void startBackgroundMusic();
  }, []);

  const play = useCallback((type: SoundType) => {
    playSound(type);
  }, []);

  return {
    play,
    muted: current.muted,
    musicEnabled: current.music,
    musicPlaying: current.musicPlaying,
    startMusic,
    toggleMute,
    toggleMusic,
  };
}
