import { BadgePercent, MessageSquare } from 'lucide-react';

import { Container } from '@/shared/ui/Container/Container';

import styles from './SpecialSection.module.scss';

export const SpecialSection = () => {
  return (
    <section
      id="panel-special"
      role="tabpanel"
      aria-labelledby="tab-special"
      className={styles.section}
    >
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.ringBig} />
        <span className={styles.ringSmall} />
        <span className={styles.dotFirst} />
        <span className={styles.dotSecond} />
        <span className={styles.plus} />
      </div>

      <Container>
        <div className={styles.inner}>
          <div className={styles.iconWrap}>
            <span className={styles.iconRing} aria-hidden="true" />
            <span className={styles.icon}>
              <BadgePercent size={28} />
            </span>
          </div>

          <h2 className={styles.title}>Есть специальное предложение?</h2>
          <p className={styles.text}>
            Отправьте скриншот предложения — продавец рассчитает его стоимость.
          </p>

          <p className={styles.formula}>
            Цена = цена предложения в игре{' '}
            <span className={styles.formulaAccent}>+ 12%</span>
          </p>

          <button type="button" className={styles.chatButton}>
            <MessageSquare size={18} className={styles.chatIcon} />
            Написать в чат
          </button>
        </div>
      </Container>
    </section>
  );
};
