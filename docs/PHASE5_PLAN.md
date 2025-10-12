# Фаза 5: Количественный ввод данных в CheckInFlow

## Цель

Заменить бинарный ввод факторов (Да/Нет) на **количественный** для получения более точных данных, которые используются импульсно-откликовой моделью.

---

## Текущая проблема

### Сейчас (Zyra 3.0 MVP):
```typescript
// Шаг 11: Факторы
<Button onClick={() => toggleFactor("Недосып")}>
  Недосып {selected ? "✓" : ""}
</Button>
```

**Проблемы:**
1. ❌ Нет информации о дозе (1 бокал алкоголя = 10 бокалов)
2. ❌ Нет продолжительности (10 минут медитации = 60 минут)
3. ❌ Нет интенсивности (лёгкая прогулка = тяжёлый поход)
4. ❌ Импульсно-откликовая модель использует magnitude = 1.0 для всех

### После Фазы 5:
```typescript
// Для алкоголя
<Input type="number" placeholder="Количество порций" />

// Для медитации
<Input type="number" placeholder="Продолжительность (мин)" />

// Для похода
<Input type="number" placeholder="Продолжительность (мин)" />
<Input type="number" min="0" max="10" placeholder="Интенсивность RPE" />
```

**Результат:**
- ✅ Точная доза → модель рассчитает правильный эффект
- ✅ Продолжительность → учёт времени воздействия
- ✅ Интенсивность → дифференциация лёгких/тяжёлых активностей

---

## Что будет изменено

### 1. Обновление CheckInFlow.tsx (Шаг 11)

**Текущий код:**
```typescript
// Шаг 11: Факторы
case 11:
  return (
    <div>
      <h2>Внешние факторы</h2>
      <div className="flex flex-wrap gap-3">
        {factors.filter(f => f.active !== false).map(factor => (
          <Button
            key={factor.id}
            onClick={() => toggleFactorSelection(factor.name)}
            variant={data.factors.includes(factor.name) ? "default" : "outline"}
          >
            {factor.name}
          </Button>
        ))}
      </div>
    </div>
  );
```

**Новый код:**
```typescript
// Шаг 11: Факторы (с количественным вводом)
case 11:
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Факторы образа жизни</h2>
      <p className="text-slate-500 mb-6">
        Выберите факторы и укажите детали (если применимо)
      </p>
      
      <div className="space-y-4">
        {factors.filter(f => f.active !== false).map(factor => (
          <QuantifiedFactorCard
            key={factor.id}
            factor={factor}
            isSelected={!!quantifiedFactors[factor.id]}
            value={quantifiedFactors[factor.id]}
            onChange={(value) => handleQuantifiedFactorChange(factor.id, value)}
          />
        ))}
      </div>
    </div>
  );
```

### 2. Новый компонент: QuantifiedFactorCard

**Файл:** `components/QuantifiedFactorCard.tsx`

```typescript
import React from 'react';
import { Factor } from '../types';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface QuantifiedFactorCardProps {
  factor: Factor;
  isSelected: boolean;
  value?: {
    quantity?: number;
    duration?: number;
    intensity?: number;
  };
  onChange: (value: any) => void;
}

export const QuantifiedFactorCard: React.FC<QuantifiedFactorCardProps> = ({
  factor,
  isSelected,
  value = {},
  onChange,
}) => {
  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({ quantity: 1, duration: 30, intensity: 5 }); // Дефолты
    } else {
      onChange(null);
    }
  };

  return (
    <Card className={`transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : ''}`}>
      <CardContent className="p-4">
        {/* Header с Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Switch
              checked={isSelected}
              onCheckedChange={handleToggle}
            />
            <div>
              <h4 className="font-semibold text-slate-800">{factor.name}</h4>
              <p className="text-xs text-slate-500">{getFactorTypeLabel(factor.factor_type)}</p>
            </div>
          </div>
          {isSelected && (
            <span className="text-xs text-blue-600 font-medium">Активен</span>
          )}
        </div>

        {/* Количественные поля (если фактор выбран) */}
        {isSelected && (
          <div className="space-y-3 pl-11 animate-in fade-in duration-200">
            {factor.requires_quantity && (
              <div>
                <Label className="text-sm">
                  {getQuantityLabel(factor.key)}
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={value.quantity || ''}
                  onChange={(e) => onChange({ ...value, quantity: parseFloat(e.target.value) })}
                  placeholder={getQuantityPlaceholder(factor.key)}
                  className="mt-1"
                />
                <p className="text-xs text-slate-400 mt-1">{getQuantityHint(factor.key)}</p>
              </div>
            )}

            {factor.requires_duration && (
              <div>
                <Label className="text-sm">Продолжительность (минут)</Label>
                <Input
                  type="number"
                  min="1"
                  max="720"
                  value={value.duration || ''}
                  onChange={(e) => onChange({ ...value, duration: parseInt(e.target.value) })}
                  placeholder="30"
                  className="mt-1"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Как долго длился фактор
                </p>
              </div>
            )}

            {factor.requires_intensity && (
              <div>
                <Label className="text-sm">Интенсивность (RPE 0-10)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={value.intensity || ''}
                    onChange={(e) => onChange({ ...value, intensity: parseFloat(e.target.value) })}
                    placeholder="5"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {getRPELabel(value.intensity || 5)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  0 = очень легко, 10 = максимум
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Вспомогательные функции
function getFactorTypeLabel(type: string): string {
  const labels = {
    'lifestyle_positive': '✓ Положительный фактор',
    'lifestyle_negative': '✗ Отрицательный фактор',
    'dual_nature': '⚖️ Двойственный эффект',
  };
  return labels[type] || 'Фактор';
}

function getQuantityLabel(factorKey: string): string {
  if (factorKey === 'alcohol') return 'Количество порций';
  if (factorKey === 'caffeine_late') return 'Количество чашек';
  return 'Количество';
}

function getQuantityPlaceholder(factorKey: string): string {
  if (factorKey === 'alcohol') return '1, 2, 3...';
  if (factorKey === 'caffeine_late') return '1, 2, 3...';
  return '1';
}

function getQuantityHint(factorKey: string): string {
  if (factorKey === 'alcohol') return '1 порция = 150мл вина / 350мл пива / 40мл крепкого';
  if (factorKey === 'caffeine_late') return 'После 16:00';
  return '';
}

function getRPELabel(intensity: number): string {
  if (intensity <= 2) return 'Очень легко';
  if (intensity <= 4) return 'Легко';
  if (intensity <= 6) return 'Средне';
  if (intensity <= 8) return 'Тяжело';
  return 'Максимум';
}
```

