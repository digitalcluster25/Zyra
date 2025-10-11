# План внедрения научно-обоснованных методологий в ZYRA

**Версия:** 1.0  
**Дата:** 12.10.2025  
**Основа:** Техническое задание MVP системы мониторинга атлетов

---

## 1. Анализ текущего состояния

### Что уже реализовано:
- ✅ Ежедневные чекины с субъективными метриками (8 параметров по 7-балльной шкале)
- ✅ Система факторов восстановления с весами
- ✅ Базовый расчет recovery score
- ✅ Прогноз восстановления на завтра
- ✅ Визуализация динамики и истории
- ✅ Анализ влияния факторов

### Что требуется внедрить согласно ТЗ:
- 🔴 **Индекс Хупера** (Hooper Index) - валидированная методология из 5 вопросов
- 🔴 **Метод sRPE** - учет тренировочной нагрузки (длительность × интенсивность)
- 🔴 **Модель Фитнес-Усталость** (Banister Model) - CTL, ATL, TSB
- 🔴 Интерпретация на основе научных данных

---

## 2. Стратегия внедрения

### Подход: Эволюционное развитие
Вместо полной переделки, интегрируем новые методологии параллельно с существующим функционалом, постепенно заменяя упрощенные расчеты научно-обоснованными.

### Принципы:
1. **Обратная совместимость** - сохранить существующие данные
2. **Постепенная миграция** - пошаговое внедрение модулей
3. **A/B тестирование** - сравнение подходов на реальных данных
4. **Образовательный подход** - объяснение пользователям новых метрик

---

## 3. Фазы внедрения

### Фаза 1: Адаптация модели чекинов под Индекс Хупера
**Срок:** 1-2 недели  
**Приоритет:** Высокий

#### Текущая ситуация:
```
Текущие 8 метрик:
1. Качество сна (1-7)
2. Энергия (1-7)
3. Настроение (1-7)
4. Стресс (1-7, инвертирован)
5. Мотивация (1-7)
6. Концентрация (1-7)
7. Боль в мышцах (1-7, инвертирован)
8. TSS (1-7, инвертирован)
```

#### Индекс Хупера (по ТЗ):
```
5 основных метрик:
1. Качество сна (1-7, где 1=отлично, 7=ужасно)
2. Уровень усталости (1-7, где 1=нет усталости, 7=истощен)
3. Мышечная боль (1-7, где 1=нет боли, 7=сильная боль)
4. Уровень стресса (1-7, где 1=расслаблен, 7=в стрессе)
5. Настроение (1-7, где 1=отличное, 7=плохое)
```

#### Маппинг:
- **Качество сна** → Прямое соответствие (инвертировать шкалу)
- **Энергия** → Маппинг на "Уровень усталости" (инвертировать)
- **Боль в мышцах** → Прямое соответствие (инвертировать шкалу)
- **Стресс** → Прямое соответствие (инвертировать шкалу)
- **Настроение** → Прямое соответствие (инвертировать шкалу)

#### Задачи:
1. **Рефакторинг типов данных**
   - Изменить интерпретацию шкал (1=плохо → 1=хорошо для Хупера)
   - Обновить `types.ts` для поддержки обоих подходов
   
2. **Миграция данных**
   - Создать функцию конвертации старых данных в новый формат
   - Инвертировать шкалы где необходимо

3. **Обновление UI чекина**
   - Изменить подписи шкал согласно методологии Хупера
   - Добавить объяснения для пользователей
   
4. **Новый расчет Индекса Хупера**
   ```typescript
   // Простая сумма 5 метрик (без весов)
   hooperIndex = sleep + fatigue + muscleSoreness + stress + mood
   // Диапазон: 5 (идеально) - 35 (критично)
   ```

5. **Обновить интерпретацию**
   - 5-10: Отличное состояние
   - 11-15: Хорошее состояние
   - 16-20: Умеренное напряжение
   - 21-25: Высокая усталость
   - 26+: Критическое состояние

---

