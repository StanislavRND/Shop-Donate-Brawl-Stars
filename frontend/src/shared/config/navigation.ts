import type { LucideIcon } from 'lucide-react';
import { Home, ShoppingBag } from 'lucide-react';

export type NavItem = {
  to: string;
  label: string;
  /** Иконка пункта — используется в мобильном меню. */
  icon: LucideIcon;
};

/** Основная навигация приложения (Header, Footer). */
export const NAV_LINKS: readonly NavItem[] = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/products', label: 'Товары', icon: ShoppingBag },
] as const;
