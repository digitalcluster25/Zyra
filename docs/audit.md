# 🔍 ТЕХНИЧЕСКИЙ АУДИТ ПРОЕКТА ZYRA

**Дата аудита:** 19 октября 2025  
**Версия проекта:** 0.0.0  
**Аудитор:** Claude (Anthropic)

---

## 📊 EXECUTIVE SUMMARY

**TECHNICAL DEBT SCORE: 6.5/10** (средний уровень технического долга)

Проект находится на этапе активной разработки с хорошей архитектурной основой, но содержит критичные проблемы безопасности, значительные технические долги и несоответствия между компонентами. Требуется немедленное внимание к безопасности и рефакторинг ключевых модулей.

**Ключевые находки:**
- ✅ 25+ пунктов, которые работают хорошо
- ⚠️ 35+ проблем средней важности
- 🔴 15 критичных проблем требуют немедленного внимания
- 💡 60+ конкретных рекомендаций с примерами кода

---

## 🎯 ТОП-5 КРИТИЧНЫХ ПРОБЛЕМ

### 1. 🔴 БЕЗОПАСНОСТЬ: .env может быть в git-истории
**Файл:** `backend/.env`  
**Риск:** Если попал в git, все секреты скомпрометированы (JWT, admin password, DB credentials)

**Проверить СЕЙЧАС:**
```bash
cd /Users/macbookpro/Coding/zyra
git log --all --full-history -- "*/.env" "**/.env" "**/backend/.env"
```

**Если найден:**
```bash
# ОСТОРОЖНО! Переписывает историю
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**Сгенерировать новые секреты:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Запустить 3 раза для JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_PASSWORD
```

---

### 2. 🔴 ФУНКЦИОНАЛЬНОСТЬ: Факторы не влияют на расчеты
**Файл:** `utils/athleteMonitoring.ts:218`  
**Проблема:** Пользователи выбирают факторы в CheckInFlow, но они НЕ влияют на Hooper Index

```typescript
// СЕЙЧАС (неправильно):
static createCheckInRecord(data: CheckInData, previousRecord?: CheckInRecord) {
  const hooperIndex = this.calculateHooperIndex(data); // ❌ Факторы игнорируются
  return { id, data, hooperIndex, dailyLoad, ctl, atl, tsb };
}

// ДОЛЖНО БЫТЬ:
static calculateHooperIndex(data: CheckInData, factors: Factor[]): number {
  let baseIndex = data.sleepQuality + data.fatigue + 
                  data.muscleSoreness + data.stress + data.mood;
  
  // ✅ Применить факторы
  if (data.factors && data.factors.length > 0) {
    const factorAdjustment = data.factors.reduce((sum, factorId) => {
      const factor = factors.find(f => f.id === factorId);
      if (!factor) return sum;
      return sum + (factor.weight * 5); // -5 до +5
    }, 0);
    
    baseIndex += factorAdjustment;
  }
  
  return Math.max(5, Math.min(35, Math.round(baseIndex)));
}
```

---

### 3. 🔴 АРХИТЕКТУРА: Нет миграции данных localStorage
**Файл:** `App.tsx`, `types.ts`  
**Проблема:** Старая модель (energyLevel, stressLevel, tss) → Новая модель (fatigue, stress, sRPE)

Пользователи со старыми данными получат ошибки при открытии приложения!

**Решение:**
```typescript
// src/utils/migrations.ts
export function migrateCheckInData() {
  const history = localStorage.getItem('checkInHistory');
  if (!history) return;
  
  try {
    const records = JSON.parse(history);
    let needsMigration = false;
    
    const migrated = records.map(record => {
      const data = record.data;
      
      // energyLevel (1=плохо, 7=хорошо) → fatigue (1=хорошо, 7=плохо)
      if (data.energyLevel !== undefined && data.fatigue === undefined) {
        needsMigration = true;
        data.fatigue = 8 - data.energyLevel;
        delete data.energyLevel;
      }
      
      // stressLevel → stress (без изменений)
      if (data.stressLevel !== undefined && data.stress === undefined) {
        needsMigration = true;
        data.stress = data.stressLevel;
        delete data.stressLevel;
      }
      
      // tss → sRPE формат
      if (data.tss !== undefined && !data.hadTraining) {
        needsMigration = true;
        data.hadTraining = data.tss > 0;
        if (data.tss > 0) {
          data.trainingDuration = Math.round(data.tss / 5);
          data.rpe = 5;
        }
        delete data.tss;
      }
      
      return record;
    });
    
    if (needsMigration) {
      localStorage.setItem('checkInHistory', JSON.stringify(migrated));
      console.log('✅ Migrated', migrated.length, 'check-ins');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Вызвать в App.tsx:
useEffect(() => {
  migrateCheckInData();
}, []);
```

---

### 4. 🔴 БЕЗОПАСНОСТЬ: Токены в localStorage (XSS уязвимость)
**Файл:** `src/contexts/AuthContext.tsx:79`  
**Проблема:** XSS атака может украсть accessToken и refreshToken

**Решение:** Переместить refreshToken в httpOnly cookie

```typescript
// Backend: backend/src/controllers/authController.ts
export const login = async (req: Request, res: Response) => {
  // ... авторизация ...
  
  const tokens = generateTokens({ userId, email, role });
  
  // ✅ refreshToken в httpOnly cookie
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh'
  });
  
  res.json({
    success: true,
    data: {
      user,
      accessToken: tokens.accessToken // Только access в JSON
    }
  });
};

// Frontend: src/contexts/AuthContext.tsx
const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email, password
  }, {
    withCredentials: true // ✅ Разрешить cookies
  });
  
  const { user, accessToken } = response.data.data;
  
  setUser(user);
  localStorage.setItem('zyra_user', JSON.stringify(user));
  localStorage.setItem('zyra_access_token', accessToken);
  // ❌ НЕ сохраняем refreshToken
};
```

