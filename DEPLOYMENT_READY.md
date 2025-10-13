# ✅ Готово к деплою на Railway!

## 🎯 Что настроено:

### 📦 Backend (API)
- ✅ **railway.json** - конфигурация деплоя
- ✅ **Dockerfile** - Docker образ с PostgreSQL миграциями
- ✅ **env.example** - пример переменных окружения
- ✅ **Сборка работает** - TypeScript компилируется без ошибок

### 🎨 Adminko (Админ-панель)
- ✅ **railway.json** - конфигурация деплоя
- ✅ **Dockerfile + nginx.conf** - Docker с Nginx для статических файлов
- ✅ **vite.config.ts** - настроен `base: '/adminko/'` для маршрутизации
- ✅ **API URL** - автоматическое определение production URL
- ✅ **Сборка работает** - Vite собирает без ошибок

## 🚀 Быстрый старт деплоя:

### 1. Установить Railway CLI:
```bash
npm install -g @railway/cli
railway login
```

### 2. Деплой Backend:
```bash
cd backend
railway init zyra-backend
railway add postgresql
railway variables set JWT_SECRET=your-super-secret-key
railway variables set JWT_REFRESH_SECRET=your-refresh-secret-key
railway variables set NODE_ENV=production
railway up
```

### 3. Деплой Adminko:
```bash
cd ../adminko
railway init zyra-adminko
railway variables set VITE_API_URL=https://zyra-backend-production.up.railway.app
railway variables set NODE_ENV=production
railway up
```

## ⚠️ Исправление ошибки деплоя:

**Проблема:** `npm error Missing script: "start"`

**Решение:** Обновлен `adminko/railway.json` - теперь использует `npm run start` вместо `npm run preview`.

**Статус:** ✅ Исправлено

## 🌐 Результат:

После деплоя админ-панель будет доступна по адресу:
**`https://your-domain.com/adminko`**

- 🔐 Страница авторизации администратора
- 👥 Управление пользователями
- ⚙️ Управление факторами
- 📊 Dashboard с аналитикой
- 📈 Отчеты и метрики

## 📋 Файлы для Railway:

### Backend:
```
backend/
├── railway.json          ✅ Готов
├── Dockerfile            ✅ Готов
├── env.example           ✅ Готов
└── package.json          ✅ Обновлен
```

### Adminko:
```
adminko/
├── railway.json          ✅ Готов
├── Dockerfile            ✅ Готов
├── nginx.conf            ✅ Готов
├── vite.config.ts        ✅ Обновлен (base: '/adminko/')
├── package.json          ✅ Обновлен
└── src/services/api.ts   ✅ Обновлен (production URL)
```

## 🔧 Переменные окружения:

### Backend:
- `DATABASE_URL` (автоматически от PostgreSQL плагина)
- `JWT_SECRET` (установить вручную)
- `JWT_REFRESH_SECRET` (установить вручную)
- `NODE_ENV=production`

### Adminko:
- `VITE_API_URL` (URL backend'а)
- `NODE_ENV=production`

## 📚 Документация:
- **Полная инструкция:** `RAILWAY_DEPLOYMENT.md`
- **Готовность к деплою:** ✅ 100%

---

## 🎉 Готово к production!

Все файлы настроены, сборки работают, Railway готов к деплою! 🚀
