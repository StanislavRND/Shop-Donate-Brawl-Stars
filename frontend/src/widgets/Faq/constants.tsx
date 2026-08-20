import type { ReactNode } from 'react';

import styles from './Faq.module.scss';

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: 'Насколько быстро проходит донат?',
    answer: (
      <>
        Если вы оперативно отправляете почту и код подтверждения, заказ обычно
        выполняется за{' '}
        <strong className={styles.answerAccent}>5–10 минут</strong>, при
        отсутствии очереди.
      </>
    ),
  },
  {
    question: 'Не будет ли блокировки аккаунта?',
    answer: (
      <>
        Покупка проходит безопасно через специальный защищённый прокси. Мы не
        используем сторонние способы доступа и соблюдаем безопасный процесс
        проведения покупки.
      </>
    ),
  },
  {
    question: 'Что делать, если возникла проблема с заказом?',
    answer: (
      <>
        Обратитесь в нашу поддержку через Telegram — поможем разобраться с
        заказом и решить возникшую проблему.
      </>
    ),
  },
] as const;
