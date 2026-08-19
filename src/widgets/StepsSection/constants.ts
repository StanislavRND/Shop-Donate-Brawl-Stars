import type { LucideIcon } from 'lucide-react';
import { Coins, KeyRound, LogOut, Mail, ShoppingBag } from 'lucide-react';

export type StepItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export const STEPS: readonly StepItem[] = [
  {
    icon: ShoppingBag,
    title: 'Выберите товар',
    text: 'Выбираете нужный товар и оплачиваете заказ.',
  },
  {
    icon: Mail,
    title: 'Укажите почту',
    text: 'Отправляете почту, привязанную к вашему Supercell ID.',
  },
  {
    icon: KeyRound,
    title: 'Подтвердите вход',
    text: 'Получаете код подтверждения на почту и передаёте его продавцу.',
  },
  {
    icon: Coins,
    title: 'Получите донат',
    text: 'Продавец заходит в аккаунт и совершает необходимую покупку.',
  },
  {
    icon: LogOut,
    title: 'Подтверждение выхода',
    text: 'После завершения покупки продавец выходит из аккаунта и отправляет видео, подтверждающее выход.',
  },
] as const;
