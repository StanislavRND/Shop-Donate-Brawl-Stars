import { Send } from 'lucide-react';

import { TELEGRAM_URL } from '@/shared/config/links';

import styles from './TelegramLink.module.scss';

type TelegramLinkProps = {
  /** pill — компактная кнопка-капсула, block — широкая кнопка на всю ширину. */
  variant?: 'pill' | 'block';
  /** Дополнительный класс для адаптивного управления видимостью. */
  className?: string;
};

export const TelegramLink = ({
  variant = 'pill',
  className,
}: TelegramLinkProps) => (
  <a
    href={TELEGRAM_URL}
    target="_blank"
    rel="noreferrer"
    className={[styles.link, variant === 'block' && styles.block, className]
      .filter(Boolean)
      .join(' ')}
  >
    <Send size={18} className={styles.icon} />
    Telegram
  </a>
);
