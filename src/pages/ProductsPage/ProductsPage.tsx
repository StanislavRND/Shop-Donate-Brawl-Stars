import { useState } from 'react';

import { FALLBACK_USD_RUB_RATE } from '@/shared/api/exchangeRate';
import { useExchangeRate } from '@/shared/hooks/useExchangeRate';
import { StepsSection } from '@/widgets/StepsSection/StepsSection';

import { CategoryTabs } from './components/CategoryTabs/CategoryTabs';
import { ProductSection } from './components/ProductSection/ProductSection';
import { SpecialSection } from './components/SpecialSection/SpecialSection';
import { GEMS, PASSES, type CategoryId } from './constants';

export const ProductsPage = () => {
  const [category, setCategory] = useState<CategoryId>('passes');
  const { rate } = useExchangeRate();

  // Пока курс загружается или API недоступен — аварийный курс,
  // при обновлении весь каталог пересчитывается автоматически.
  const effectiveRate = rate ?? FALLBACK_USD_RUB_RATE;

  // При переключении категории возвращаем пользователя к началу каталога.
  const handleCategoryChange = (next: CategoryId) => {
    setCategory(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main id="content">
      <h1 className="visually-hidden">Товары</h1>

      <CategoryTabs active={category} onChange={handleCategoryChange} />

      {category === 'passes' && (
        <ProductSection
          id="passes"
          title="Пропуска"
          products={PASSES}
          rate={effectiveRate}
          columns={4}
        />
      )}

      {category === 'gems' && (
        <ProductSection
          id="gems"
          title="Гемы"
          products={GEMS}
          rate={effectiveRate}
          columns={3}
        />
      )}

      {category === 'special' && <SpecialSection />}

      <StepsSection />
    </main>
  );
};