### Фаза 2: Внедрение метода sRPE
**Срок:** 2-3 недели  
**Приоритет:** Высокий

#### Текущая ситуация:
TSS вводится как субъективная оценка (1-7), но не учитывает длительность тренировки.

#### Метод sRPE (по ТЗ):
```
Training Load (TL) = Длительность (мин) × RPE (0-10)
Daily Load = Σ TL всех тренировок за день
```

#### Задачи:
1. **Добавить поле "Длительность тренировки"**
   - Новое поле в чекине: `trainingDuration` (минуты)
   - Опционально, если не было тренировки
   
2. **Обновить шкалу RPE**
   - Текущая: 1-7
   - Новая: 0-10 (шкала Борга CR-10)
   - Добавить текстовые подсказки:
     ```
     0 - Отдых
     1 - Очень легко
     2 - Легко
     3 - Умеренно
     4 - Несколько тяжело
     5 - Тяжело
     6 - 
     7 - Очень тяжело
     8 - Чрезвычайно тяжело
     9 -
     10 - Максимальное усилие
     ```

3. **Обновить UI**
   - Добавить вопрос "Как прошла ваша тренировка?" после основного чекина
   - Если была тренировка:
     - Ввод длительности (мин)
     - Выбор RPE (0-10)
   - Возможность пропустить, если не было тренировки

4. **Расчет Training Load**
   ```typescript
   interface TrainingSession {
     duration: number; // минуты
     rpe: number; // 0-10
   }
   
   function calculateTrainingLoad(session: TrainingSession): number {
     return session.duration * session.rpe;
   }
   
   function calculateDailyLoad(sessions: TrainingSession[]): number {
     return sessions.reduce((sum, s) => sum + calculateTrainingLoad(s), 0);
   }
   ```

5. **Обновить схему данных**
   ```typescript
   interface CheckInData {
     // ... существующие метрики ...
     
     // Новые поля для sRPE
     hadTraining: boolean;
     trainingDuration?: number; // минуты
     rpe?: number; // 0-10
     trainingLoad?: number; // calculated: duration × RPE
   }
   ```

6. **Визуализация**
   - График Daily Training Load по дням
   - Накопительная тренировочная нагрузка за неделю/месяц

---

### Фаза 3: Модель "Фитнес-Усталость" (Banister Model)
**Срок:** 3-4 недели  
**Приоритет:** Средний (требует данных из Фазы 2)

#### Описание:
Динамическое моделирование трех взаимосвязанных показателей:
- **CTL** (Chronic Training Load) - Долгосрочная адаптация / "Фитнес"
- **ATL** (Acute Training Load) - Краткосрочная усталость
- **TSB** (Training Stress Balance) - Баланс / "Форма" / Готовность

#### Формулы (экспоненциально взвешенное скользящее среднее):

```typescript
// Константы времени
const TAU_CHRONIC = 42; // дней (долгосрочная адаптация)
const TAU_ACUTE = 7;    // дней (краткосрочная усталость)

// CTL (Фитнес)
CTL_today = CTL_yesterday * Math.exp(-1/TAU_CHRONIC) + 
            dailyLoad_today * (1 - Math.exp(-1/TAU_CHRONIC))

// ATL (Усталость)
ATL_today = ATL_yesterday * Math.exp(-1/TAU_ACUTE) + 
            dailyLoad_today * (1 - Math.exp(-1/TAU_ACUTE))

// TSB (Форма/Готовность)
TSB_today = CTL_yesterday - ATL_yesterday
```

#### Задачи:
1. **Создать модуль расчета**
   ```typescript
   // utils/banisterModel.ts
   interface BanisterState {
     ctl: number;  // Chronic Training Load
     atl: number;  // Acute Training Load
     tsb: number;  // Training Stress Balance
     date: string;
   }
   
   function calculateBanisterModel(
     previousState: BanisterState,
     dailyLoad: number,
     tauChronic: number = 42,
     tauAcute: number = 7
   ): BanisterState
   ```

2. **Фоновый пересчет**
   - При каждом новом чекине с Training Load → обновить CTL/ATL/TSB
   - Хранить историю всех значений
   
