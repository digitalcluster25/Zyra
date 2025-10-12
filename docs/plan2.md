# План внедрения Backend + БД + Админка

**Дата:** 12 октября 2025  
**Проект:** ZYRA - Мониторинг атлетов  
**Railway Project ID:** aef7625d-578e-4016-a0dc-c2fe680eabe7

---

## 1. Обзор архитектуры

### 1.1. Технологический стек

**Frontend:**
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Vite

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL (Railway)
- JWT для аутентификации
- bcrypt для хеширования паролей

**Админка:**
- React Admin или отдельное React-приложение
- Расположение: `/adminko`
- Авторизация через email/password

**Деплой:**
- Frontend: Railway
- Backend: Railway
- Database: PostgreSQL на Railway

---

## 2. Структура базы данных

### 2.1. Таблица `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'coach')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2.2. Таблица `checkins`

```sql
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkin_date TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Индекс Хупера (5 метрик)
  sleep_quality INTEGER NOT NULL CHECK (sleep_quality BETWEEN 1 AND 7),
  fatigue INTEGER NOT NULL CHECK (fatigue BETWEEN 1 AND 7),
  muscle_soreness INTEGER NOT NULL CHECK (muscle_soreness BETWEEN 1 AND 7),
  stress INTEGER NOT NULL CHECK (stress BETWEEN 1 AND 7),
  mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 7),
  
  -- Дополнительные метрики
  focus INTEGER CHECK (focus BETWEEN 1 AND 7),
  motivation INTEGER CHECK (motivation BETWEEN 1 AND 7),
  
  -- sRPE метрики
  had_training BOOLEAN DEFAULT false,
  training_duration INTEGER CHECK (training_duration > 0),
  rpe INTEGER CHECK (rpe BETWEEN 0 AND 10),
  
  -- Расчетные показатели
  hooper_index INTEGER NOT NULL,
  daily_load DECIMAL(10,2) DEFAULT 0,
  ctl DECIMAL(10,2) DEFAULT 0,
  atl DECIMAL(10,2) DEFAULT 0,
  tsb DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_date ON checkins(checkin_date DESC);
CREATE INDEX idx_checkins_user_date ON checkins(user_id, checkin_date DESC);
```

### 2.3. Таблица `factors`

```sql
CREATE TABLE factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  weight DECIMAL(5,3) NOT NULL,
  tau INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_factors_active ON factors(is_active);
```

### 2.4. Таблица `checkin_factors` (связь Many-to-Many)

```sql
CREATE TABLE checkin_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
  factor_id UUID NOT NULL REFERENCES factors(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(checkin_id, factor_id)
);

CREATE INDEX idx_checkin_factors_checkin ON checkin_factors(checkin_id);
CREATE INDEX idx_checkin_factors_factor ON checkin_factors(factor_id);
```

### 2.5. Таблица `goals` (будущее)

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  is_active BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);
```

---

## 3. Backend API

### 3.1. Структура директорий

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Конфигурация PostgreSQL
│   │   └── env.ts                # Переменные окружения
│   ├── middleware/
│   │   ├── auth.ts               # JWT middleware
│   │   ├── errorHandler.ts      # Обработка ошибок
│   │   └── validation.ts         # Валидация запросов
│   ├── models/
│   │   ├── User.ts
│   │   ├── CheckIn.ts
│   │   ├── Factor.ts
│   │   └── Goal.ts
│   ├── controllers/
│   │   ├── authController.ts    # Регистрация, логин
│   │   ├── userController.ts    # CRUD пользователей
│   │   ├── checkinController.ts # CRUD чекинов
│   │   └── factorController.ts  # CRUD факторов
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── checkins.ts
│   │   └── factors.ts
│   ├── services/
│   │   ├── athleteMonitoring.ts # Расчеты (CTL, ATL, TSB, Hooper)
│   │   └── emailService.ts      # Отправка email (опционально)
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── migrations/                   # SQL миграции
├── package.json
├── tsconfig.json
└── .env.example
```

### 3.2. API Endpoints

#### Аутентификация
```
POST   /api/auth/register        # Регистрация
POST   /api/auth/login           # Вход
POST   /api/auth/refresh         # Обновление токена
POST   /api/auth/logout          # Выход
GET    /api/auth/me              # Текущий пользователь
```

#### Пользователи (Админ)
```
GET    /api/admin/users          # Список пользователей
GET    /api/admin/users/:id      # Пользователь по ID
POST   /api/admin/users          # Создать пользователя
PUT    /api/admin/users/:id      # Обновить пользователя
DELETE /api/admin/users/:id      # Удалить пользователя
PATCH  /api/admin/users/:id/activate   # Активировать
PATCH  /api/admin/users/:id/deactivate # Деактивировать
```

