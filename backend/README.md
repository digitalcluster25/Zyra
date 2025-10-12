# ZYRA Backend API

Backend API для системы мониторинга атлетов ZYRA.

## Технологии

- Node.js + Express + TypeScript
- PostgreSQL
- JWT аутентификация
- Zod валидация

## Установка

```bash
cd backend
npm install
```

## Настройка

1. Скопируйте `.env.example` в `.env`
2. Заполните переменные окружения
3. Запустите миграции БД

```bash
npm run migrate
npm run seed
```

## Запуск

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Аутентификация
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Чекины
```
GET    /api/checkins
POST   /api/checkins
GET    /api/checkins/:id
PUT    /api/checkins/:id
DELETE /api/checkins/:id
GET    /api/checkins/stats
POST   /api/checkins/import
```

### Факторы
```
GET    /api/factors
```

### Админ
```
GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/factors
POST   /api/admin/factors
PUT    /api/admin/factors/:id
DELETE /api/admin/factors/:id
```

## Структура проекта

```
backend/
├── src/
│   ├── config/          # Конфигурация (БД, env)
│   ├── middleware/      # Middleware (auth, errors)
│   ├── models/          # Модели данных
│   ├── controllers/     # Контроллеры
│   ├── routes/          # Маршруты
│   ├── services/        # Бизнес-логика
│   ├── types/           # TypeScript типы
│   └── server.ts        # Точка входа
├── migrations/          # SQL миграции
└── dist/                # Скомпилированный код
```

## Деплой на Railway

1. Подключите репозиторий к Railway
2. Настройте переменные окружения
3. Railway автоматически запустит `npm run build && npm start`

## Лицензия

MIT