---

### 5. 🔴 ПРОИЗВОДИТЕЛЬНОСТЬ: localStorage может переполниться
**Файл:** `hooks/useLocalStorage.ts:25`  
**Проблема:** Нет обработки QuotaExceededError (лимит 5-10MB)

При 1000+ чекинов приложение упадет!

**Решение:**
```typescript
// src/utils/storage.ts
export function safeSetItem(key: string, value: any): boolean {
  try {
    const serialized = JSON.stringify(value);
    
    // Проверка размера (4.5MB безопасный порог)
    if (serialized.length > 4.5 * 1024 * 1024) {
      console.warn('[Storage] Data too large');
      return false;
    }
    
    localStorage.setItem(key, serialized);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('[Storage] Quota exceeded, cleaning...');
      
      // Удалить чекины старше 6 месяцев
      const history = JSON.parse(localStorage.getItem('checkInHistory') || '[]');
      const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
      
      const filtered = history.filter(r => 
        new Date(r.id).getTime() > sixMonthsAgo
      );
      
      localStorage.setItem('checkInHistory', JSON.stringify(filtered));
      
      // Повторная попытка
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

// Обновить useLocalStorage:
useEffect(() => {
  const success = safeSetItem(key, value);
  if (!success) {
    // TODO: Показать toast с ошибкой
  }
}, [key, value]);
```

---

## 📅 PLAN OF ACTION (1-2 недели)

### ⚡ ДЕНЬ 1-2 (КРИТИЧНО - БЕЗОПАСНОСТЬ)
- [ ] **Проверить .env в git:** `git log --all --full-history -- "*/.env"`
- [ ] **Сгенерировать новые секреты** (JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_PASSWORD)
- [ ] **Добавить валидацию пароля** (uppercase, lowercase, number, special char)
- [ ] **Настроить CSP** в helmet
- [ ] **Отдельный rate limiter** для /api/auth (max: 5 вместо 100)

### 🔧 ДЕНЬ 3-5 (ВЫСОКИЙ ПРИОРИТЕТ - ФУНКЦИОНАЛЬНОСТЬ)
- [ ] **Реализовать влияние факторов** на Hooper Index
- [ ] **Создать миграцию** `migrateCheckInData()`
- [ ] **Реализовать** `safeSetItem()` для localStorage
- [ ] **Переместить refreshToken** в httpOnly cookie
- [ ] **Валидация** тренировочных данных (duration 1-600, RPE 0-10)
- [ ] **Добавить импорт Factor** в App.tsx
- [ ] **Исправить типы** quantifiedFactors в types.ts
- [ ] **React Error Boundary**

### 🎨 ДЕНЬ 6-10 (СРЕДНИЙ ПРИОРИТЕТ - UX/ПРОИЗВОДИТЕЛЬНОСТЬ)
- [ ] **Мемоизация** в Dashboard (useMemo для интерпретаций)
- [ ] **Разбить CheckInFlow** на отдельные компоненты
- [ ] **Accessibility:** aria-labels, keyboard navigation
- [ ] **Иконки** для цветовых индикаторов (дальтоники)
- [ ] **Error states:** toast уведомления
- [ ] **Консолидировать папки:** переместить всё в /src
- [ ] **Health check с БД** проверкой

### 🚀 ДЕНЬ 11-14 (НИЗКИЙ ПРИОРИТЕТ - POLISH)
- [ ] **Динамический импорт** recharts (lazy loading)
- [ ] **Виртуализация** списков (react-window)
- [ ] **Loading states** и skeleton screens
- [ ] **Анимации переходов** (framer-motion)
- [ ] **GitHub Actions** CI/CD
- [ ] **Sentry** для мониторинга ошибок
- [ ] **Swagger/OpenAPI** документация

---

## 📂 СТРУКТУРА ОТЧЁТА

Полный аудит разделен на 2 файла:

1. **`audit.md`** (этот файл) — Executive Summary и Top-5 проблем
2. **`audit-part2.md`** — Детальный анализ по 8 категориям:
   - Архитектура и структура
   - Безопасность
   - Производительность
   - Качество кода
   - Функциональность
   - UX/UI
   - Deployment
   - Зависимости

---

## 🎯 БЫСТРЫЙ СТАРТ

**Что делать прямо сейчас (30 минут):**

1. **Проверить git-историю:**
```bash
cd /Users/macbookpro/Coding/zyra
git log --all --full-history -- "*/.env"
```

2. **Если .env найден** — следовать инструкциям выше для удаления из истории

3. **Сгенерировать новые секреты:**
```bash
# Запустить 3 раза:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. **Обновить backend/.env:**
```bash
JWT_SECRET=<новый-ключ-128-символов>
JWT_REFRESH_SECRET=<другой-ключ-128-символов>
ADMIN_PASSWORD=<сложный-пароль-20+символов>
```

5. **Добавить импорт Factor в App.tsx:**
```typescript
import { View, CheckInRecord, Factor } from './types';
```

6. **Создать Error Boundary** (код в audit-part2.md)

---

## 📞 КОНТАКТЫ

Если есть вопросы по аудиту или нужна помощь с реализацией:
- Создайте GitHub Issue с тегом `audit-followup`
- Используйте чеклист из Plan of Action
- Приоритезируйте критичные проблемы (🔴)

---

**Следующий аудит рекомендован:** После реализации Top-5 критичных проблем (через 1-2 недели)

**Дата завершения аудита:** 19 октября 2025
