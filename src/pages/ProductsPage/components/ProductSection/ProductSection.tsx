import { Container } from '@/shared/ui/Container/Container';
import { formatUsdAsRub } from '@/shared/lib/price';

import type { CategoryId, Product } from '../../constants';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductSection.module.scss';

type ProductSectionProps = {
  /** id категории — связывает секцию с вкладкой в CategoryTabs. */
  id: CategoryId;
  title: string;
  products: readonly Product[];
  /** Актуальный курс USD → RUB для расчёта цен. */
  rate: number;
  /** Число колонок сетки на desktop: 4 — пропуска, 3 — гемы. */
  columns?: 3 | 4;
};

export const ProductSection = ({
  id,
  title,
  products,
  rate,
  columns = 4,
}: ProductSectionProps) => {
  const gridClass = columns === 3 ? styles.gridThree : styles.gridFour;

  return (
    <section
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={styles.section}
    >
      <Container>
        <h2 className={styles.title}>{title}</h2>

        <ul className={gridClass}>
          {products.map((product) => (
            <li key={product.id} className={styles.item}>
              <ProductCard
                product={product}
                price={formatUsdAsRub(product.priceUsd, rate)}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};
