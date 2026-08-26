"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mascot } from "./Mascot";
import { PulseButton } from "./Polish";
import { readBooleanFlag, writeBooleanFlag } from "../storage";
import { useLocale } from "../i18n";
import { ExperienceControls } from "./ExperienceControls";

const ONBOARDED_KEY = "neural-arcade-onboarded";

export function hasBeenOnboarded(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return readBooleanFlag(window.localStorage, ONBOARDED_KEY, true);
  } catch {
    return true;
  }
}

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { t } = useLocale();
  const [screen, setScreen] = useState(0);
  const [typed, setTyped] = useState("");

  const screens = [
    {
      mascotMood: "idle" as const,
      text: t("onboarding1"),
      btn: t("onboarding1Button"),
    },
    {
      mascotMood: "thinking" as const,
      text: t("onboarding2"),
      btn: t("onboarding2Button"),
    },
    {
      mascotMood: "excited" as const,
      text: t("onboarding3"),
      btn: t("onboarding3Button"),
    },
  ];

  const current = screens[screen];

  const persistOnboarded = () => {
    try {
      writeBooleanFlag(window.localStorage, ONBOARDED_KEY);
    } catch {
      // Algunas políticas de privacidad bloquean incluso el acceso al objeto storage.
    }
  };

  useEffect(() => {
    setTyped("");
    let i = 0;
    const text = current.text;
    const interval = setInterval(() => {
      if (i < text.length) {
        setTyped(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [screen, current.text]);

  const handleNext = () => {
    if (screen < screens.length - 1) {
      setScreen(screen + 1);
    } else {
      persistOnboarded();
      onComplete();
    }
  };

  const handleSkip = () => {
    persistOnboarded();
    onComplete();
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleSkip();
      return;
    }
    if (event.key !== "Tab") return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), select:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )];
    if (controls.length === 0) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-message"
      onKeyDown={handleDialogKeyDown}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-6"
      style={{ background: "radial-gradient(ellipse at center, #1e0a3c 0%, #0d0518 70%)" }}
    >
      <ExperienceControls compact className="absolute left-3 top-3" />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-xs text-slate-500 hover:text-slate-300 transition"
      >
        {t("skip")}
      </button>

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
        {screens.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition ${i === screen ? "bg-cyan-400" : "bg-slate-700"}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex flex-col items-center gap-6 max-w-md text-center"
        >
          <Mascot mood={current.mascotMood} size={140} trackCursor={false} />

          <div className="min-h-[60px] flex items-center">
            <p id="onboarding-message" className="text-base sm:text-lg text-slate-100 leading-relaxed">
              {typed}
              <span className="animate-pulse">▊</span>
            </p>
          </div>

          <PulseButton autoFocus onClick={handleNext} color="#22d3ee" className="px-8 py-3 text-base">
            {current.btn}
          </PulseButton>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
