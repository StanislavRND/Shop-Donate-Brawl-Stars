import type { LucideIcon } from 'lucide-react';
import { Gem, ShieldCheck, Zap } from 'lucide-react';

export type AdvantageItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const ADVANTAGES: readonly AdvantageItem[] = [
  {
    icon: Zap,
    title: 'Быстро',
    text: 'Моментальная обработка заказа без лишнего ожидания.',
  },
  {
    icon: ShieldCheck,
    title: 'Безопасно',
    text: 'Надёжная покупка с защитой ваших данных и аккаунта.',
  },
  {
    icon: Gem,
    title: 'Выгодно',
    text: 'Гемы, Brawl Pass и специальные предложения по привлекательным ценам.',
  },
] as const;
