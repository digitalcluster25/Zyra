# 🚀 Railway Deployment Guide

## 📋 Настройка переменных окружения в Railway

### Backend (API) - Railway Variables:

```bash
# Database (автоматически предоставляется Railway)
DATABASE_URL=<railway-postgres-url>

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=production

# CORS
CORS_ORIGIN=https://zyra-production.up.railway.app,https://zyra-admin-production.up.railway.app

# Admin Credentials
ADMIN_EMAIL=admin@zyra.app
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS=https://zyra-production.up.railway.app,https://zyra-admin-production.up.railway.app

# Email (Mailjet)
MAILJET_API_KEY=your-mailjet-api-key
MAILJET_SECRET_KEY=your-mailjet-secret-key
EMAIL_FROM=noreply@mailjetmail.com
EMAIL_FROM_NAME=Zyra Team
FRONTEND_URL=https://zyra-production.up.railway.app
```

### Frontend (Main App) - Railway Variables:

```bash
VITE_API_URL=https://zyra-backend-production.up.railway.app
```

### Admin Panel - Railway Variables:

```bash
VITE_API_URL=https://zyra-backend-production.up.railway.app
```

## 🔧 Шаги деплоя:

1. **Создайте 3 сервиса в Railway:**
   - `zyra-backend` (API)
   - `zyra-frontend` (Main App)  
   - `zyra-admin` (Admin Panel)

2. **Добавьте PostgreSQL базу данных в Railway**

3. **Настройте переменные окружения для каждого сервиса**

4. **Деплой:**
   - Backend: корневая папка проекта
   - Frontend: корневая папка проекта (Vite)
   - Admin: папка `adminko/`

## 📁 Структура деплоя:

```
zyra-backend (Railway Service)
├── backend/          # API код
├── railway.json      # Railway конфигурация
└── package.json      # Backend зависимости

zyra-frontend (Railway Service)  
├── src/              # React код
├── adminko/          # Admin код
├── components/       # UI компоненты
└── package.json      # Frontend зависимости
```

## 🔗 Ссылки после деплоя:

- **Main App:** `https://zyra-production.up.railway.app`
- **Admin Panel:** `https://zyra-admin-production.up.railway.app`
- **API:** `https://zyra-backend-production.up.railway.app`

## ⚠️ Важные моменты:

1. **Database:** Railway автоматически создаст `DATABASE_URL`
2. **CORS:** Обновите домены после получения Railway URL
3. **Email:** Настройте Mailjet API ключи
4. **JWT:** Используйте надежные секретные ключи в продакшене
