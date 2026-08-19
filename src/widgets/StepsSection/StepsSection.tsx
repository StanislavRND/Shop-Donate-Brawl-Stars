import { Container } from '@/shared/ui/Container/Container';

import { STEPS } from './constants';
import styles from './StepsSection.module.scss';

export const StepsSection = () => {
  return (
    <section className={styles.section} aria-label="Как проходит донат">
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.ring} />
        <span className={styles.dotFirst} />
        <span className={styles.dotSecond} />
        <span className={styles.plus} />
      </div>

      <Container>
        <h2 className={styles.title}>Как проходит донат?</h2>
        <ol className={styles.list}>
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className={styles.step}>
              <span className={styles.marker}>
                <Icon size={22} className={styles.markerIcon} />
              </span>
              <div className={styles.content}>
                <span className={styles.number}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepText}>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
};
