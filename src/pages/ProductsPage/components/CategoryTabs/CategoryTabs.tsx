import { CATEGORIES, type CategoryId } from '../../constants';
import styles from './CategoryTabs.module.scss';

type CategoryTabsProps = {
  active: CategoryId;
  onChange: (category: CategoryId) => void;
};

export const CategoryTabs = ({ active, onChange }: CategoryTabsProps) => {
  return (
    <nav className={styles.tabsBar} aria-label="Категории товаров">
      <div className={styles.tabs} role="tablist">
        {CATEGORIES.map(({ id, label }) => {
          const isActive = id === active;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              aria-selected={isActive}
              onClick={() => onChange(id)}
              className={
                isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab
              }
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
