# AGENTS.md

## Призначення проєкту

`timely-frontend` — frontend SPA. За поточним кодом застосунок містить:

- публічний лендинг платформи для керування записами, календарем і клієнтами майстрів та салонів;
- реєстрацію, вхід, Google OAuth callback, підтвердження email і відновлення пароля;
- захищені сторінки організацій та особистого кабінету користувача;
- зовнішнє посилання на окремий застосунок схем для ролей `ADMIN` і `SUPPORT`.

## Архітектура

Точка входу — `src/main.tsx`; вона монтує `App` у React Strict Mode і відновлює persisted theme. `src/App.tsx` підключає глобальні notifications, `BrowserRouter` і lazy-loaded routes.

Код організований за шарами:

- `src/app/router` — таблиця маршрутів і lazy imports.
- `src/pages` — композиція публічних, auth, організаційних та account-сторінок.
- `src/layouts` — публічний, organizations та account layouts з `Outlet`.
- `src/widgets` — великі повторно використовувані блоки Header і Footer.
- `src/features/auth`, `src/features/account`, `src/features/forgot-password`, `src/features/verify-email` — feature-specific UI, types, validation schemas і Zustand stores.
- `src/shared/api` — HTTP client на `fetch` і API functions. Base URL береться з `VITE_API_URL`; bearer token — з auth store.
- `src/shared/hooks`, `src/shared/lib`, `src/shared/model`, `src/shared/ui` — спільні hooks, notifications, persisted theme state, route guards і UI primitives.
- `src/components/ui` — shadcn/Radix UI primitives.
- `src/assets` і `public` — статичні ресурси.

Поточні API endpoints: API v1 — `/auth/login`, `/auth/register`, `/auth/check`, `/auth/verify-email`, `/auth/resend-verify-email`, `/auth/forgot-password`, `/auth/reset-password`, `/users/update-profile`, `/users/avatar/upload`, `/users/avatar/change` і `/users/avatar/delete`; API v2 — `/auth/oauth/:provider` та `/auth/exchange` для зовнішньої OAuth-авторизації.

Auth і theme state зберігаються в `localStorage` через Zustand persist під ключами `auth-storage` і `theme`. Маршрути `/organizations` і `/account/*` захищені наявністю auth token.

## Стек

- React 19 і React DOM.
- TypeScript 5.9 у strict mode.
- Vite 7 з `@vitejs/plugin-react`.
- React Router DOM 7.
- Zustand 5 для client state.
- React Hook Form і Zod для форм і валідації.
- Tailwind CSS 4, shadcn, Radix UI, Lucide icons і `tw-animate-css`.
- Framer Motion для анімацій.
- Sonner для notifications.
- ESLint 9 і Prettier 3.
- Production container: Node 20 Alpine build stage і Nginx Alpine runtime.

`@tanstack/react-query` і `axios` вказані в dependencies, але в поточному `src` не імпортуються; API client використовує native `fetch`.

## Встановлення і запуск

Перед запуском потрібна env-змінна `VITE_API_URL` з base URL backend API. Файли `.env*` ігноруються Git.

```bash
npm ci
npm run dev
```

Доступні npm scripts:

```bash
npm run dev          # Vite development server
npm test             # Vitest test suite
npm run build        # TypeScript project build, потім production Vite build
npm run preview      # локальний preview production build
npm run lint         # ESLint для всього репозиторію
npm run prettier:fix # форматування файлів із записом
```

Контейнерний production-запуск:

```bash
docker compose up --build
```

Compose публікує Nginx на порту `80`. Nginx має SPA fallback на `index.html`.

## Тестування і перевірки

Тести запускаються через Vitest у `jsdom`. Базовий verification gate:

```bash
npm run lint
npm test
npm run build
```

Після UI-змін також перевіряй зачеплені маршрути в development server для desktop і mobile layouts та для light/dark theme.

## Правила роботи

- Зберігай наявний поділ на `app`, `pages`, `layouts`, `widgets`, `features` і `shared`; feature-specific код тримай у відповідній feature.
- Використовуй alias `@/*` для імпортів з `src`; alias однаково налаштований у Vite і TypeScript.
- Дотримуйся TypeScript strict mode: не залишай unused locals/parameters і використовуй type-only imports там, де потрібно.
- Форматуй за `.prettierrc`: double quotes, semicolons, trailing commas, 2 spaces, print width 100.
- Для стилів використовуй Tailwind utilities і наявні CSS theme variables з `src/index.css`. Для об'єднання conditional classes у проєкті є `cn`.
- Перевикористовуй наявні UI primitives з `src/components/ui` та `src/shared/ui` перед створенням дубліката.
- Форми будуй на React Hook Form; validation rules тримай у Zod schemas в model-шарі feature.
- Запити до backend додавай через `src/shared/api/httpClient.ts` і feature/domain API modules. Не дублюй base URL та bearer-token logic.
- Не коміть `.env*`, secrets, tokens, `node_modules` або `dist`.
- Не змінюй непов'язані файли і не перезаписуй вже наявні зміни робочого дерева.
- Перед завершенням запусти щонайменше `npm run lint`, `npm test` і `npm run build`; якщо щось не проходить не через поточну зміну, зафіксуй це у handoff.
