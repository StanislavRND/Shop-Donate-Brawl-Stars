import type { Product } from '../../constants';

import styles from './ProductCard.module.scss';

type ProductCardProps = {
  product: Product;
  /** Готовая отформатированная цена в рублях. */
  price: string;
};

export const ProductCard = ({ product, price }: ProductCardProps) => {
  const { image, title, description, badge } = product;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.text}>{description}</p>}

        <div className={styles.footer}>
          <span className={styles.price}>{price}</span>

          <button type="button" className={styles.buyButton}>
            Купить
          </button>
        </div>
      </div>
    </article>
  );
};
