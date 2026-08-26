export const THEME_STORAGE_KEY = "data-room-theme";

export type ThemeName = "light" | "dark";

export function isThemeName(value: string | null | undefined): value is ThemeName {
  return value === "light" || value === "dark";
}

/**
 * Runs before paint so the first frame matches localStorage / OS preference.
 * Keep the storage key in sync with ThemeProvider.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
