BRD / PBR — MVP для проекта «Readiness»

Кратко: это подробный BRD/PBR и техническое ТЗ для MVP приложения «Readiness» — человеко-центричного продукта для ежедневного чек-ина восстановления. Стек: Frontend — Next.js (React + TypeScript) + shadcn/ui + Tailwind; Backend — Next.js API / Node.js service (Express/Fastify) + Prisma → PostgreSQL; фоновые воркеры (Celery/RQ/Node Workers). Хостинг / деплой: railway.com. Документ рассчитан, чтобы можно было сразу приступить к реализации (разбивка на эпики, требования, DDL, API-контракты, CI/CD, checklist для запуска).


---

1. Executive summary

Цель MVP: предоставить пользователю простой 3‑минутный ежедневный чек-ин, рассчитывать и показывать Recovery Score (0–100), хранить историю, показывать базовую аналитику (7/30 дней), давать простые AI/правила-инсайты и позволить подключать хотя бы одну внешнюю интеграцию (Strava). Монетизация: freemium + премиум (AI‑инсайты, история > 30 дней, множественные интеграции, панель тренера).

Ключевая идея: субъективный ввод — первоисточник; объективные данные — контекст.


---

2. Цели и метрики успеха (KPIs)

Daily check-in completion rate — % пользователей, прошедших чек-ин в день.

DAU/MAU — удержание.

Conversion rate (free → premium).

Retention M7 — через 7 дней.

Avg. Recovery Score MAE (после тренировки ML) — сколько пунктов в среднем ошибаемся.

Time to first value — время до момента, когда пользователь видит полезную аналитику (для MVP стремимся к мгновенной ценности через импорт исторических данных при подключении Strava).



---

3. MVP — scope (что входит / что не входит)

Входит (минимальный набор):

1. Регистрация / аутентификация (email + OAuth (Google), session/JWT).


2. Onboarding: выбор спорта, цель, предложение подключить Strava (опционально).


3. Ежедневный чек-ин (6–7 вопросов, 1–7 шкала) + динамические уточняющие вопросы для значений вне нормы.


4. Расчёт Recovery Score (правила на бэкенде, формула MVP) и отображение на дашборде.


5. История показателей (7 дней / 30 дней просмотр).


6. Базовая аналитика: комбинированный график Recovery Score + TSS (7/30 дней).


7. Импорт тренировок из Strava (OAuth + периодический sync or webhook), ручной ввод TSS.


8. AI-insights — правила/шаблоны (например, «повышенный RHR + низкий HRV → снизьте нагрузку»).


9. Премиум‑граница: платный доступ к AI-insights + история > 30 дней.


10. Админ-панель (список пользователей, базовая аналитика, управление подписками).



Не входит (в MVP):

Команда тренеров с полным workflow (будет B2B позже).

Сложные ML‑модели (LSTM) — планируем как follow-up.

Многочисленные интеграции (потребуется минимум Strava; позже — Garmin, Apple Health).



---

4. Пользовательские истории (User Stories)

Как пользователь, я хочу за 3 минуты утром ответить на вопросы о самочувствии, чтобы получить рекомендацию по тренировке.

Как пользователь, я хочу видеть свой Recovery Score и историю за 7 дней, чтобы оценивать тренды.

Как пользователь, я хочу автоматически импортировать тренировки из Strava, чтобы не вводить TSS вручную.

Как премиум пользователь, я хочу получать персональные инсайты о паттернах и триггерах ухудшения восстановления.

Как администратор, я хочу видеть список пользователей и их активности.



---

5. Функциональные требования (FR)

5.1 Auth & Profile

FR-A1: Email signup + password (hashed, bcrypt/argon2). Email verification optional.

FR-A2: OAuth Google + OAuth Strava (для интеграции). Store refresh_token encrypted.

FR-A3: Profile settings: name, DOB (опционально), sport type, timezone, gender (опционально).


5.2 Daily Check-in

FR-C1: 6–7 вопросов, 1–7 scale (UI: stepper). Save survey + answers.

