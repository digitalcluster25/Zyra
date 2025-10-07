# Zyra

Zyra — современное веб-приложение для управления проектами и задачами с интуитивным интерфейсом на базе shadcn/ui и Tailwind CSS.

## Документация

Полное описание требований доступно в [BRD документе](./docs/BRD.md).

## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: Prisma ORM with PostgreSQL (production) / SQLite (development)
- **Deployment**: Railway
- **Charts**: Recharts

## Установка

```bash
# Клонировать репозиторий
git clone https://github.com/digitalcluster25/Zyra.git

# Установить зависимости
npm install

# Настроить базу данных
cp .env.example .env
npx prisma generate
npx prisma migrate dev

# Запустить в режиме разработки
npm run dev
```

## База данных

### Development
Проект использует SQLite для локальной разработки:
```bash
DATABASE_URL="file:./dev.db"
```

### Production
На Railway используется PostgreSQL. DATABASE_URL автоматически предоставляется Railway.

### Команды Prisma

```bash
npm run db:generate  # Генерация Prisma Client
npm run db:push      # Push schema изменений
npm run db:migrate   # Создание и применение миграций
npm run db:studio    # Открыть Prisma Studio
```

## Deployment на Railway

Проект настроен для автоматического деплоя на Railway:

```bash
# Deploy via CLI
railway up

# Запустить миграции на production
railway run npx prisma migrate deploy

# Просмотр логов
railway logs
```

Подробнее см. [Railway Deployment Guide](./docs/RAILWAY.md)

## Лицензия

MIT License - см. [LICENSE](./LICENSE)
