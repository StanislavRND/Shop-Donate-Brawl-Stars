# CLAUDE.md

## Проект

Сайт магазин доната Brawl Stars.

Цель — чистый, масштабируемый и поддерживаемый production-ready проект без преждевременного усложнения.

## Стек

* React
* TypeScript
* Vite
* SCSS Modules
* TanStack Query — server state и API
* Redux Toolkit — global/client state
* React Router — маршрутизация
* ESLint + Prettier

Не добавлять новые библиотеки без необходимости и моего одобрения.

## Архитектура

Используем прагматичный **Feature-Sliced Design (FSD)**:

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

Соблюдать направление зависимостей:

```text
app → pages → widgets → features → entities → shared
```

Нижние слои не должны импортировать верхние.

Не создавать слои, папки и абстракции без реальной необходимости.

## React

* Использовать функциональные компоненты и hooks.
* Компоненты должны быть небольшими и понятными.
* Не создавать компоненты ради каждого маленького элемента.
* Предпочитать простые решения сложным абстракциям.

## TypeScript

* Не использовать `any` без веской причины.
* Предпочитать типобезопасные решения.
* Не злоупотреблять `as`.

## Стили

Использовать SCSS Modules для компонентных стилей.

```text
PlayerCard/
├── PlayerCard.tsx
└── PlayerCard.module.scss
```

Глобальные стили использовать только для reset, variables/tokens и базовых стилей приложения.

## Данные

TanStack Query использовать для server state:

* API-запросы;
* caching;
* loading/error states;
* mutations;
* invalidation.

Не хранить server state в Redux.

## State Management

По умолчанию:

* локальное состояние → `useState`;
* server state → TanStack Query;
* состояние из URL → search params;
* global/client state → Redux Toolkit.

Не использовать Redux Toolkit для данных, которые управляются TanStack Query.

## Workflow

Перед сложными задачами:

1. Изучи существующий код.
2. Предложи короткий план.
3. Дождись подтверждения.
4. Реализуй только согласованный scope.
5. Проверь TypeScript, lint и build.
6. Сообщи, что было изменено.

Не изменяй unrelated-код.

Не устанавливай зависимости и не меняй архитектуру без согласования.

## Git

Не создавать commit самостоятельно, если я явно не попросил.

Не выполнять destructive Git operations без моего разрешения.

## Главное правило

**Сначала простое и понятное решение. Сложность добавляется только тогда, когда она действительно нужна.**
