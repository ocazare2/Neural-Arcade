"use client";

import { Component, type ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { recoverPersistedArcadeState } from "../recovery";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught:", error, errorInfo);
    } else {
      console.error("[Neural Arcade] La interfaz activó su recuperación segura");
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // Preserve progress while returning to a known-safe screen. If the stored
    // value itself is malformed, remove it so hydration can start cleanly.
    try {
      const stored = localStorage.getItem("neural-arcade-v2");
      const recovered = recoverPersistedArcadeState(stored);
      if (recovered) localStorage.setItem("neural-arcade-v2", recovered);
      else localStorage.removeItem("neural-arcade-v2");
    } catch {
      try {
        localStorage.removeItem("neural-arcade-v2");
      } catch {
        // El navegador bloqueó por completo el almacenamiento; la recarga aún funciona.
      }
    }
    // Reload to ensure clean state
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full rounded-2xl border border-rose-500/40 bg-slate-900/80 p-6 text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/15 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-rose-300">Algo se rompió</h2>
            <p className="text-sm text-slate-400">
              Neural Arcade encontró un error inesperado. Tu progreso está seguro.
              Recarga para continuar.
            </p>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details className="text-left text-xs text-slate-500 bg-slate-950/60 rounded-lg p-2">
                <summary className="cursor-pointer">Detalles técnicos</summary>
                <pre className="mt-2 whitespace-pre-wrap break-all">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-sm text-[#0a0414] hover:bg-cyan-400 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Recargar
            </button>
          </motion.div>
        </div>
      );
    }
    return this.props.children;
  }
}
