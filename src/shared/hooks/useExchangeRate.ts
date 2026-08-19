import { useEffect, useState } from 'react';

import { fetchUsdRubRate } from '@/shared/api/exchangeRate';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // каждые 10 минут

/**
 * Курс USD → RUB с периодическим обновлением.
 * Пока идёт загрузка или API недоступен, возвращает null —
 * вызывающая сторона подставляет аварийный курс из exchangeRate.ts.
 */
export const useExchangeRate = (): { rate: number | null } => {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      try {
        const nextRate = await fetchUsdRubRate();
        if (!isCancelled) setRate(nextRate);
      } catch (error) {
        console.warn('Не удалось обновить курс USD/RUB:', error);
      }
    };

    load();
    const intervalId = setInterval(load, REFRESH_INTERVAL_MS);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return { rate };
};
