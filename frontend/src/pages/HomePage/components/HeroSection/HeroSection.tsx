import { Container } from '@/shared/ui/Container/Container';
import { CtaButton } from '@/shared/ui/CtaButton/CtaButton';

import styles from './HeroSection.module.scss';

export const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.ring} />
        <span className={`${styles.ring} ${styles.ringSmall}`} />
        <span className={`${styles.ring} ${styles.ringFaint}`} />
        <span className={styles.dot} />
        <span className={`${styles.dot} ${styles.dotSecond}`} />
        <span className={`${styles.dot} ${styles.dotThird}`} />
        <span className={`${styles.dot} ${styles.dotFourth}`} />
        <span className={styles.plus} />
        <span className={`${styles.plus} ${styles.plusSecond}`} />
        <span className={styles.line} />
        <span className={`${styles.line} ${styles.lineSecond}`} />
        <span className={styles.square} />
      </div>

      <Container>
        <p className={styles.tagline}>Донат-сервис</p>
        <h1 className={styles.title}>
          Vanta <span className={styles.titleAccent}>Shop</span>
        </h1>
        <p className={styles.subtitle}>
          Покупайте гемы, Brawl Pass и специальные предложения по выгодным
          ценам. Удобная покупка, быстрая обработка заказа и надёжный сервис —
          всё необходимое для вашего аккаунта в одном месте.
        </p>
        <CtaButton to="/products">Перейти к товарам</CtaButton>
      </Container>
    </section>
  );
};
