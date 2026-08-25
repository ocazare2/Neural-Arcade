/**
 * Conserva progreso y XP, pero descarta la pantalla activa que pudo causar
 * el error. Devuelve null cuando el almacenamiento no se puede recuperar.
 */
export function recoverPersistedArcadeState(stored: string | null): string | null {
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    if (typeof parsed !== "object" || parsed === null) return null;
    const state = parsed.state;
    if (typeof state !== "object" || state === null) return null;
    return JSON.stringify({
      ...parsed,
      state: {
        ...(state as Record<string, unknown>),
        activeLevel: null,
        activePhase: "theory",
      },
    });
  } catch {
    return null;
  }
}