FR-C2: Dynamic follow-up: если value over threshold, show tags list and save chosen tag.

FR-C3: Allow manual TSS entry for the day.


5.3 Recovery Score

FR-R1: Backend endpoint to compute score for a given day using baseline and rules.

FR-R2: Support missing data (re-normalize weights proportionally).

FR-R3: Mark scores computed with low confidence (e.g., baseline < 7 days).


5.4 Integrations & Sync

FR-I1: Strava OAuth connect/disconnect.

FR-I2: Sync historical activities (30–90 days) on connect.

FR-I3: Background worker to fetch new activities (cron or webhooks).


5.5 Analytics & Insights

FR-AI1: Combined chart Recovery Score vs TSS (7/30 days) with day tooltip.

FR-AI2: Simple rule-based insights engine (AI Engine v0): pattern detectors (e.g., high ACWR + low subjective sleep → insight).

FR-AI3: Persist insights and mark as read/unread.


5.6 Billing

FR-B1: Stripe integration for subscription management (monthly/yearly).

FR-B2: Gate premium features using subscription check.


5.7 Admin

FR-ADM1: Admin panel: list users, search, view last check-in, toggle subscription status.



---

6. Нефункциональные требования (NFR)

Scalability: MVP рассчитан на несколько тысяч пользователей; архитектура — горизонтально масштабируемая.

Availability: 99% SLA target for web UI.

Security: TLS everywhere; encrypt secrets; PCI DSS scope only via Stripe; store minimal PII.

Privacy: GDPR-ready: users can request export/deletion of their data.

Performance: p95 page load < 1.5s on mobile.



---

7. Технический стек (рекомендация)

Frontend

Next.js (app router) + React + TypeScript

shadcn/ui components + TailwindCSS (v3/4 compatible)

TanStack Query (react-query) for data fetching

react-hook-form + zod for validation

Zustand для простого глобального состояния (auth/session)

Recharts (или recharts wrapper) для графиков


Backend

Next.js API Routes or separate Node service (Fastify/Express) + TypeScript (использовать monorepo pattern — frontend + backend в одном репозитории пока удобно)

Prisma ORM + PostgreSQL

Redis (optional) для rate-limits, short-term cache, job queue (BullMQ)

Background job runner: BullMQ (Redis-backed) или Node cron / worker

Stripe SDK for billing


ML / AI

Для MVP — rule-based engine на Node (встроенный). Позже — Python service (FastAPI) с LightGBM/LSTM.


Infra / Deployment

railway.com for hosting — Node apps + Postgres plugin + Redis plugin

Dockerfile for services (optional)

GitHub Actions → Railway CLI / GitHub integration for CI/CD



---

8. Архитектура данных (DDL) — PostgreSQL (пример)