3. **Начальные условия**
   - Для новых пользователей: CTL = 0, ATL = 0, TSB = 0
   - Для существующих: рассчитать на основе истории

4. **Интерпретация TSB**
   ```typescript
   function interpretTSB(tsb: number): string {
     if (tsb > 5) return "Свежесть (риск потери формы)";
     if (tsb > -10) return "Оптимальная нагрузка";
     if (tsb > -20) return "Продуктивная усталость";
     if (tsb > -30) return "Высокая усталость";
     return "Риск перетренированности";
   }
   ```

5. **Визуализация PMC (Performance Management Chart)**
   - График с тремя кривыми: CTL, ATL, TSB
   - Цветовые зоны для TSB (зеленая, желтая, красная)
   - Заменить/дополнить текущий график "Динамика восстановления"

---

### Фаза 4: Интеграция и контекстные рекомендации
**Срок:** 2-3 недели  
**Приоритет:** Средний

#### Задачи:
1. **Умные рекомендации на основе Индекса Хупера + TSB**
   
   Согласно ТЗ (раздел 2.4.3):
   ```typescript
   function generateRecommendation(hooperIndex: number, tsb: number): string {
     if (hooperIndex > 20 && tsb < -20) {
       return "Ваше самочувствие снижено, что соответствует высокому уровню " +
              "накопленной тренировочной усталости. Это ожидаемая реакция на " +
              "интенсивный блок. Уделите внимание восстановлению.";
     }
     
     if (hooperIndex > 20 && tsb > -10) {
       return "Вы сообщаете о плохом самочувствии, хотя ваша тренировочная нагрузка " +
              "была умеренной. Возможно, на ваше восстановление влияют нетренировочные " +
              "факторы, такие как общий стресс или качество сна.";
     }
     
     if (hooperIndex < 10 && tsb > 5) {
       return "Ваши показатели самочувствия и баланс нагрузки указывают на то, что " +
              "вы хорошо восстановлены и готовы к продуктивной тренировке.";
     }
     
     // ... дополнительные правила
   }
   ```

2. **Обновить Dashboard**
   - Добавить блок с Индексом Хупера (вместо/рядом с Recovery Score)
   - Добавить блок с TSB и его интерпретацией
   - Контекстные рекомендации на основе обоих показателей
   
3. **Обновить страницу Аналитика**
   - График PMC (CTL, ATL, TSB)
   - График Индекса Хупера с разбивкой по компонентам
   - График Daily Training Load
   - Корреляция между Хупером и TSB

4. **Цветовые индикаторы**
   - Индекс Хупера:
     - Зеленый: 5-15
     - Желтый: 16-20
     - Красный: 21+
   - TSB:
     - Зеленый: 0 до +10
     - Желтый: -10 до 0, +10 до +20
     - Красный: < -20, > +20

---

### Фаза 5: Режим тренера (будущее)
**Срок:** TBD  
**Приоритет:** Низкий (не для MVP)

Согласно ТЗ, предусмотрен режим тренера:
- Сводная таблица всех спортсменов
- Быстрое выявление зон риска
- Переход к персональным дашбордам

**Требования:**
- Аутентификация и роли
- Связь тренер-спортсмен
- Сводные представления

---

## 4. Технические решения

### 4.1. Миграция данных

