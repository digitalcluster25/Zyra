# Деплой Backend на Railway

## 1. Подготовка проекта Railway

1. Создайте новый сервис в Railway:
   ```
   railway service create backend
   ```

2. Свяжите backend с Railway:
   ```
   cd backend
   railway link
   ```

3. Добавьте переменные окружения в Railway Dashboard:
   - `DATABASE_URL` - автоматически из PostgreSQL сервиса
   - `JWT_SECRET` - ваш секретный ключ (минимум 32 символа)
   - `JWT_EXPIRES_IN` - `15m`
   - `JWT_REFRESH_EXPIRES_IN` - `7d`
   - `PORT` - `3001` (или оставьте пустым, Railway использует свой порт)
   - `NODE_ENV` - `production`
   - `ALLOWED_ORIGINS` - `https://zyra.up.railway.app`

## 2. Деплой

### Автоматический деплой (через Git)

Railway автоматически задеплоит при пуше в main:
```bash
git add .
git commit -m "Deploy backend"
git push origin main
```

### Ручной деплой

```bash
cd backend
railway up
```

## 3. Запуск миграций и seed

После деплоя Railway автоматически запустит:
1. `npm run build` - компиляция TypeScript
2. `npm run migrate` - применение миграций БД
3. `npm run seed` - создание админа и факторов
4. `npm start` - запуск сервера

Или вручную:
```bash
railway run npm run migrate
railway run npm run seed
```

## 4. Проверка

Проверьте логи:
```bash
railway logs
```

Проверьте health endpoint:
```bash
curl https://your-backend-url.railway.app/health
```

## 5. Настройка домена

1. В Railway Dashboard перейдите в Settings
2. В разделе Domains нажмите "Generate Domain"
3. Railway сгенерирует домен вида: `your-service.railway.app`
4. Обновите `ALLOWED_ORIGINS` в переменных окружения

## 6. Подключение к PostgreSQL

Railway автоматически установит `DATABASE_URL` если вы добавили PostgreSQL сервис в проект.

Для проверки подключения:
```bash
railway run npm run migrate
```

## Troubleshooting

### Ошибка подключения к БД
- Убедитесь, что PostgreSQL сервис запущен
- Проверьте `DATABASE_URL` в переменных окружения

### Миграции не применяются
```bash
railway run npm run migrate
```

### Нужно пересоздать админа
```bash
railway run npm run seed
```

### Логи не показываются
```bash
railway logs --follow
```

