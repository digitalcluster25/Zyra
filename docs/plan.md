# План создания проекта Zyra

## 1. Инициализация репозитория и базовой структуры
- [x] Создать структуру монорепозитория: frontend (Next.js), backend (Node.js/Express), docs
- [x] Настроить базовые конфиги (tsconfig, eslint, prettier, .env.example)

## 2. Настройка CI/CD и деплоя
- [ ] Настроить GitHub Actions для проверки, сборки и деплоя
- [ ] Подключить Railway (создать проект, добавить Postgres и Redis)

## 3. Backend: базовая архитектура
- [ ] Инициализировать backend (Express/Fastify + TypeScript)
- [ ] Настроить ORM (Drizzle или Prisma) и подключение к PostgreSQL
- [ ] Реализовать базовые модели: User, Survey, TrainingData, AIInsight
- [ ] Реализовать аутентификацию (email + JWT)

## 4. Frontend: базовая архитектура
- [ ] Инициализировать Next.js (TypeScript)
- [ ] Настроить TailwindCSS, shadcn/ui, Zustand, React Query
- [ ] Реализовать базовые страницы: /auth, /dashboard, /checkin

## 5. Интеграция с внешними сервисами
- [ ] Интеграция Strava OAuth (backend + frontend)
- [ ] Stripe (оплата)

## 6. Фоновые задачи и очереди
- [ ] Настроить BullMQ + Redis для фоновых задач
- [ ] Реализовать воркер для синхронизации Strava

## 7. Аналитика, AI-инсайты, админка
- [ ] Реализовать rule-based AI insights
- [ ] Реализовать базовую аналитику и графики
- [ ] Реализовать админ-панель

## 8. Тестирование и мониторинг
- [ ] Настроить unit/integration/E2E тесты
- [ ] Подключить Sentry, настроить логи

## 9. Финализация и запуск
- [x] Проверить чек-лист MVP
- [x] Подготовить документацию (README, env, деплой)
- [x] Провести smoke/E2E тесты
- [x] Запустить на Railway
