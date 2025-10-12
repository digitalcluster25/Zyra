# 🚀 Быстрый Старт Zyra

## Текущий Статус

✅ Frontend (React + TypeScript + Tailwind)  
✅ Backend API (Node.js + Express + PostgreSQL)  
✅ Админка (/adminko)  
✅ Proxy настроен (frontend → backend + adminko)  
✅ Импульсно-откликовая модель (Zyra 3.0)  
⚠️ **Требуется:** Запуск PostgreSQL

---

## 📋 Шаги для Запуска Локально

### 1. Запустите Docker Desktop
Убедитесь, что Docker Desktop запущен на вашем Mac.

### 2. Запустите PostgreSQL
```bash
docker run --name zyra-postgres \
  -e POSTGRES_PASSWORD=zyra2025 \
  -e POSTGRES_DB=zyra \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 3. Запустите Миграции и Seed
```bash
cd backend
npm run migrate
npm run seed
```

**Результат:**
- ✅ Создана структура БД (users, factors, checkins, goals)
- ✅ Создан admin пользователь: `digitalcluster25@gmail.com` / `149521MkSF#u*V`
- ✅ Загружены факторы (сон, стресс, медитация, тренировки и др.)

### 4. Запустите Backend API (порт 3001)
```bash
cd backend
npm run dev
```

### 5. Запустите Frontend (порт 3000)
В новом терминале:
```bash
npm run dev
```

### 6. Запустите Админку (порт 5173)
В новом терминале:
```bash
cd adminko
npm run dev
```

---

## 🌐 Доступ

| Сервис | URL | Credentials |
|--------|-----|-------------|
| **Frontend** | http://localhost:3000 | - |
| **Backend API** | http://localhost:3001 | - |
| **Админка** | http://localhost:5173 | digitalcluster25@gmail.com / 149521MkSF#u*V |

---

## 🔧 Альтернатива: Деплой на Railway

Если не хотите запускать локально, задеплойте на Railway:

### 1. Привяжите Backend к Railway
```bash
cd backend
railway up
```

### 2. Настройте переменные окружения
Railway автоматически подключит PostgreSQL.

Добавьте вручную:
- `JWT_SECRET=zyra-super-secret-jwt-key-2025-production`
- `JWT_EXPIRES_IN=15m`
- `JWT_REFRESH_EXPIRES_IN=7d`
- `ADMIN_EMAIL=digitalcluster25@gmail.com`
- `ADMIN_PASSWORD=149521MkSF#u*V`
- `ALLOWED_ORIGINS=https://zyra.up.railway.app`

### 3. Запустите Миграции на Railway
```bash
railway run npm run migrate
railway run npm run seed
```

### 4. Задеплойте Frontend
```bash
railway up
```

---

## ✅ Проверка Работоспособности

### Backend API
```bash
curl http://localhost:3001/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "2025-10-12T20:00:00.000Z",
  "database": "connected"
}
```

### Админка - Вход
1. Перейдите на http://localhost:5173
2. Введите `digitalcluster25@gmail.com` / `149521MkSF#u*V`
3. Вы должны попасть в админ-панель

### PostgreSQL
```bash
docker exec -it zyra-postgres psql -U postgres -d zyra -c "\dt"
```

Должна отобразиться список таблиц: `users`, `factors`, `checkins`, `checkin_factors`, `goals`.

---

## 🛠️ Troubleshooting

### Docker не запускается
```bash
# Проверьте статус
docker ps

# Если не запущен, запустите:
open -a Docker
```

### Backend не подключается к PostgreSQL
```bash
# Проверьте, что контейнер запущен
docker ps | grep zyra-postgres

# Перезапустите контейнер
docker restart zyra-postgres

# Проверьте логи
docker logs zyra-postgres
```

### Adminko показывает ошибку
Убедитесь, что:
1. Adminko запущена: `cd adminko && npm run dev`
2. Порт 5173 свободен
3. Открываете adminko напрямую: http://localhost:5173 (НЕ через /adminko)

### Backend ошибка "Invalid environment variables"
Проверьте `backend/.env`:
```bash
cat backend/.env
```

Убедитесь, что все переменные присутствуют (особенно `ALLOWED_ORIGINS`).

---

##  Что Дальше?

1. ✅ **Локальная разработка:** Запустите Docker + PostgreSQL + Backend + Frontend + Adminko
2. ⏳ **Деплой на Railway:** Задеплойте backend и frontend
3. ⏳ **Настройка домена:** Привяжите custom domain к Railway
4. ⏳ **Миграция Frontend на Backend:** Включите авторизацию в `App.tsx`

---

## 📞 Поддержка

Если возникли проблемы, свяжитесь с разработчиком или создайте issue в репозитории GitHub.

**Email:** digitalcluster25@gmail.com  
**GitHub:** https://github.com/digitalcluster25/Zyra
