# Timefy frontend

Frontend SPA платформи Timefy для особистого кабінету, керування компаніями,
працівниками та онлайн-записом.

## Локальний запуск

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Публічні frontend-змінні:

- `VITE_API_URL` — базова адреса API v1;
- `VITE_ADMIN_APP_URL` — необов'язкова адреса окремого застосунку адміністрування.
  Якщо значення відсутнє, відповідний пункт меню не показується.

## Перевірки

```bash
npm run lint
npm test
npm run build
```

## Production build

```bash
docker compose up --build
```

Production image збирається у Node.js 20 та роздається через Nginx. Значення
`VITE_*` вбудовуються у клієнтський bundle під час збірки, тому їх не можна
використовувати для зберігання секретів.

## Основний стек

- React, TypeScript і Vite;
- Zustand;
- React Hook Form і Zod;
- Tailwind CSS, Radix UI та Lucide;
- Vitest і Testing Library.
