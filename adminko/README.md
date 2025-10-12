# Zyra Admin Panel

Админ-панель для управления пользователями и факторами в системе Zyra.

## Возможности

- ✅ Авторизация админа
- ✅ CRUD пользователей (создание, редактирование, удаление)
- ✅ Активация/деактивация пользователей
- ✅ Управление ролями (user, coach, admin)
- ✅ CRUD факторов (создание, редактирование, удаление)
- ✅ Пагинация списков
- ✅ Responsive дизайн

## Стек

- React 18 + TypeScript
- React Router v6
- Axios для API запросов
- shadcn/ui компоненты
- Tailwind CSS
- Vite

## Установка и запуск

### Локально

1. Установите зависимости:
```bash
cd adminko
npm install
```

2. Создайте `.env` файл:
```env
VITE_API_URL=http://localhost:3001
```

3. Запустите dev сервер:
```bash
npm run dev
```

Админка будет доступна по адресу: `http://localhost:5173`

### Production

Build для production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Доступ

По умолчанию (если создан через seed):
- Email: `digitalcluster25@gmail.com`
- Password: `149521MkSF#u*V`

## Структура

```
adminko/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui компоненты
│   │   ├── Layout/      # Layout компоненты
│   │   └── ...
│   ├── pages/
│   │   ├── Login.tsx    # Страница логина
│   │   ├── Users.tsx    # Управление пользователями
│   │   └── Factors.tsx  # Управление факторами
│   ├── services/
│   │   └── api.ts       # API client
│   ├── hooks/
│   │   └── useAuth.tsx  # Auth context & hook
│   ├── types/
│   │   └── index.ts     # TypeScript типы
│   └── App.tsx          # Главный компонент с роутингом
├── .env                 # Переменные окружения
└── package.json
```

## API Integration

Админка использует следующие API endpoints:

### Auth
- `POST /api/auth/login` - Вход в систему

### Users (Admin)
- `GET /api/admin/users` - Список пользователей
- `POST /api/admin/users` - Создать пользователя
- `PUT /api/admin/users/:id` - Обновить пользователя
- `DELETE /api/admin/users/:id` - Удалить пользователя
- `PATCH /api/admin/users/:id/activate` - Активировать
- `PATCH /api/admin/users/:id/deactivate` - Деактивировать

### Factors (Admin)
- `GET /api/admin/factors` - Список факторов
- `POST /api/admin/factors` - Создать фактор
- `PUT /api/admin/factors/:id` - Обновить фактор
- `DELETE /api/admin/factors/:id` - Удалить фактор

## Изменение API URL

Измените URL в `.env`:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

Или напрямую в `src/services/api.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

## Деплой на Railway

1. Создайте новый сервис в Railway
2. Подключите GitHub репозиторий
3. Установите Root Directory: `adminko`
4. Добавьте переменные окружения:
   - `VITE_API_URL` - URL вашего backend API
5. Deploy!

## Лицензия

Proprietary