```typescript
// utils/dataMigration.ts

interface LegacyCheckIn {
  sleepQuality: number;    // 1-7 (1=хорошо)
  energyLevel: number;     // 1-7 (1=плохо)
  mood: number;            // 1-7 (1=плохо)
  stressLevel: number;     // 1-7 (7=плохо, инвертирован)
  muscleSoreness: number;  // 1-7 (7=плохо, инвертирован)
  tss: number;             // 1-7 (оценка нагрузки)
}

interface HooperCheckIn {
  sleepQuality: number;    // 1-7 (1=отлично, 7=ужасно)
  fatigue: number;         // 1-7 (1=нет, 7=истощен)
  muscleSoreness: number;  // 1-7 (1=нет, 7=сильная)
  stress: number;          // 1-7 (1=расслаблен, 7=стресс)
  mood: number;            // 1-7 (1=отличное, 7=плохое)
}

function migrateLegacyToHooper(legacy: LegacyCheckIn): HooperCheckIn {
  return {
    sleepQuality: 8 - legacy.sleepQuality,      // Инвертировать
    fatigue: 8 - legacy.energyLevel,            // Энергия → Усталость (инвертировать)
    muscleSoreness: legacy.muscleSoreness,      // Уже в правильном формате
    stress: legacy.stressLevel,                 // Уже в правильном формате
    mood: 8 - legacy.mood,                      // Инвертировать
  };
}

function calculateHooperIndex(hooper: HooperCheckIn): number {
  return hooper.sleepQuality + 
         hooper.fatigue + 
         hooper.muscleSoreness + 
         hooper.stress + 
         hooper.mood;
}
```

### 4.2. Обновленная схема типов

```typescript
// types.ts (обновленная версия)

export interface CheckInData {
  // Индекс Хупера (5 основных метрик)
  sleepQuality: number;      // 1-7 (1=отлично, 7=ужасно)
  fatigue: number;           // 1-7 (1=нет усталости, 7=истощен)
  muscleSoreness: number;    // 1-7 (1=нет боли, 7=сильная боль)
  stress: number;            // 1-7 (1=расслаблен, 7=в стрессе)
  mood: number;              // 1-7 (1=отличное, 7=плохое)
  
  // Дополнительные метрики (опционально, для расширенной аналитики)
  motivation?: number;       // 1-7
  focus?: number;            // 1-7
  
  // Метод sRPE
  hadTraining: boolean;
  trainingDuration?: number; // минуты
  rpe?: number;              // 0-10 (шкала Борга)
  trainingLoad?: number;     // calculated: duration × RPE
  
  // Факторы (существующая система)
  factors: string[];
}

export interface CheckInRecord {
  id: string;
  timestamp: number;
  data: CheckInData;
  
  // Расчетные показатели
  hooperIndex: number;       // 5-35
  dailyLoad: number;         // Training Load за день
  
  // Модель Фитнес-Усталость
  ctl: number;               // Chronic Training Load
  atl: number;               // Acute Training Load
  tsb: number;               // Training Stress Balance
}
```

### 4.3. Новый модуль расчетов

```typescript
// utils/athleteMonitoring.ts

export class AthleteMonitoringService {
  // Индекс Хупера
  static calculateHooperIndex(data: CheckInData): number {
    return data.sleepQuality + 
           data.fatigue + 
           data.muscleSoreness + 
           data.stress + 
           data.mood;
  }
  
  // sRPE
  static calculateTrainingLoad(duration: number, rpe: number): number {
    return duration * rpe;
  }
  
  // Модель Банистера
  static calculateCTL(
    previousCTL: number,
    dailyLoad: number,
    tau: number = 42
  ): number {
    const decay = Math.exp(-1 / tau);
    return previousCTL * decay + dailyLoad * (1 - decay);
  }
  
  static calculateATL(
    previousATL: number,
    dailyLoad: number,
    tau: number = 7
  ): number {
    const decay = Math.exp(-1 / tau);
    return previousATL * decay + dailyLoad * (1 - decay);
  }
  
  static calculateTSB(ctl: number, atl: number): number {
    return ctl - atl;
  }
  
  // Интерпретация
  static interpretHooperIndex(hooperIndex: number): {
    level: 'excellent' | 'good' | 'moderate' | 'high' | 'critical';
    description: string;
    color: string;
  } {
    if (hooperIndex <= 10) return {
      level: 'excellent',
      description: 'Отличное состояние',
      color: 'green'
    };
    if (hooperIndex <= 15) return {
      level: 'good',
      description: 'Хорошее состояние',
      color: 'green'
    };
    if (hooperIndex <= 20) return {
      level: 'moderate',
      description: 'Умеренное напряжение',
      color: 'yellow'
    };
    if (hooperIndex <= 25) return {
      level: 'high',
      description: 'Высокая усталость',
      color: 'orange'
    };
    return {
      level: 'critical',
      description: 'Критическое состояние',
      color: 'red'
    };
  }
  
  static interpretTSB(tsb: number): {
    level: string;
    description: string;
    color: string;
  } {
    if (tsb > 5) return {
      level: 'fresh',
      description: 'Свежесть (риск потери формы)',
      color: 'blue'
    };
    if (tsb > -10) return {
      level: 'optimal',
      description: 'Оптимальная нагрузка',
      color: 'green'
    };
    if (tsb > -20) return {
      level: 'productive',
      description: 'Продуктивная усталость',
      color: 'yellow'
    };
    if (tsb > -30) return {
      level: 'high',
      description: 'Высокая усталость',
      color: 'orange'
    };
    return {
      level: 'critical',
      description: 'Риск перетренированности',
      color: 'red'
    };
  }
  
  // Контекстные рекомендации
  static generateRecommendation(hooperIndex: number, tsb: number): string {
    // Реализация логики из ТЗ раздел 2.4.3
    // ...
  }
}
```

