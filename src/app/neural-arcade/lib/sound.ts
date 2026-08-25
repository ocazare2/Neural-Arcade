// Sound system — procedural Web Audio API, zero asset files.
import { useState, useEffect, useCallback } from "react";

export type SoundType =
  | "success" | "wrong" | "combo" | "levelUp"
  | "tick" | "whooshUp" | "sparkle" | "fire";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(ctx: AudioContext, freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.15) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}


export function playSound(type: SoundType, muted = false): void {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
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
}


export function useSound(): {
  play: (type: SoundType) => void;
  muted: boolean;
  toggleMute: () => void;
} {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("neural-arcade-sound");
      if (stored !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMuted(stored === "true");
      }
    } catch { /* SSR */ }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      try { localStorage.setItem("neural-arcade-sound", String(next)); } catch { /* */ }
      return next;
    });
  }, []);

  const play = useCallback((type: SoundType) => {
    playSound(type, muted);
  }, [muted]);

  return { play, muted, toggleMute };
}
