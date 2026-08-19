export type NavItem = {
  to: string;
  label: string;
};

/** Основная навигация приложения (Header, Footer). */
export const NAV_LINKS: readonly NavItem[] = [
  { to: '/', label: 'Главная' },
  { to: '/products', label: 'Товары' },
] as const;
