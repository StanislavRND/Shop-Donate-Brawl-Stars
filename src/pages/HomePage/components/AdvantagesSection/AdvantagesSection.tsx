import { Container } from '@/shared/ui/Container/Container';

import { ADVANTAGES } from '../../constants';
import styles from './AdvantagesSection.module.scss';

export const AdvantagesSection = () => {
  return (
    <section className={styles.section} aria-label="Преимущества магазина">
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.ring} />
        <span className={styles.dotFirst} />
        <span className={styles.dotSecond} />
        <span className={styles.plus} />
        <span className={styles.line} />
        <span className={styles.square} />
      </div>

      <Container>
        <h2 className={styles.title}>Почему выбирают нас</h2>
        <ul className={styles.list}>
          {ADVANTAGES.map(({ icon: Icon, title, text }) => (
            <li key={title} className={styles.card}>
              <span className={styles.cardIcon}>
                <Icon size={24} />
              </span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
