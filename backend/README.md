# Zyra Backend API

Backend для системы мониторинга спортсменов Zyra на Node.js + Express + PostgreSQL.

## Стек

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens)
- **Hosting**: Railway

## Структура проекта

```
backend/
├── src/
│   ├── config/         # Конфигурация (env, database)
│   ├── controllers/    # API контроллеры
│   ├── middleware/     # Middleware (auth, error handling)
│   ├── models/         # Модели данных
│   ├── routes/         # API роуты
│   ├── services/       # Бизнес-логика (athlete monitoring)
│   ├── types/          # TypeScript типы
│   ├── migrate.ts      # Скрипт миграций
│   ├── seed.ts         # Скрипт seed данных
│   └── server.ts       # Главный файл сервера
├── migrations/         # SQL миграции
├── DEPLOY.md          # Инструкция по деплою
└── package.json
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/refresh` - Обновление токенов
- `POST /api/auth/logout` - Выход

### Check-ins
- `GET /api/checkins` - Список чекинов
- `POST /api/checkins` - Создать чекин
- `GET /api/checkins/:id` - Детали чекина
- `PUT /api/checkins/:id` - Обновить чекин
- `DELETE /api/checkins/:id` - Удалить чекин
- `POST /api/checkins/import` - Импорт из localStorage
- `GET /api/checkins/stats` - Статистика

### Factors
- `GET /api/factors` - Список факторов

### Admin
- `GET /api/admin/users` - Список пользователей (пагинация)
- `GET /api/admin/users/:id` - Детали пользователя
- `POST /api/admin/users` - Создать пользователя
- `PUT /api/admin/users/:id` - Обновить пользователя
- `DELETE /api/admin/users/:id` - Удалить пользователя
- `PATCH /api/admin/users/:id/activate` - Активировать
- `PATCH /api/admin/users/:id/deactivate` - Деактивировать
- `GET /api/admin/factors` - Список факторов
- `POST /api/admin/factors` - Создать фактор
- `PUT /api/admin/factors/:id` - Обновить фактор
- `DELETE /api/admin/factors/:id` - Удалить фактор

## Установка и запуск

### Локально

1. Установите зависимости:
```bash
npm install
```

2. Создайте `.env` файл (см. `.env.example`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/zyra
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

3. Запустите миграции:
```bash
npm run migrate
```

4. Создайте seed данные (админ + факторы):
```bash
npm run seed
```

5. Запустите сервер:
```bash
npm run dev
```

API будет доступно по адресу: `http://localhost:3001`

### Production (Railway)

См. [DEPLOY.md](./DEPLOY.md)

## Модели данных

### User
- `id` (UUID)
- `email` (unique)
- `password_hash`
- `nickname`
- `role` (user | coach | admin)
- `is_active` (boolean)
- `metadata` (JSONB)
- `created_at`, `updated_at`, `last_login`

### CheckIn
- `id` (UUID)
- `user_id` (FK -> users)
- `check_in_data` (JSONB) - данные чекина
- `hooper_index` (float)
- `daily_load` (float)
- `ctl` (float) - Chronic Training Load
- `atl` (float) - Acute Training Load
- `tsb` (float) - Training Stress Balance
- `created_at`, `updated_at`

### Factor
- `id` (UUID)
- `key` (unique) - snake_case идентификатор
- `name` - отображаемое название
- `weight` (float) - влияние на состояние
- `tau` (int) - период полувывода в часах
- `is_active` (boolean)
- `created_at`, `updated_at`

### CheckInFactor (связь многие-ко-многим)
- `checkin_id` (FK -> checkins)
- `factor_id` (FK -> factors)

## Методология

### Hooper Index
Суммарный индекс состояния спортсмена (ниже = лучше):
- Сон (1-5)
- Стресс (1-5)
- Усталость (1-5)
- Болезненность мышц (1-5)

### sRPE (session Rating of Perceived Exertion)
```
Training Load = Duration (min) × RPE (1-10)
```

### Banister Model (Fitness-Fatigue)
```
CTL = CTL_prev × e^(-1/42) + DailyLoad × (1 - e^(-1/42))
ATL = ATL_prev × e^(-1/7) + DailyLoad × (1 - e^(-1/7))
TSB = CTL - ATL
```

- **CTL** (Chronic Training Load) - долгосрочная нагрузка (42 дня)
- **ATL** (Acute Training Load) - краткосрочная усталость (7 дней)
- **TSB** (Training Stress Balance) - готовность к тренировкам

### Factor Impact Analysis
Экспоненциальная модель влияния внешних факторов:
```
Influence(t) = Weight × e^(-t / tau)
```

- **Weight** - сила влияния (±)
- **Tau** - период полувывода в часах

## Admin User

По умолчанию (из seed):
- Email: `digitalcluster25@gmail.com`
- Password: `149521MkSF#u*V`
- Role: `admin`

## Лицензия

Proprietary
