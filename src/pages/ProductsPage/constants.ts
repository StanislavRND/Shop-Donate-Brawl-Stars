export type CategoryId = "passes" | "gems" | "special";

export type Category = {
  id: CategoryId;
  label: string;
};

export type Product = {
  id: string;
  image: string;
  title: string;
  description?: string;
  /** Цена в USD — пользователю отображается в RUB по актуальному курсу. */
  priceUsd: number;
  badge?: string;
};

/** Категории каталога — переключение видимой секции страницы. */
export const CATEGORIES: readonly Category[] = [
  { id: "passes", label: "Пропуски" },
  { id: "gems", label: "Гемы" },
  { id: "special", label: "Специальные предложения" },
] as const;

export const PASSES: readonly Product[] = [
  {
    id: "brawl-pass",
    image: "/brawl%20pass/brawl-pass.png",
    title: "Brawl Pass",
    description:
      "Классический пропуск сезона: цепочка наград, эксклюзивный скин и токены.",
    priceUsd: 9.99,
  },
  {
    id: "brawl-pass-plus",
    image: "/brawl%20pass/brawl-pass-plus.png",
    title: "Brawl Pass Plus",
    description:
      "Расширенная версия пропуска: дополнительные уровни награды и бонусные токены.",
    priceUsd: 14.49,
    badge: "Выгодно",
  },
  {
    id: "brawl-pass-upgrade",
    image: "/brawl%20pass/brawl-pass-upgrade.png",
    title: "Brawl Pass Upgrade",
    description:
      "Апгрейд уже купленного пропуска до версии Plus — доплачивайте разницу.",
    priceUsd: 5.59,
  },
  {
    id: "pro-pass",
    image: "/brawl%20pass/pro-pass.png",
    title: "Pro Pass",
    description:
      "Максимальный набор сезона: все награды, привилегии и уникальные бонусы.",
    priceUsd: 27.99,
    badge: "Премиум",
  },
] as const;

/** Гемы. */
export const GEMS: readonly Product[] = [
  { id: "gems-30", image: "/gems/30.png", title: "30 гемов", priceUsd: 2.49 },
  { id: "gems-80", image: "/gems/80.png", title: "80 гемов", priceUsd: 5.49 },
  {
    id: "gems-170",
    image: "/gems/170.png",
    title: "170 гемов",
    priceUsd: 10.99,
    badge: "Популярно",
  },
  {
    id: "gems-360",
    image: "/gems/360.png",
    title: "360 гемов",
    priceUsd: 21.99,
  },
  {
    id: "gems-950",
    image: "/gems/950.png",
    title: "950 гемов",
    priceUsd: 54.99,
    badge: "Выгодно",
  },
  {
    id: "gems-2000",
    image: "/gems/2000.png",
    title: "2000 гемов",
    priceUsd: 109.99,
  },
] as const;
