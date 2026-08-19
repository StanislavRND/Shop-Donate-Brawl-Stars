// =============================================================================
// Единый расчёт и форматирование цен: USD → RUB, округление вверх до десятков.
// =============================================================================

/** Пересчитывает цену из USD в рубли по курсу. */
export const convertUsdToRub = (usd: number, rate: number): number =>
  usd * rate;

/** Округляет вверх до десятков рублей: 1237 → 1240. */
export const roundUpToTens = (value: number): number => Math.ceil(value / 10) * 10;

const rubFormatter = new Intl.NumberFormat('ru-RU');

/** Форматирует сумму в рублях: 1240 → «1 240 ₽». */
export const formatRub = (value: number): string => `${rubFormatter.format(value)} ₽`;

/** Полная цепочка: цена в USD → рубли → округление → форматирование. */
export const formatUsdAsRub = (usd: number, rate: number): string =>
  formatRub(roundUpToTens(convertUsdToRub(usd, rate)));
