import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Container } from '@/shared/ui/Container/Container';

import { FAQ_ITEMS } from './constants';
import styles from './Faq.module.scss';

export const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <section className={styles.faq} aria-label="Часто задаваемые вопросы">
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.ring} />
        <span className={styles.dotFirst} />
        <span className={styles.dotSecond} />
        <span className={styles.plus} />
      </div>

      <Container>
        <h2 className={styles.title}>Часто задаваемые вопросы</h2>

        <div className={styles.list}>
          {FAQ_ITEMS.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={question} className={styles.item}>
                <h3 className={styles.questionHeading}>
                  <button
                    type="button"
                    className={styles.question}
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.questionIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {question}
                    <ChevronDown
                      size={18}
                      className={
                        isOpen
                          ? `${styles.chevron} ${styles.chevronOpen}`
                          : styles.chevron
                      }
                    />
                  </button>
                </h3>

                {isOpen && (
                  <div className={styles.answer}>
                    <p className={styles.answerText}>{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
