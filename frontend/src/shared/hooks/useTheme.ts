import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'theme';
const DEFAULT_THEME: Theme = 'dark';

const themes: readonly Theme[] = ['dark', 'light'];

const isTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && (themes as readonly string[]).includes(value);

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : DEFAULT_THEME;
};

const listeners = new Set<() => void>();

const getSnapshot = (): Theme => {
  const current = document.documentElement.dataset.theme;
  return isTheme(current) ? current : DEFAULT_THEME;
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Применяет сохранённую тему до первого рендера (вызывается в main.tsx). */
export const initTheme = (): void => {
  document.documentElement.dataset.theme = getInitialTheme();
};

/**
 * Тема приложения: `<html data-theme="dark|light">` + сохранение выбора.
 * Все потребители хука синхронизированы через useSyncExternalStore.
 * Значения цветов определены в shared/styles/_themes.scss.
 */
export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_THEME);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_STORAGE_KEY, next);
    listeners.forEach((notify) => notify());
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(getSnapshot() === 'dark' ? 'light' : 'dark');
  }, [applyTheme]);

  return { theme, toggleTheme };
};
