// =============================================================================
// Получение курса USD → RUB с открытого API (без ключа).
// open.er-api.com обновляет курсы раз в сутки, доступен по CORS.
// =============================================================================

const EXCHANGE_RATE_URL = 'https://open.er-api.com/v6/latest/USD';
const REQUEST_TIMEOUT_MS = 8000;

/** Аварийный курс на случай недоступности API — страница не должна ломаться. */
export const FALLBACK_USD_RUB_RATE = 80;

type ExchangeRateResponse = {
  result?: string;
  rates?: { RUB?: number };
};

/** Возвращает количество рублей за 1 USD. */
export const fetchUsdRubRate = async (): Promise<number> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(EXCHANGE_RATE_URL, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Курс недоступен: HTTP ${response.status}`);
    }

    const data: ExchangeRateResponse = await response.json();
    const rub = data.rates?.RUB;

    if (data.result !== 'success' || typeof rub !== 'number' || rub <= 0) {
      throw new Error('Курс USD/RUB отсутствует в ответе API');
    }

    return rub;
  } finally {
    clearTimeout(timeoutId);
  }
};