#### Чекины
```
GET    /api/checkins             # Мои чекины
POST   /api/checkins             # Создать чекин
GET    /api/checkins/:id         # Чекин по ID
PUT    /api/checkins/:id         # Обновить чекин
DELETE /api/checkins/:id         # Удалить чекин
GET    /api/checkins/stats       # Статистика
```

#### Факторы
```
GET    /api/factors              # Все активные факторы
GET    /api/admin/factors        # Все факторы (админ)
POST   /api/admin/factors        # Создать фактор (админ)
PUT    /api/admin/factors/:id    # Обновить фактор (админ)
DELETE /api/admin/factors/:id    # Удалить фактор (админ)
```

---

## 4. Админка

### 4.1. Структура `/adminko`

```
adminko/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── Users/
│   │   │   ├── UserList.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── UserDetails.tsx
│   │   │   └── UserFilters.tsx
│   │   ├── Auth/
│   │   │   └── AdminLogin.tsx
│   │   └── ui/                  # shadcn/ui компоненты
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Factors.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useUsers.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 4.2. Функционал админки

#### Страница логина
- Email: `digitalcluster25@gmail.com`
- Password: `149521MkSF#u*V`
- Запоминание сессии
- Защита от брутфорса

#### Dashboard
- Статистика: общее кол-во пользователей, активных, чекинов
- Графики активности
- Последние регистрации

#### Управление пользователями (CRUD)
- **Список пользователей:**
  - Таблица с пагинацией
  - Фильтры: роль, статус, дата регистрации
  - Поиск по email, nickname
  - Сортировка

- **Создание пользователя:**
  - Email
  - Nickname
  - Password (генерация + отправка на email)
  - Роль (user, admin, coach)
  - Статус активности

- **Редактирование:**
  - Изменение всех полей
  - Смена пароля
  - Изменение роли

- **Удаление:**
  - Подтверждение удаления
  - Мягкое удаление (is_active = false)

- **Просмотр деталей:**
  - История чекинов
  - Статистика
  - График Индекса Хупера
  - График PMC

#### Управление факторами
- CRUD операции
- Активация/деактивация
- Редактирование весов (weight, tau)

---

## 5. План внедрения

### ✅ Фаза 1: Настройка инфраструктуры (ЗАВЕРШЕНО)
- [x] Создать PostgreSQL на Railway
- [x] Создать backend директорию
- [x] Настроить TypeScript + Express
- [x] Подключить к PostgreSQL
- [x] Создать миграции БД
- [x] Добавить seed данные (факторы, админ)

### ✅ Фаза 2: Backend API (ЗАВЕРШЕНО)
- [x] Реализовать модели данных (User, CheckIn, Factor)
- [x] Создать middleware (auth, validation, errors, rate limit)
- [x] Реализовать контроллеры (Auth, CheckIns, Factors, Admin)
- [x] Создать routes (/api/auth, /api/checkins, /api/factors, /api/admin)
- [x] Добавить JWT аутентификацию (access + refresh tokens)
- [x] Тестирование API (локально)

### 🔄 Фаза 3: Миграция Frontend (ОЖИДАЕТ)
- [ ] Создать API service для frontend
- [ ] Заменить localStorage на API calls
- [ ] Добавить авторизацию в frontend
- [ ] Добавить обработку ошибок
- [ ] Добавить loading states
- [ ] Добавить endpoint для импорта старых данных

### ✅ Фаза 4: Админка (ЗАВЕРШЕНО)
- [x] Создать проект `/adminko`
- [x] Настроить Vite + React + TypeScript
- [x] Создать Layout (AdminLayout, Header)
- [x] Реализовать страницу логина с проверкой роли
- [x] Реализовать CRUD пользователей (таблица + модалка)
- [x] Реализовать управление факторами (карточки + модалка)
- [x] Пагинация для списка пользователей
- [x] JWT auth с автообновлением токенов

### 🔄 Фаза 5: Деплой (В ПРОЦЕССЕ)
- [ ] Задеплоить backend на Railway (см. backend/DEPLOY.md)
- [ ] Настроить переменные окружения (DATABASE_URL, JWT_SECRET, ALLOWED_ORIGINS)
- [ ] Запустить миграции на production (`railway run npm run migrate`)
- [ ] Запустить seed на production (`railway run npm run seed`)
- [ ] Задеплоить админку на Railway
- [ ] Задеплоить frontend на Railway (после миграции на API)
- [ ] Настроить домены/subdomains

### Фаза 6: Тестирование и Документация (1 день)
- [ ] E2E тестирование
- [ ] Исправление багов
- [ ] Документация API (Swagger/OpenAPI)
- [ ] README для каждого модуля

