# 🚀 Railway Deployment Guide

## 📋 Обзор

Этот проект состоит из двух частей:
- **Backend** - API сервер на Node.js/Express
- **Adminko** - Админ-панель на React/Vite

## 🛠 Подготовка к деплою

### 1. Backend (API)

**Структура:**
```
backend/
├── src/                    # Исходный код
├── migrations/            # SQL миграции
├── package.json          # Зависимости
├── Dockerfile            # Docker конфигурация
├── railway.json          # Railway конфигурация
└── env.example           # Пример переменных окружения
```

**Переменные окружения:**
```env
DATABASE_URL=postgresql://...     # PostgreSQL URL от Railway
JWT_SECRET=your-secret-key       # Секретный ключ для JWT
JWT_REFRESH_SECRET=refresh-key   # Ключ для refresh токенов
JWT_EXPIRES_IN=15m               # Время жизни access токена
JWT_REFRESH_EXPIRES_IN=7d        # Время жизни refresh токена
PORT=3001                        # Порт (Railway автоматически)
NODE_ENV=production              # Режим production
CORS_ORIGIN=https://...          # CORS для фронтенда
```

### 2. Adminko (Админ-панель)

**Структура:**
```
adminko/
├── src/                    # Исходный код React
├── public/                 # Статические файлы
├── package.json           # Зависимости
├── vite.config.ts         # Конфигурация Vite с base: '/adminko/'
├── Dockerfile             # Docker конфигурация
├── nginx.conf             # Nginx конфигурация
├── railway.json           # Railway конфигурация
└── env.example            # Пример переменных окружения
```

**Переменные окружения:**
```env
VITE_API_URL=https://zyra-backend-production.up.railway.app
NODE_ENV=production
```

## 🚀 Деплой на Railway

### Шаг 1: Создание проектов

1. **Backend проект:**
   ```bash
   railway login
   railway init zyra-backend
   cd backend
   railway link
   ```

2. **Adminko проект:**
   ```bash
   cd ../adminko
   railway init zyra-adminko
   railway link
   ```

### Шаг 2: Настройка переменных окружения

**Для Backend:**
```bash
railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}
railway variables set JWT_SECRET=your-super-secret-jwt-key-here
railway variables set JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
railway variables set JWT_EXPIRES_IN=15m
railway variables set JWT_REFRESH_EXPIRES_IN=7d
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://your-domain.com
```

**Для Adminko:**
```bash
railway variables set VITE_API_URL=https://zyra-backend-production.up.railway.app
railway variables set NODE_ENV=production
```

### Шаг 3: Добавление PostgreSQL

```bash
# Для backend проекта
railway add postgresql
```

### Шаг 4: Деплой

```bash
# Backend
cd backend
railway up

# Adminko
cd ../adminko
railway up
```

## 🌐 Доступ к приложению

После успешного деплоя:

- **Backend API:** `https://zyra-backend-production.up.railway.app`
- **Админ-панель:** `https://your-domain.com/adminko`

## 🔧 Полезные команды

```bash
# Просмотр логов
railway logs

# Подключение к базе данных
railway connect postgresql

# Просмотр переменных окружения
railway variables

# Деплой из текущей директории
railway up

# Откат к предыдущей версии
railway rollback
```

## 🐛 Отладка

### Проблемы с CORS
Убедитесь, что `CORS_ORIGIN` в backend содержит правильный домен фронтенда.

### Проблемы с базой данных
Проверьте, что `DATABASE_URL` правильно настроен и PostgreSQL плагин добавлен.

### Проблемы с маршрутизацией
Убедитесь, что в `vite.config.ts` установлен `base: '/adminko/'`.

## 📝 Примечания

- Railway автоматически определяет порты
- Используйте Railway CLI для удобного управления
- Логи доступны в реальном времени через `railway logs`
- Переменные окружения можно настроить через веб-интерфейс Railway