-- users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
      password_hash text,
        name text,
          timezone text,
            sport text,
              goal text,
                subscription_status text,
                  created_at timestamptz DEFAULT now()
                  );

                  -- survey
                  CREATE TABLE surveys (
                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                      user_id uuid REFERENCES users(id) ON DELETE CASCADE,
                        date date NOT NULL,
                          recovery_score numeric, -- 0..100
                            confidence numeric, -- 0..1
                              created_at timestamptz DEFAULT now(),
                                UNIQUE(user_id, date)
                                );

                                -- survey_answers
                                CREATE TABLE survey_answers (
                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                    survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
                                      metric text, -- sleep, fatigue, soreness, stress, mood, readiness
                                        value smallint, -- 1..7
                                          tag text NULL
                                          );

                                          -- external_factors
                                          CREATE TABLE external_factors (
                                            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                              survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
                                                factor text -- illness, travel, alcohol, etc.
                                                );

                                                -- training_data
                                                CREATE TABLE training_data (
                                                  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
                                                      date date NOT NULL,
                                                        tss numeric,
                                                          duration_seconds int,
                                                            source text, -- strava, manual
                                                              created_at timestamptz DEFAULT now()
                                                              );

                                                              -- physio_data
                                                              CREATE TABLE physio_data (
                                                                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                                  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
                                                                    date date NOT NULL,
                                                                      hrv numeric,
                                                                        rhr numeric,
                                                                          sleep_hours numeric,
                                                                            source text,
                                                                              created_at timestamptz DEFAULT now()
                                                                              );

                                                                              -- ai_insights
                                                                              CREATE TABLE ai_insights (
                                                                                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                                                  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
                                                                                    insight_text text,
                                                                                      insight_type text,
                                                                                        meta jsonb,
                                                                                          is_read boolean DEFAULT false,
                                                                                            created_at timestamptz DEFAULT now()
                                                                                            );

                                                                                            -- subscriptions
                                                                                            CREATE TABLE subscriptions (
                                                                                              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                                                                                                user_id uuid REFERENCES users(id),
                                                                                                  stripe_customer_id text,
                                                                                                    stripe_subscription_id text,
                                                                                                      plan text,
                                                                                                        status text,
                                                                                                          started_at timestamptz,
                                                                                                            ended_at timestamptz
                                                                                                            );

                                                                                                            Индексы: surveys(user_id, date), training_data(user_id, date), physio_data(user_id, date), ai_insights(user_id, created_at).


                                                                                                            ---

                                                                                                            9. API спецификация (REST, JSON)

                                                                                                            > Базовое требование: все защищённые роуты требуют Authorization: Bearer <token> (JWT) или NextAuth session.



                                                                                                            Auth

                                                                                                            POST /api/auth/signup { email, password } → 201 { user, token }

                                                                                                            POST /api/auth/login { email, password } → 200 { user, token }

                                                                                                            GET /api/auth/me → 200 { user }

                                                                                                            GET /api/auth/oauth/strava → redirect to Strava

                                                                                                            GET /api/auth/oauth/strava/callback?code=... → exchange code → store tokens


                                                                                                            Surveys

                                                                                                            POST /api/surveys { date, answers: [{metric, value, tag?}], external_factors: [] , manual_tss? }

                                                                                                            Response: { survey, recovery_score, confidence }


                                                                                                            GET /api/surveys?from=YYYY-MM-DD&to=YYYY-MM-DD → list

                                                                                                            GET /api/surveys/:id → detail


                                                                                                            Training / Integrations

                                                                                                            GET /api/integrations/strava/connect → redirect URL

                                                                                                            POST /api/integrations/sync (internal worker trigger) → 200

                                                                                                            POST /api/trainings/manual { date, tss, duration } → 201


                                                                                                            Analytics

                                                                                                            GET /api/analytics/recovery?range=7|30 → { series: [{date, recovery, tss, hrv, rhr}] }

                                                                                                            GET /api/insights → list

                                                                                                            POST /api/insights/:id/mark-read


                                                                                                            Billing

                                                                                                            GET /api/billing/checkout-session → { url }

                                                                                                            POST /api/billing/webhook (Stripe webhook handler)


                                                                                                            Admin

                                                                                                            GET /api/admin/users?query=... (role guard)

                                                                                                            POST /api/admin/users/:id/toggle-subscription



                                                                                                            ---

                                                                                                            10. Recovery Score: реализация (MVP)

                                                                                                            Логика (правила / формула)

                                                                                                            Использовать правило, которое уже обсуждали: весовая сумма нормализованных компонентов (HRV, Sleep, RHR, Subjective, Load). Если компонент отсутствует — веса перенормируются.

                                                                                                            В документации приложить snippet на TypeScript (пример функции) — можно использовать код из предыдущего Python-примера, но написать TS-релиз:

                                                                                                            // computeRecovery.ts (TypeScript pseudocode)
                                                                                                            export function computeRecovery(components: {
                                                                                                              hrv?: number; hrvBaseline?: number;
                                                                                                                sleepH?: number; sleepBaselineH?: number;
                                                                                                                  rhr?: number; rhrBaseline?: number;
                                                                                                                    subjectiveMean?: number; // 1..7 (7 best)
                                                                                                                      tss3?: number; tss28Avg?: number;
                                                                                                                      }) {
                                                                                                                        // нормализация, клиппинг, веса (hrv:0.35, sleep:0.25, rhr:0.15, subj:0.15, load:0.1)
                                                                                                                          // вернуть {score: number, usedWeights: Record<string, number>, confidence}
                                                                                                                          }

                                                                                                                          Поведение при low-data: если baseline < 7 дней — помечаем confidence < 0.5 и используем только субъективные данные.


                                                                                                                          ---

                                                                                                                          11. AI-insights engine (v0 — rule-based)

                                                                                                                          Реализовать набор правил (detectors) по шаблону:

                                                                                                                          If ACWR > 1.25 AND HRV_drop_pct > 12% THEN insight: "Возможное недовосстановление".

                                                                                                                          If subjective_stress_high AND HRV_drop THEN insight: "Внешний стресс влияет".


                                                                                                                          Каждый детектор возвращает: severity (low/med/high), explanatory_text, evidence ({hrv_trend, tss, subjectives})

                                                                                                                          Инсайты сохраняются в ai_insights и показываются на дашборде (только premium для более длинных историй).



                                                                                                                          ---

                                                                                                                          12. Frontend — компоненты и структура (shadcn/ui)

                                                                                                                          Фреймворк и стили

                                                                                                                          shadcn/ui базируется на Tailwind. Используем shadcn/ui для стандартных компонентов (Button, Card, Input, Modal) и дополняем кастомными компонентами (RatingScale, Stepper).


                                                                                                                          Структура папок (Next.js app)

                                                                                                                          /app
                                                                                                                            /dashboard
                                                                                                                              /checkin
                                                                                                                                /analytics
                                                                                                                                  /settings
                                                                                                                                    /auth
                                                                                                                                    /components
                                                                                                                                      /ui (shadcn wrappers)
                                                                                                                                        /charts
                                                                                                                                          /checkin/RatingScale.tsx
                                                                                                                                            /checkin/DynamicTagPicker.tsx
                                                                                                                                            /lib
                                                                                                                                              /api.ts (fetchers tanstack)
                                                                                                                                                /computeRecovery.ts
                                                                                                                                                /hooks
                                                                                                                                                  useAuth.ts
                                                                                                                                                    useSurvey.ts

                                                                                                                                                    Ключевые UI-компоненты

                                                                                                                                                    CheckinStepper — пошаговый опросник; реализация: shadcn Card + Button + custom 1..7 selector.

                                                                                                                                                    RatingScale — горизонтальные круги 1..7 (a11y: keyboard support, aria-labels).

                                                                                                                                                    RecoveryCard — большой герой-карт для Dashboard; цвет зависит от диапазона score.

                                                                                                                                                    WeeklyStrip — маленький горизонтальный view прошлых 7 дней (dot view).

                                                                                                                                                    AnalyticsChart — комбинированный график (bars recovery + line/dots TSS). Использовать Recharts.

                                                                                                                                                    InsightsFeed — список инсайтов (premium lock icon for free users).


                                                                                                                                                    State & data

                                                                                                                                                    Авторизация: Zustand (user, token)

                                                                                                                                                    Data fetching: React Query (caching, background refresh)

                                                                                                                                                    Form handling: react-hook-form + zod



                                                                                                                                                    ---

                                                                                                                                                    13. Integrations flow (Strava example)

                                                                                                                                                    1. Client clicks «Connect Strava» → backend builds Strava OAuth URL and redirects.


                                                                                                                                                    2. Strava redirects back to /api/auth/oauth/strava/callback?code=....


                                                                                                                                                    3. Backend exchanges code for access_token and refresh_token, stores encrypted tokens in user_integrations.


                                                                                                                                                    4. On connect: backend triggers a sync job: fetch past 90 days activities via Strava API and writes training_data.


                                                                                                                                                    5. Background worker periodically refreshes tokens and pulls new activities (or uses Strava webhooks if available).



                                                                                                                                                    Security note: store tokens encrypted (KMS or env var key). Rotate refresh tokens per Strava docs.


                                                                                                                                                    ---

                                                                                                                                                    14. Deployment on Railway (ops notes)

                                                                                                                                                    Create Railway project and connect GitHub repo (or use Railway CLI).

                                                                                                                                                    Add Postgres plugin (Railway UI: Add Plugin → PostgreSQL) — Railway provides DATABASE_URL env var.

                                                                                                                                                    Optionally add Redis plugin for queues.

                                                                                                                                                    Environment variables to set on Railway:

                                                                                                                                                    DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REDIRECT_URI, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, JWT_SECRET, SENTRY_DSN.


                                                                                                                                                    Railway auto-detects Node apps; ensure start script in package.json uses next start (for production) and a build step next build.

                                                                                                                                                    For background workers consider another Railway service (worker) in the same project.


                                                                                                                                                    > Примечание: Railway docs помогают пошагово подключить Postgres, Redis и деплой — использовать Railway UI/CLI. (См. официальные guides).




                                                                                                                                                    ---

                                                                                                                                                    15. CI/CD (GitHub Actions → Railway)

                                                                                                                                                    Проверки на PR: pnpm install → pnpm lint → pnpm test → pnpm build.

                                                                                                                                                    On merge to main: trigger deployment to Railway (use Railway GitHub integration or Railway CLI railway up --projectId with RAILWAY_API_KEY secret).


                                                                                                                                                    Пример job skeleton:

                                                                                                                                                    name: CI
                                                                                                                                                    on: [push, pull_request]
                                                                                                                                                    jobs:
                                                                                                                                                      test:
                                                                                                                                                          runs-on: ubuntu-latest
                                                                                                                                                              steps:
                                                                                                                                                                    - uses: actions/checkout@v4
                                                                                                                                                                          - uses: pnpm/action-setup@v2
                                                                                                                                                                                - run: pnpm install
                                                                                                                                                                                      - run: pnpm lint
                                                                                                                                                                                            - run: pnpm test

                                                                                                                                                                                              deploy:
                                                                                                                                                                                                  if: github.ref == 'refs/heads/main'
                                                                                                                                                                                                      runs-on: ubuntu-latest
                                                                                                                                                                                                          steps:
                                                                                                                                                                                                                - uses: actions/checkout@v4
                                                                                                                                                                                                                      - run: curl -sL https://railway.app/install.sh | sh
                                                                                                                                                                                                                            - run: railway login --apiKey ${{ secrets.RAILWAY_API_KEY }}
                                                                                                                                                                                                                                  - run: railway up --project ${{ secrets.RAILWAY_PROJECT_ID }}


                                                                                                                                                                                                                                  ---

                                                                                                                                                                                                                                  16. Testing strategy

                                                                                                                                                                                                                                  Unit tests: Jest/Testing Library for React components; Vitest optional for Next.js/Turborepo.

                                                                                                                                                                                                                                  Integration tests: Supertest for API routes.

                                                                                                                                                                                                                                  E2E: Playwright for key flows (signup, check-in, connect Strava, see recovery card).

                                                                                                                                                                                                                                  Contract tests: API schema validation with OpenAPI/TypeBox.



                                                                                                                                                                                                                                  ---

                                                                                                                                                                                                                                  17. Observability & monitoring

                                                                                                                                                                                                                                  Errors & performance: Sentry (frontend + backend).

                                                                                                                                                                                                                                  Logs: Railway provides logs; augment with structured logs (pino/winston).

                                                                                                                                                                                                                                  Metrics: Basic Prometheus-compatible metrics via an endpoint /metrics or third-party like Datadog.



                                                                                                                                                                                                                                  ---

                                                                                                                                                                                                                                  18. Security & privacy

                                                                                                                                                                                                                                  TLS for all endpoints. HSTS.

                                                                                                                                                                                                                                  Password hashing: argon2id or bcrypt (strong settings).

                                                                                                                                                                                                                                  Encrypt tokens at rest (KMS or env-based key).

                                                                                                                                                                                                                                  GDPR: data export endpoint, account deletion workflow, retention policy (user data stored until deletion request + backups for X days).

                                                                                                                                                                                                                                  Minimal PII: avoid collecting unnecessary personal data.



                                                                                                                                                                                                                                  ---

                                                                                                                                                                                                                                  19. Release / Launch checklist (MVP)

                                                                                                                                                                                                                                  [ ] Basic legal pages: Privacy Policy, Terms of Service, Cookie policy

                                                                                                                                                                                                                                  [ ] Stripe account + webhook configured

                                                                                                                                                                                                                                  [ ] Railway project configured + Postgres + Redis

                                                                                                                                                                                                                                  [ ] Domain + TLS

                                                                                                                                                                                                                                  [ ] Email provider setup (SendGrid/Postmark) for verification & notifications

                                                                                                                                                                                                                                  [ ] Sentry configured

                                                                                                                                                                                                                                  [ ] E2E tests green

                                                                                                                                                                                                                                  [ ] Admin panel basic functions ready

                                                                                                                                                                                                                                  [ ] Onboarding flow + check-in tested on iOS/Android webviews and Desktop



                                                                                                                                                                                                                                  ---

                                                                                                                                                                                                                                  20. Epics / backlog (priority order — ready для дев старта)

                                                                                                                                                                                                                                  Epic 1 — Core onboarding & check-in

                                                                                                                                                                                                                                  Auth (email + google)

                                                                                                                                                                                                                                  Onboarding screen (sport, goal)

                                                                                                                                                                                                                                  Check-in flow (UI + backend save)

                                                                                                                                                                                                                                  Recovery Score compute service (rules)

                                                                                                                                                                                                                                  Dashboard RecoveryCard + weekly strip


                                                                                                                                                                                                                                  Epic 2 — Integrations + history

                                                                                                                                                                                                                                  Strava OAuth + import 90 days

                                                                                                                                                                                                                                  Manual TSS entry

                                                                                                                                                                                                                                  Analytics basic (7/30 days)


                                                                                                                                                                                                                                  Epic 3 — Billing & premium gating

                                                                                                                                                                                                                                  Stripe checkout

                                                                                                                                                                                                                                  Premium feature locking (insights + deep history)

                                                                                                                                                                                                                                  Admin panel subscription toggle


                                                                                                                                                                                                                                  Epic 4 — AI insights v0 & admin tools

                                                                                                                                                                                                                                  Rule-based insights engine

                                                                                                                                                                                                                                  Save/serve insights

                                                                                                                                                                                                                                  Admin panel user search


                                                                                                                                                                                                                                  Epic 5 — Polish, testing, deploy

                                                                                                                                                                                                                                  CI/CD + Railway deployment

                                                                                                                                                                                                                                  E2E tests

                                                                                                                                                                                                                                  Monitoring & privacy



                                                                                                                                                                                                                                  ---

                                                                                                                                                                                                                                  21. Definition of Done (DoD)

                                                                                                                                                                                                                                  Feature реализован + unit и интеграционные тесты (покрытие критичных частей).

                                                                                                                                                                                                                                  UX approved (qa reviewer).

                                                                                                                                                                                                                                  Документация: README + env vars + deployment steps.

                                                                                                                                                                                                                                  CI green. Деплой на Railway успешен.



                                                                                                                                                                                                                                  ---

                                                                                                                                                                                                                                  22. Рекомендации по разработке UI с shadcn/ui

                                                                                                                                                                                                                                  Использовать shadcn/ui базовые компоненты (Button, Input, Card) и создавать thin-wrappers для вашего дизайна (например components/ui/Button.tsx) чтобы централизовать вариации.

                                                                                                                                                                                                                                  RatingScale: реализовать как контрол на основе RadioGroup (headless ui pattern) и обернуть shadcn Card.

                                                                                                                                                                                                                                  Accessibility: каждый шаг чек-ина должен быть доступен с клавиатуры; aria-live region для результатов.



                                                                                                                                                
                                                                                                                                                                                                                
                                                                                                                                                                                                                                  <!-- Конец документа BRD/MVP -->