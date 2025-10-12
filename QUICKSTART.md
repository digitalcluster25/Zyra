# Быстрый старт Zyra

## 🚀 Локальная разработка

### Prerequis Prerequis
- Node.js 18+
- PostgreSQL (или используйте Railway)
- npm или yarn

---

## 1. Backend

```bash
cd backend

# Установить зависимости
npm install

# Создать .env
cp .env.example .env

# Заполнить .env:
# DATABASE_URL=postgresql://user:pass@localhost:5432/zyra
# JWT_SECRET=your-32-char-secret-key
# JWT_EXPIRES_IN=15m
# JWT_REFRESH_EXPIRES_IN=7d
# PORT=3001
# ALLOWED_ORIGINS=http://localhost:5173

# Применить миграции
npm run migrate

# Создать админа + факторы
npm run seed

# Запустить сервер
npm run dev
```

API запущено на `http://localhost:3001`

Проверка:
```bash
curl http://localhost:3001/health
```

---

## 2. Frontend

```bash
# В корне проекта

# Установить зависимости
npm install

# Создать .env
echo "VITE_API_URL=http://localhost:3001" > .env

# Запустить dev сервер
npm run dev
```

Frontend запущен на `http://localhost:5173`

### Первый запуск
1. Откройте `http://localhost:5173`
2. Нажмите "Зарегистрироваться"
3. Введите:
   - Никнейм: `Тестовый Спортсмен`
   - Email: `athlete@example.com`
   - Пароль: `test123`
4. Войдите в систему

Если у вас есть старые данные в localStorage — появится баннер с предложением импортировать.

---

## 3. Admin Panel

```bash
cd adminko

# Установить зависимости
npm install

# Создать .env
echo "VITE_API_URL=http://localhost:3001" > .env

# Запустить dev сервер
npm run dev
```

Админка запущена на `http://localhost:5173`

### Вход в админку
- Email: `digitalcluster25@gmail.com`
- Пароль: `149521MkSF#u*V`

(созданы через `npm run seed` в backend)

---

## 📦 Деплой на Railway

### Backend

1. В Railway Dashboard:
   - Создайте сервис "Zyra Backend"
   - Подключите GitHub репозиторий
   - Установите Root Directory: `backend`

2. Добавьте переменные окружения:
   ```env
   DATABASE_URL=<автоматически из PostgreSQL>
   JWT_SECRET=<сгенерируйте 32+ символов>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   NODE_ENV=production
   ALLOWED_ORIGINS=https://zyra.up.railway.app
   ```

3. Deploy!

Railway автоматически:
- Соберёт TypeScript (`npm run build`)
- Применит миграции (`npm run migrate`)
- Создаст seed данные (`npm run seed`)
- Запустит сервер (`npm start`)

### Frontend

1. В Railway Dashboard:
   - Создайте сервис "Zyra Frontend"
   - Подключите GitHub репозиторий
   - Установите Root Directory: `/` (корень)

2. Добавьте переменные окружения:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   ```

3. Deploy!

### Admin Panel

1. В Railway Dashboard:
   - Создайте сервис "Zyra Admin"
   - Подключите GitHub репозиторий
   - Установите Root Directory: `adminko`

2. Добавьте переменные окружения:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   ```

3. Deploy!

---

## 🧪 Тестирование API

### Регистрация
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "athlete@example.com",
    "password": "test123",
    "nickname": "Test Athlete"
  }'
```

### Логин
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "athlete@example.com",
    "password": "test123"
  }'
```

### Создать чекин
```bash
TOKEN="your-access-token"

curl -X POST http://localhost:3001/api/checkins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "checkInData": {
      "sleep": 3,
      "stress": 2,
      "fatigue": 3,
      "soreness": 2,
      "hadTraining": true,
      "trainingDuration": 60,
      "rpe": 7,
      "factors": ["Недосып", "Стресс на работе"]
    }
  }'
```

---

## 📚 Документация

- **Backend API**: См. `backend/README.md`
- **Admin Panel**: См. `adminko/README.md`
- **Deployment**: См. `backend/DEPLOY.md`
- **Подробный план**: См. `docs/plan2.md`

---

## 🔑 Дефолтные креды

### Admin (созданы через seed)
- Email: `digitalcluster25@gmail.com`
- Пароль: `149521MkSF#u*V`

### Тестовый пользователь (создайте сами)
- Email: `athlete@example.com`
- Пароль: `test123`
- Никнейм: `Test Athlete`

---

## 🛠️ Полезные команды

### Backend
```bash
npm run dev         # Dev сервер с hot reload
npm run build       # Компиляция TypeScript
npm start           # Запуск production сервера
npm run migrate     # Применить миграции
npm run seed        # Создать seed данные
```

### Frontend / Adminko
```bash
npm run dev         # Dev сервер
npm run build       # Production build
npm run preview     # Preview production build
```

### Railway CLI
```bash
railway link        # Связать с проектом
railway up          # Deploy
railway logs        # Посмотреть логи
railway run npm run migrate  # Запустить миграции
railway variables   # Посмотреть env переменные
```

---

## 🐛 Troubleshooting

### Backend не подключается к БД
- Проверьте `DATABASE_URL` в `.env`
- Убедитесь, что PostgreSQL запущен
- Для Railway: проверьте, что DB сервис активен

### Frontend показывает ошибки CORS
- Убедитесь, что `ALLOWED_ORIGINS` в backend включает ваш frontend URL
- Для локальной разработки: `http://localhost:5173`

### Миграции не применяются
```bash
cd backend
npm run migrate
```

### Админ не может войти
```bash
cd backend
npm run seed
```

Это пересоздаст админа с дефолтными кредами.

---

## 📊 Методология

- **Hooper Index**: Сумма сна, стресса, усталости, болезненности (5-35, ниже = лучше)
- **sRPE**: Training Load = Duration × RPE (session Rating of Perceived Exertion)
- **Banister Model**:
  - CTL (Chronic Training Load): долгосрочная нагрузка, 42 дня
  - ATL (Acute Training Load): краткосрочная усталость, 7 дней
  - TSB (Training Stress Balance): CTL - ATL (готовность к тренировкам)
- **Factor Impact**: Экспоненциальная модель влияния внешних факторов

---

Готово! Теперь вы можете начать разработку или деплой 🚀

