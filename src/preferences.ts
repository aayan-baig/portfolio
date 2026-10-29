export type Theme = "midnight" | "evergreen" | "graphite";
export type Preferences = { theme: Theme };

export const PREFERENCES_KEY = "aayan-portfolio-preferences-v2";
export const DEFAULT_PREFERENCES: Readonly<Preferences> = { theme: "midnight" };

export function loadPreferences(): Preferences {
  const defaults = { ...DEFAULT_PREFERENCES };
  try {
    const stored = window.localStorage.getItem(PREFERENCES_KEY);
    if (stored !== null) {
      const saved: unknown = JSON.parse(stored);
      if (!saved || typeof saved !== "object" || !("theme" in saved)) return defaults;
      const theme = saved.theme;
      return theme === "midnight" || theme === "evergreen" || theme === "graphite"
        ? { theme } : defaults;
    }
    // Carry forward the old appearance choice without retaining desktop state.
    const legacy: unknown = JSON.parse(window.localStorage.getItem("aayan-portfolio-preferences-v1") ?? "null");
    if (legacy && typeof legacy === "object" && "appearance" in legacy) {
      if (legacy.appearance === "classic") return { theme: "graphite" };
    }
    return defaults;
  } catch {
    return defaults;
  }
}

export function savePreferences(preferences: Preferences): void {
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // The chosen theme still works for this visit if local storage is unavailable.
  }
}