---

## 6. Переменные окружения

### Backend `.env`
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Admin
ADMIN_EMAIL=digitalcluster25@gmail.com
ADMIN_PASSWORD=149521MkSF#u*V

# Server
PORT=3001
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://zyra.app,https://admin.zyra.app
```

### Frontend `.env`
```env
VITE_API_URL=https://zyra.up.railway.app
```

### Adminko `.env`
```env
VITE_API_URL=https://zyra.up.railway.app
```

---

## 7. Безопасность

### 7.1. Аутентификация
- JWT токены (Access + Refresh)
- Хеширование паролей: bcrypt (salt rounds: 10)
- HttpOnly cookies для refresh токенов

### 7.2. Авторизация
- Middleware для проверки ролей
- Admin-only endpoints защищены
- Пользователь видит только свои данные

### 7.3. Валидация
- Joi/Zod для валидации входных данных
- Sanitization от SQL injection
- Rate limiting

### 7.4. CORS
- Whitelist разрешенных доменов
- Credentials: true

---

## 8. Миграция данных из localStorage

### 8.1. Стратегия
1. Пользователь создает аккаунт
2. При первом логине проверяем localStorage
3. Если есть данные - предлагаем импорт
4. Отправляем все чекины на backend
5. Очищаем localStorage

### 8.2. Endpoint для миграции
```
POST /api/checkins/import
Body: {
  checkins: CheckInRecord[]
}
```

---

## 9. Следующие шаги

После завершения базовой реализации:

1. **Email уведомления:**
   - Регистрация пользователя
   - Сброс пароля
   - Еженедельный отчет

2. **Режим тренера:**
   - Связь тренер-спортсмен
   - Просмотр всех спортсменов
   - Комментарии к чекинам

3. **Аналитика:**
   - Экспорт данных (CSV, PDF)
   - Расширенные графики
   - Сравнение периодов

4. **Мобильное приложение:**
   - React Native
   - Push уведомления

---

## 10. Технические требования

### Минимальные требования Railway
- PostgreSQL: 256 MB RAM
- Backend: 512 MB RAM
- Стоимость: ~$5-10/месяц

### Производительность
- API Response time: < 200ms
- Database queries: оптимизированы через индексы
- Пагинация: по умолчанию 20 записей

---

---

## 📦 Готовность к деплою

### Backend
- ✅ Код готов
- ✅ Миграции созданы
- ✅ Seed данные подготовлены
- ✅ Конфигурация Railway (railway.json, Procfile)
- ✅ DEPLOY.md с инструкциями
- ⏳ **Осталось:** Задеплоить на Railway

### Admin Panel
- ✅ Код готов
- ✅ UI компоненты настроены
- ✅ API integration
- ✅ JWT auth
- ⏳ **Осталось:** Задеплоить на Railway после backend

### Frontend
- ✅ Работает локально с localStorage
- ⏳ **Осталось:** Мигрировать на API calls

---

## 🚀 Быстрый старт деплоя

### 1. Deploy Backend (5-10 минут)
```bash
cd backend

# Вариант A: Railway CLI
railway link aef7625d-578e-4016-a0dc-c2fe680eabe7
railway up
railway run npm run migrate
railway run npm run seed

# Вариант B: Через GitHub
# 1. Push в GitHub
# 2. В Railway: New Service → GitHub → Root: backend
# 3. Добавить переменные окружения
# 4. Deploy
```

### 2. Deploy Admin Panel (5 минут)
```bash
# В Railway: New Service → GitHub → Root: adminko
# Добавить: VITE_API_URL=https://your-backend.railway.app
# Deploy
```

### 3. Migrate Frontend (1-2 часа)
- Создать `src/services/api.ts`
- Заменить все `localStorage.getItem` на API calls
- Добавить импорт старых данных
- Тестирование

### 4. Deploy Frontend (5 минут)
```bash
# В Railway: New Service → GitHub → Root: /
# Добавить: VITE_API_URL=https://your-backend.railway.app
# Deploy
```

---

## Заключение

✅ **Backend API:** Полностью реализован и готов к деплою
✅ **Admin Panel:** Полностью реализована и готова к деплою
⏳ **Frontend:** Требуется миграция с localStorage на API
⏳ **Deployment:** Готов к деплою на Railway

Этот план обеспечивает полноценный переход от localStorage к централизованной БД с админкой для управления пользователями. Архитектура масштабируема и готова к дальнейшему расширению функционала (режим тренера, мобильное приложение).

**Текущий статус:** Фазы 1, 2, 4 завершены ✅
**Следующий шаг:** Деплой backend на Railway
**Приоритет:** Высокий

