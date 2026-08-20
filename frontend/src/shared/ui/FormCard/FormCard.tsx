import type { ReactNode } from 'react';

import { Container } from '@/shared/ui/Container/Container';

import styles from './FormCard.module.scss';

type FormCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** Карточка-обёртка форм авторизации и регистрации. */
export const FormCard = ({ title, subtitle, children }: FormCardProps) => {
  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.ring} />
      </div>

      <Container>
        <div className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          {children}
        </div>
      </Container>
    </section>
  );
};
