# Zyra

## Описание
Zyra — платформа для ежедневного чек-ина восстановления, расчёта Recovery Score, интеграции с внешними сервисами (Strava, Stripe), аналитики и AI-инсайтов.

## Структура репозитория
- `frontend/` — Next.js (TypeScript, TailwindCSS, shadcn/ui, Zustand, React Query)
- `backend/` — Node.js (Express, Drizzle ORM, BullMQ, Redis, Stripe, Passport)
- `docs/` — документация, планы, BRD

## Быстрый старт
1. Клонируйте репозиторий и установите зависимости:
   ```bash
   pnpm install
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Заполните `.env` и `.env.example` (DATABASE_URL, REDIS_URL, STRAVA_CLIENT_ID, STRIPE_SECRET_KEY и др.)
3. Запустите backend:
   ```bash
   cd backend
   npm run dev
   ```
4. Запустите frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Тесты
В backend:
```bash
npm run test
```

## Деплой на Railway
- Подключите репозиторий к Railway
- Добавьте плагины Postgres и Redis
- Настройте переменные окружения
- Деплой осуществляется через GitHub Actions (`.github/workflows/ci.yml`)

## Документация
- Подробный BRD и план — в папке `docs/`

---

© 2025 Zyra Team
