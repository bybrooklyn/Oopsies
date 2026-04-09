export type ThemeName = 'dark' | 'light';

const THEME_STORAGE_KEY = 'oopsies-theme';

function canUseBrowserApis(): boolean {
  return typeof document !== 'undefined' && typeof window !== 'undefined';
}

export function getStoredTheme(): ThemeName | null {
  if (!canUseBrowserApis()) {
    return null;
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (value === 'dark' || value === 'light') {
    return value;
  }

  return null;
}

export function getPreferredTheme(): ThemeName {
  if (!canUseBrowserApis() || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getTheme(): ThemeName {
  if (!canUseBrowserApis()) {
    return 'light';
  }

  const current = document.documentElement.dataset.theme;

  if (current === 'dark' || current === 'light') {
    return current;
  }

  return getStoredTheme() ?? getPreferredTheme();
}

export function setTheme(theme: ThemeName): ThemeName {
  if (!canUseBrowserApis()) {
    return theme;
  }

  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);

  return theme;
}

export function toggleTheme(): ThemeName {
  return setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function clearThemePreference(): void {
  if (!canUseBrowserApis()) {
    return;
  }

  window.localStorage.removeItem(THEME_STORAGE_KEY);
  document.documentElement.dataset.theme = getPreferredTheme();
}