### 3. Обновление типов и состояния

**types.ts:**
```typescript
export interface QuantifiedFactor {
  factorId: string;
  quantity?: number;      // Для алкоголя, кофеина
  duration?: number;      // В минутах
  intensity?: number;     // RPE 0-10
}

export interface CheckInFormData {
  // ... существующие поля
  quantifiedFactors: Record<string, QuantifiedFactor>; // Новое
}
```

**CheckInFlow.tsx state:**
```typescript
const [data, setData] = useState<CheckInFormData>({
  // ... существующие поля
  quantifiedFactors: {}, // Новое
});

const handleQuantifiedFactorChange = (factorId: string, value: any) => {
  setData(prev => ({
    ...prev,
    quantifiedFactors: {
      ...prev.quantifiedFactors,
      [factorId]: value,
    },
  }));
};
```

### 4. Сохранение в БД

**При создании чекина:**
```typescript
// Backend: checkinController.ts
export const createCheckIn = async (req: AuthRequest, res: Response) => {
  const { checkInData } = req.body;
  const userId = req.user!.id;
  
  // Создаём чекин
  const checkIn = await CheckIn.create({
    user_id: userId,
    check_in_data: checkInData,
    // ... hooper, daily_load, etc.
  });
  
  // Сохраняем количественные данные факторов
  if (checkInData.quantifiedFactors) {
    for (const [factorId, data] of Object.entries(checkInData.quantifiedFactors)) {
      await query(
        `INSERT INTO checkin_factors (checkin_id, factor_id, quantity, duration_minutes, intensity_rpe)
         VALUES ($1, $2, $3, $4, $5)`,
        [checkIn.id, factorId, data.quantity, data.duration, data.intensity]
      );
    }
  }
  
  res.json({ success: true, data: checkIn });
};
```

### 5. Использование в модели

**impulseResponseModel.ts (обновление):**
```typescript
export function convertCheckInToImpulses(
  checkIn: any,
  factors: any[]
): Impulse[] {
  const impulses: Impulse[] = [];
  
  // Обрабатываем количественные факторы
  for (const cf of checkIn.checkin_factors || []) {
    const factor = factors.find(f => f.id === cf.factor_id);
    if (!factor) continue;
    
    // Рассчитываем magnitude на основе данных
    let magnitude = 1.0; // Дефолт
    
    if (cf.duration_minutes && cf.intensity_rpe) {
      // sRPE-подобный подход: duration × intensity
      magnitude = (cf.duration_minutes / 60) * cf.intensity_rpe;
    } else if (cf.quantity) {
      // Прямое количество
      magnitude = cf.quantity;
    } else if (cf.duration_minutes) {
      // Только продолжительность
      magnitude = cf.duration_minutes / 30; // Нормализация к 30 мин
    }
    
    impulses.push({
      timestamp: new Date(checkIn.created_at),
      magnitude,
      factorId: factor.id,
      factorName: factor.name,
      params: {
        k_positive: factor.default_k_positive,
        tau_positive: factor.default_tau_positive,
        k_negative: factor.default_k_negative,
        tau_negative: factor.default_tau_negative,
      },
      metadata: {
        quantity: cf.quantity,
        duration: cf.duration_minutes,
        intensity: cf.intensity_rpe,
      },
    });
  }
  
  return impulses;
}
```