---

## 5. Риски и ограничения

### 5.1. Технические риски
- **Миграция данных:** Нужен тщательный тестинг конвертации старых данных
- **Ретроактивный расчет CTL/ATL:** Для существующих пользователей нужно пересчитать историю
- **Производительность:** Расчет CTL/ATL для каждого дня может быть затратным

### 5.2. UX риски
- **Усложнение чекина:** Добавление полей может снизить приверженность
- **Обучение пользователей:** Новые метрики требуют объяснения
- **Эффект ноцебо:** Согласно ТЗ, нужно избегать предписывающего тона

### 5.3. Митигация рисков
1. **Постепенное внедрение:** Новые поля опциональны на первых этапах
2. **Онбординг:** Интерактивное обучение новым концепциям
3. **Мягкие формулировки:** Следовать рекомендациям ТЗ по обратной связи
4. **A/B тестирование:** Сравнение старого и нового подходов

---

## 6. Метрики успеха

### MVP метрики:
- [ ] Индекс Хупера рассчитывается корректно (5-35)
- [ ] Training Load учитывает длительность и RPE
- [ ] CTL, ATL, TSB обновляются автоматически
- [ ] График PMC отображает три кривые
- [ ] Контекстные рекомендации работают согласно правилам

### Пользовательские метрики:
- Уровень приверженности (% заполненных чекинов)
- Время заполнения чекина (не должно увеличиться)
- NPS и качественные отзывы

### Научная валидность:
- Корреляция между Индексом Хупера и TSB
- Предсказательная способность модели
- Сравнение с валидированными исследованиями

---

## 7. Следующие шаги

### Немедленно:
1. ✅ Создать этот план внедрения
2. Согласовать с командой приоритеты и сроки
3. Настроить тестовую среду для миграции данных

### Фаза 1 (следующая неделя):
1. Создать ветку `feature/hooper-index`
2. Обновить `types.ts` с новой схемой данных
3. Реализовать функцию миграции данных
4. Начать рефакторинг компонента CheckInFlow

### Документация:
- Обновить README.md с описанием новых методологий
- Создать SCIENTIFIC_BASIS.md с ссылками на исследования
- Подготовить онбординг материалы для пользователей

---

## 8. Ссылки на исследования (из ТЗ)

1. Hooper, S. L., & Mackinnon, L. T. (1995). Monitoring overtraining in athletes.
2. Borg, G. (1998). Borg's Perceived Exertion and Pain Scales.
3. Foster, C. (1998). Monitoring training in athletes with reference to overtraining syndrome.
4. Banister, E. W. (1991). Modeling elite athletic performance.
5. Wallace, L. K., et al. (2009). The ecological validity and application of the session-RPE method.

---

**Статус документа:** В разработке  
**Ответственный:** Команда ZYRA  
**Следующее обновление:** После завершения Фазы 1

