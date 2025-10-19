# Настройка Mailjet для Zyra

## 📧 Что такое Mailjet?

**Mailjet** - комплексный email сервис для transactional и marketing emails с:
- 6,000 писем/месяц бесплатно (200/день)
- Визуальный редактор Passport (drag-and-drop)
- Управление контактами и подписками
- SMTP relay + REST API
- Статистика и аналитика
- Без скрытых ограничений

## 🚀 Установка

### 1. Регистрация на Mailjet

1. Перейдите на https://www.mailjet.com
2. Зарегистрируйте аккаунт
3. Подтвердите email
4. Получите API ключи в разделе **Account Settings → API Keys**:
   - API Key (Primary)
   - Secret Key

### 2. Настройка в проекте

#### Backend

```bash
cd backend
npm install node-mailjet
```

#### Переменные окружения

В `.env` добавьте:

```env
# Email (Mailjet)
MAILJET_API_KEY=your-mailjet-api-key
MAILJET_SECRET_KEY=your-mailjet-secret-key

# Вариант 1 (рекомендуется для старта): используйте домен Mailjet
EMAIL_FROM=noreply@mailjetmail.com
EMAIL_FROM_NAME=Zyra Team

# Вариант 2 (для продакшена): купите свой домен и верифицируйте его
# EMAIL_FROM=noreply@zyra.app
# EMAIL_FROM_NAME=Zyra Team

FRONTEND_URL=http://localhost:3002
```

### ⚠️ Важно про EMAIL_FROM

**НЕ используйте `noreply@zyra.up.railway.app`** - Railway не предоставляет почтовый сервер!

**Три варианта:**

1. **Для старта (бесплатно):** `noreply@mailjetmail.com`
   - Работает сразу, высокая доставляемость
   - Mailjet уже настроил SPF/DKIM

2. **Для продакшена (лучше):** Купите домен `zyra.app` ($10-15/год)
   - Профессиональный вид: `noreply@zyra.app`
   - Максимальная доставляемость (~98%)
   - Можно использовать для сайта

3. **Для тестов:** Ваш Gmail/Яндекс (лимит ~100-500 писем/день)

### 3. Проверка установки

```bash
# Запустите backend
cd backend
npm run dev

# Backend должен запуститься без ошибок
```

## 📝 Использование

### Отправка писем из кода

```typescript
import { sendWelcomeEmail, sendPasswordResetEmail, sendEmailConfirmedEmail } from './services/emailService';

// Приветственное письмо
await sendWelcomeEmail('user@example.com', 'Иван', 'confirmation-token');

// Сброс пароля
await sendPasswordResetEmail('user@example.com', 'Иван', 'reset-token');

// Подтверждение email
await sendEmailConfirmedEmail('user@example.com', 'Иван');
```

### Управление шаблонами в админке

1. Войдите в админ-панель: http://localhost:5173/
2. Перейдите в раздел **Email Шаблоны**
3. Выберите шаблон для редактирования
4. Измените HTML код или тему письма
5. Используйте переменные: `{{userName}}`, `{{confirmLink}}`, `{{resetLink}}`, `{{dashboardLink}}`
6. Просмотрите результат во вкладке **Предпросмотр**
7. Отправьте тестовое письмо
8. Сохраните изменения

## 🎨 Редактор Passport

Mailjet предоставляет визуальный редактор **Passport** для создания красивых писем без кода:

1. Войдите в Mailjet Dashboard
2. Перейдите в **Templates → Create a template**
3. Используйте drag-and-drop редактор
4. Экспортируйте HTML код
5. Вставьте в админку Zyra

## 📊 Аналитика

В Mailjet Dashboard доступна подробная статистика:
- Количество отправленных писем
- Открытия (opens)
- Клики (clicks)
- Доставляемость (delivery rate)
- Отписки (unsubscribes)

## 🔒 Верификация домена (для продакшена)

Для повышения доставляемости настройте SPF, DKIM и DMARC:

1. В Mailjet Dashboard перейдите в **Account Settings → Sender Domains**
2. Добавьте ваш домен (например, `yourdomain.com`)
3. Настройте DNS записи согласно инструкциям Mailjet:
   - SPF: `v=spf1 include:spf.mailjet.com ~all`
   - DKIM: получите уникальные записи для вашего домена
   - DMARC: `v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`

## 🚀 Деплой на Railway

### Добавление переменных окружения:

```bash
# В Railway Dashboard для backend сервиса
railway variables set MAILJET_API_KEY=your-api-key
railway variables set MAILJET_SECRET_KEY=your-secret-key
railway variables set EMAIL_FROM=noreply@yourdomain.com
railway variables set EMAIL_FROM_NAME="Zyra Team"
railway variables set FRONTEND_URL=https://your-frontend-url.railway.app
```

## 📚 Дополнительные ресурсы

- [Mailjet Documentation](https://dev.mailjet.com/)
- [Node.js Library](https://github.com/mailjet/mailjet-apiv3-nodejs)
- [Email Best Practices](https://www.mailjet.com/blog/news/email-best-practices/)

## 🔧 Troubleshooting

### Письма не отправляются

1. Проверьте API ключи в `.env`
2. Убедитесь, что backend запущен
3. Проверьте логи backend: `npm run dev`
4. Проверьте лимиты в Mailjet Dashboard

### Письма попадают в спам

1. Верифицируйте домен (SPF, DKIM, DMARC)
2. Используйте корректный `EMAIL_FROM` (не `noreply@localhost`)
3. Добавьте ссылку на отписку в письма
4. Прогрейте домен (постепенно увеличивайте объем отправок)

### Ошибка "Authentication failed"

- Проверьте правильность `MAILJET_API_KEY` и `MAILJET_SECRET_KEY`
- Убедитесь, что ключи скопированы полностью без пробелов
- Перезапустите backend после изменения `.env`