---

## Примеры использования

### Пример 1: Алкоголь

**Ввод:**
- Количество: 3 порции

**Расчёт:**
```typescript
magnitude = 3
k_negative = 2.5
τ_negative = 18 дней

Effect(день 0) = 2.5 × 3 × e^(-0/18) = 7.5
Effect(день 7) = 2.5 × 3 × e^(-7/18) = 5.1
Effect(день 18) = 2.5 × 3 × e^(-18/18) = 2.76
```

### Пример 2: Медитация

**Ввод:**
- Продолжительность: 45 минут

**Расчёт:**
```typescript
magnitude = 45 / 30 = 1.5 (нормализация)
k_positive = 1.8
τ_positive = 16 дней

Effect(день 0) = 1.8 × 1.5 × e^(-0/16) = 2.7
Effect(день 7) = 1.8 × 1.5 × e^(-7/16) = 1.72
Effect(день 16) = 1.8 × 1.5 × e^(-16/16) = 0.99
```

### Пример 3: Поход (двойственный)

**Ввод:**
- Продолжительность: 180 минут
- Интенсивность: 7 RPE

**Расчёт:**
```typescript
magnitude = (180 / 60) × 7 = 21

// Положительный эффект (восстановление)
k_pos = 1.5, τ_pos = 20
Effect_pos(день 0) = 1.5 × 21 × e^(-0/20) = 31.5
Effect_pos(день 7) = 1.5 × 21 × e^(-7/20) = 22.3

// Отрицательный эффект (усталость)
k_neg = 0.8, τ_neg = 6
Effect_neg(день 0) = 0.8 × 21 × e^(-0/6) = 16.8
Effect_neg(день 7) = 0.8 × 21 × e^(-7/6) = 5.1

// Чистый эффект
Net(день 0) = 31.5 - 16.8 = +14.7 (усталость доминирует краткосрочно)
Net(день 7) = 22.3 - 5.1 = +17.2 (восстановление доминирует долгосрочно)
```

---

## Чек-лист реализации

### Frontend
- [ ] Создать `QuantifiedFactorCard.tsx`
- [ ] Обновить `CheckInFlow.tsx` (шаг 11)
- [ ] Добавить типы `QuantifiedFactor`
- [ ] Обновить `onCheckInComplete` для отправки количественных данных
- [ ] Добавить валидацию (мин/макс значения)
- [ ] Стилизация и анимации

### Backend
- [ ] Обновить `checkinController.createCheckIn` для сохранения количественных данных
- [ ] Обновить `impulseResponseModel.convertCheckInToImpulses` для расчёта magnitude
- [ ] Добавить валидацию входных данных (Zod schema)
- [ ] Миграция уже готова (006)

### Тестирование
- [ ] Проверить сохранение количественных данных
- [ ] Проверить расчёт импульсов с разными magnitude
- [ ] Проверить обратную совместимость (старые чекины без количественных данных)
- [ ] UI/UX тестирование на мобильных устройствах

---

## Преимущества Фазы 5

| Аспект | До (MVP) | После (Фаза 5) |
|--------|----------|----------------|
| **Точность** | Низкая (все = 1.0) | Высокая (реальные дозы) |
| **Дифференциация** | Нет (поход = прогулка) | Да (интенсивность) |
| **Научность** | Условная | Полная (дозозависимость) |
| **Персонализация** | Ограничена | Улучшена (больше данных для ML) |
| **UX** | Быстрый ввод | Детальный, но дольше |

---

## Оценка времени

- **Разработка:** 2-3 дня
- **Тестирование:** 1 день
- **Итого:** 3-4 дня

---

## Риски и митигация

### Риск 1: Усложнение UX
**Проблема:** Пользователям потребуется больше времени на чекин

**Митигация:**
- Дефолтные значения (30 мин, 5 RPE)
- Возможность быстрого выбора без детализации (toggle без полей)
- Прогрессивное раскрытие (поля появляются только при активации)

### Риск 2: Неполные данные
**Проблема:** Пользователи могут пропускать количественные поля

**Митигация:**
- Опциональные поля (не required)
- Использование дефолтов при пропуске
- Подсказки и примеры в UI

### Риск 3: Обратная совместимость
**Проблема:** Старые чекины не имеют количественных данных

**Митигация:**
- `convertLegacyCheckInToImpulses()` уже обрабатывает magnitude = 1.0
- Новая логика в `convertCheckInToImpulses()` проверяет наличие данных
- Fallback на дефолтные значения

---

## Готово к старту! 🚀

Все необходимые БД-структуры уже созданы в Миграции 006.
Backend готов принимать количественные данные.
Осталось только создать UI компоненты.

