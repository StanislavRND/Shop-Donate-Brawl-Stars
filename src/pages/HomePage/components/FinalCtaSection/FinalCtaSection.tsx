import { Container } from '@/shared/ui/Container/Container';
import { CtaButton } from '@/shared/ui/CtaButton/CtaButton';

import styles from './FinalCtaSection.module.scss';

export const FinalCtaSection = () => {
  return (
    <section className={styles.section} aria-label="Переход к товарам">
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.ring} />
        <span className={styles.dotFirst} />
        <span className={styles.dotSecond} />
        <span className={styles.plus} />
      </div>

      <Container>
        <div className={styles.inner}>
          <h2 className={styles.title}>
            Готовы получить донат на свой аккаунт?
          </h2>
          <p className={styles.text}>
            Выберите нужный товар и получите донат быстро, удобно и безопасно.
          </p>
          <CtaButton to="/products">Перейти к товарам</CtaButton>
        </div>
      </Container>
    </section>
  );
};
