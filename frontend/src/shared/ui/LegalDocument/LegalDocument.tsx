import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Container } from '@/shared/ui/Container/Container';

import styles from './LegalDocument.module.scss';

export type LegalSection = {
  heading: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
};

type LegalDocumentProps = {
  title: string;
  /** Строка «Последнее обновление: …». */
  updatedAt: string;
  sections: readonly LegalSection[];
};

/** Типовая страница юридического документа: заголовок + секции текста. */
export const LegalDocument = ({
  title,
  updatedAt,
  sections,
}: LegalDocumentProps) => {
  const navigate = useNavigate();

  return (
    <section className={styles.document} aria-label={title}>
      <div className={styles.decor} aria-hidden="true">
        <span className={styles.ring} />
      </div>

      <Container>
        <article className={styles.article}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Назад
          </button>

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>{updatedAt}</p>

          {sections.map(({ heading, paragraphs, list }) => (
            <section key={heading} className={styles.block}>
              <h2 className={styles.heading}>{heading}</h2>

              {paragraphs?.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}

              {list && (
                <ul className={styles.list}>
                  {list.map((item) => (
                    <li key={item} className={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </Container>
    </section>
  );
};
