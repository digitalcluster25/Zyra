# План внедрения динамической импульсно-откликовой модели Zyra 3.0

> Переход от статической линейной модели к научно обоснованной системе на базе модели Банистера

## Резюме изменений

### Ключевые проблемы текущей версии (2.0)
1. ❌ Невалидированный опросник (модифицированный индекс Хупера)
2. ❌ Произвольное взвешивание компонентов (0.4/0.4/0.2)
3. ❌ Линейная модель "естественного восстановления" (20% в день)
4. ❌ Статическая атрибуция факторов (фиксированные ±баллы)
5. ❌ Бинарные данные о факторах (Да/Нет)
6. ❌ Отсутствие дозозависимых эффектов
7. ❌ Невозможность моделировать двойственные эффекты (поход = усталость + восстановление)

### Предлагаемое решение (3.0)
1. ✅ Обобщенная импульсно-откликовая модель (Банистер для всех факторов)
2. ✅ Количественные данные (sRPE, продолжительность, количество)
3. ✅ Двухкомпонентные эффекты (положительный + отрицательный с разными τ)
4. ✅ Персонализация через ML (калибровка k и τ по данным)
5. ✅ Интеграция объективных данных (ВСР, ЧСС покоя)

---

## Фаза 1: Обновление структуры данных и БД (1-2 дня)

### 1.1. Новая схема БД для количественных факторов

**Миграция: `006_add_quantified_factors.sql`**
```sql
-- Добавляем поля для количественных данных в checkin_factors
ALTER TABLE checkin_factors ADD COLUMN quantity FLOAT;
ALTER TABLE checkin_factors ADD COLUMN duration_minutes INT;
ALTER TABLE checkin_factors ADD COLUMN intensity_rpe FLOAT CHECK (intensity_rpe >= 0 AND intensity_rpe <= 10);
ALTER TABLE checkin_factors ADD COLUMN notes TEXT;

-- Таблица для параметров импульсно-откликовой модели
CREATE TABLE factor_impulse_params (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  factor_id UUID REFERENCES factors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Положительный эффект (фитнес/восстановление)
  k_positive FLOAT NOT NULL DEFAULT 1.0,
  tau_positive FLOAT NOT NULL DEFAULT 42.0,
  
  -- Отрицательный эффект (усталость/стресс)
  k_negative FLOAT NOT NULL DEFAULT 1.0,
  tau_negative FLOAT NOT NULL DEFAULT 7.0,
  
  -- Метаданные
  is_personalized BOOLEAN DEFAULT FALSE,
  calibration_samples INT DEFAULT 0,
  last_calibrated_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(factor_id, user_id)
);

-- Индексы
CREATE INDEX idx_factor_impulse_params_user ON factor_impulse_params(user_id);
CREATE INDEX idx_factor_impulse_params_factor ON factor_impulse_params(factor_id);
```

### 1.2. Обновление модели факторов

**Новые поля в `factors` таблице:**
```sql
ALTER TABLE factors ADD COLUMN factor_type VARCHAR(50) DEFAULT 'lifestyle';
-- Types: 'training', 'lifestyle_positive', 'lifestyle_negative', 'dual_nature'

ALTER TABLE factors ADD COLUMN requires_quantity BOOLEAN DEFAULT FALSE;
ALTER TABLE factors ADD COLUMN requires_duration BOOLEAN DEFAULT FALSE;
ALTER TABLE factors ADD COLUMN requires_intensity BOOLEAN DEFAULT FALSE;

-- Дефолтные параметры популяции
ALTER TABLE factors ADD COLUMN default_k_positive FLOAT DEFAULT 0.0;
ALTER TABLE factors ADD COLUMN default_tau_positive FLOAT DEFAULT 42.0;
ALTER TABLE factors ADD COLUMN default_k_negative FLOAT DEFAULT 0.0;
ALTER TABLE factors ADD COLUMN default_tau_negative FLOAT DEFAULT 7.0;
```

---

## Фаза 2: Реализация математического ядра (2-3 дня)

### 2.1. Новый сервис расчетов

**Файл: `backend/src/services/impulseResponseModel.ts`**

```typescript
/**
 * Импульсно-откликовая модель Банистера для всех факторов
 * 
 * Базовая формула:
 * Effect(t) = Σ k · Impulse(s) · e^(-(t-s)/τ)
 * 
 * Wellness(t) = Baseline + Σ Positive_Effects(t) - Σ Negative_Effects(t)
 */

interface ImpulseParams {
  k_positive: number;
  tau_positive: number;  // дни
  k_negative: number;
  tau_negative: number;  // дни
}

interface Impulse {
  timestamp: Date;
  magnitude: number;  // sRPE или количество
  factorId: string;
  params: ImpulseParams;
}

/**
 * Рассчитывает остаточный эффект одного импульса в момент t
 */
function calculateResidualEffect(
  impulse: Impulse,
  currentTime: Date,
  effectType: 'positive' | 'negative'
): number {
  const daysPassed = (currentTime.getTime() - impulse.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysPassed < 0) return 0;
  
  const k = effectType === 'positive' ? impulse.params.k_positive : impulse.params.k_negative;
  const tau = effectType === 'positive' ? impulse.params.tau_positive : impulse.params.tau_negative;
  
  return k * impulse.magnitude * Math.exp(-daysPassed / tau);
}

/**
 * Рассчитывает общий wellness score с учетом всех исторических импульсов
 */
export function calculateDynamicWellness(
  impulseHistory: Impulse[],
  currentTime: Date,
  baseline: number = 100
): {
  wellness: number;
  positiveEffects: number;
  negativeEffects: number;
  breakdown: { factorId: string; positive: number; negative: number }[];
} {
  let totalPositive = 0;
  let totalNegative = 0;
  const breakdown: Map<string, { positive: number; negative: number }> = new Map();
  
  for (const impulse of impulseHistory) {
    const positive = calculateResidualEffect(impulse, currentTime, 'positive');
    const negative = calculateResidualEffect(impulse, currentTime, 'negative');
    
    totalPositive += positive;
    totalNegative += negative;
    
    if (!breakdown.has(impulse.factorId)) {
      breakdown.set(impulse.factorId, { positive: 0, negative: 0 });
    }
    const entry = breakdown.get(impulse.factorId)!;
    entry.positive += positive;
    entry.negative += negative;
  }
  
  const wellness = baseline + totalPositive - totalNegative;
  
  return {
    wellness: Math.max(0, Math.min(100, wellness)),
    positiveEffects: totalPositive,
    negativeEffects: totalNegative,
    breakdown: Array.from(breakdown.entries()).map(([factorId, effects]) => ({
      factorId,
      ...effects,
    })),
  };
}

/**
 * Конвертирует старые данные в импульсы
 */
export function convertLegacyCheckInToImpulses(
  checkIn: any,
  factors: any[]
): Impulse[] {
  const impulses: Impulse[] = [];
  
  // Тренировка → sRPE импульс
  if (checkIn.data.hadTraining && checkIn.data.trainingDuration && checkIn.data.rpe) {
    const sRPE = checkIn.data.trainingDuration * checkIn.data.rpe;
    impulses.push({
      timestamp: new Date(checkIn.id),
      magnitude: sRPE,
      factorId: 'training',
      params: {
        k_positive: 1.0,   // Адаптация/фитнес
        tau_positive: 42.0,
        k_negative: 1.5,   // Усталость
        tau_negative: 7.0,
      },
    });
  }
  
  // Факторы образа жизни
  for (const factorName of checkIn.data.factors || []) {
    const factor = factors.find(f => f.name === factorName);
    if (!factor) continue;
    
    impulses.push({
      timestamp: new Date(checkIn.id),
      magnitude: 1.0,  // Бинарное присутствие (legacy)
      factorId: factor.id,
      params: {
        k_positive: Math.max(0, factor.weight),
        tau_positive: factor.tau * 24,  // часы → дни
        k_negative: Math.max(0, -factor.weight),
        tau_negative: factor.tau * 24 / 3,  // быстрее затухает
      },
    });
  }
  
  return impulses;
}
```

### 2.2. Новый endpoint для детального анализа

**Файл: `backend/src/controllers/analyticsController.ts`**

```typescript
import { calculateDynamicWellness, convertLegacyCheckInToImpulses } from '../services/impulseResponseModel';

export const getDetailedAnalytics = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  
  // Получаем все чекины пользователя
  const checkIns = await CheckIn.findByUserId(userId);
  const factors = await Factor.findAll();
  
  // Конвертируем в импульсы
  const impulses = checkIns.flatMap(checkIn => 
    convertLegacyCheckInToImpulses(checkIn, factors)
  );
  
  // Рассчитываем wellness для каждого дня
  const timeline = [];
  const startDate = checkIns.length > 0 ? new Date(checkIns[checkIns.length - 1].id) : new Date();
  const endDate = new Date();
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const result = calculateDynamicWellness(impulses, new Date(d));
    timeline.push({
      date: new Date(d).toISOString(),
      ...result,
    });
  }
  
  res.json({
    success: true,
    data: {
      timeline,
      totalImpulses: impulses.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    },
  });
};
```

---

## Фаза 3: Обновление сбора данных (Frontend) (2 дня)

### 3.1. Новые компоненты для количественного ввода

**Файл: `components/QuantifiedFactorInput.tsx`**

```typescript
interface QuantifiedFactorInputProps {
  factor: Factor;
  value: {
    quantity?: number;
    duration?: number;
    intensity?: number;
  };
  onChange: (value: any) => void;
}

export const QuantifiedFactorInput: React.FC<QuantifiedFactorInputProps> = ({
  factor,
  value,
  onChange,
}) => {
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-2">{factor.name}</h4>
      
      {factor.requires_quantity && (
        <div className="mb-2">
          <Label>Количество</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={value.quantity || ''}
            onChange={(e) => onChange({ ...value, quantity: parseFloat(e.target.value) })}
            placeholder={factor.key === 'alcohol' ? 'Стандартных порций' : 'Количество'}
          />
        </div>
      )}
      
      {factor.requires_duration && (
        <div className="mb-2">
          <Label>Продолжительность (минут)</Label>
          <Input
            type="number"
            min="1"
            value={value.duration || ''}
            onChange={(e) => onChange({ ...value, duration: parseInt(e.target.value) })}
          />
        </div>
      )}
      
      {factor.requires_intensity && (
        <div className="mb-2">
          <Label>Интенсивность (RPE 0-10)</Label>
          <Input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={value.intensity || ''}
            onChange={(e) => onChange({ ...value, intensity: parseFloat(e.target.value) })}
          />
          <p className="text-xs text-slate-500 mt-1">
            0 = очень легко, 10 = максимальное усилие
          </p>
        </div>
      )}
    </Card>
  );
};
```

### 3.2. Обновление CheckInFlow

Заменить шаг 11 (Факторы):
- Вместо кнопок Да/Нет показывать `QuantifiedFactorInput`
- Для тренировок: Duration × RPE = sRPE
- Для "Времени на природе": добавить продолжительность + опционально интенсивность

---

## Фаза 4: Персонализация через ML (3-5 дней)

### 4.1. Алгоритм калибровки параметров

**Файл: `backend/src/services/personalization.ts`**

```typescript
/**
 * Калибрует параметры импульсно-откликовой модели для конкретного пользователя
 * Использует нелинейную регрессию для минимизации ошибки между предсказанным
 * и реальным wellness score
 */
export async function calibrateUserParameters(userId: string) {
  const checkIns = await CheckIn.findByUserId(userId);
  
  // Нужно минимум 90 дней данных
  if (checkIns.length < 90) {
    return { success: false, message: 'Insufficient data for calibration' };
  }
  
  const factors = await Factor.findAll();
  
  // Начальные параметры (популяционные)
  let params = await FactorImpulseParams.findByUserId(userId);
  if (!params.length) {
    params = factors.map(f => ({
      factor_id: f.id,
      user_id: userId,
      k_positive: f.default_k_positive,
      tau_positive: f.default_tau_positive,
      k_negative: f.default_k_negative,
      tau_negative: f.default_tau_negative,
    }));
  }
  
  // Функция потерь: MSE между предсказанным и реальным Hooper Index
  const lossFn = (candidateParams: typeof params) => {
    let totalError = 0;
    
    for (let i = 1; i < checkIns.length; i++) {
      const impulses = convertLegacyCheckInToImpulses(checkIns[i - 1], factors);
      // Применяем candidate params
      impulses.forEach(imp => {
        const param = candidateParams.find(p => p.factor_id === imp.factorId);
        if (param) imp.params = param;
      });
      
      const predicted = calculateDynamicWellness(impulses, new Date(checkIns[i].id));
      const actual = checkIns[i].hooperIndex;
      
      totalError += Math.pow(predicted.wellness - (100 - actual), 2);
    }
    
    return totalError / checkIns.length;
  };
  
  // Используем градиентный спуск или Nelder-Mead для оптимизации
  const optimizedParams = await optimizeParams(params, lossFn);
  
  // Сохраняем персонализированные параметры
  await FactorImpulseParams.bulkUpsert(optimizedParams);
  
  return { success: true, calibrated: optimizedParams.length };
}
```

---

## Фаза 5: Новая аналитика и визуализация (2 дня)

### 5.1. Компонент декомпозиции wellness

**Файл: `components/WellnessDecomposition.tsx`**

```typescript
/**
 * Показывает вклад каждого фактора в текущий wellness score
 * Разделяет на положительные и отрицательные компоненты
 */
export const WellnessDecomposition: React.FC = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    api.get('/api/analytics/detailed').then(res => setData(res.data.data));
  }, []);
  
  if (!data) return <div>Загрузка...</div>;
  
  const latestDay = data.timeline[data.timeline.length - 1];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Декомпозиция Wellness Score</CardTitle>
        <CardDescription>
          Текущий: {latestDay.wellness.toFixed(1)} / 100
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Положительные эффекты */}
          <div>
            <h4 className="font-semibold text-green-700 mb-2">
              ✓ Положительные эффекты (+{latestDay.positiveEffects.toFixed(1)})
            </h4>
            {latestDay.breakdown
              .filter(b => b.positive > 0.1)
              .sort((a, b) => b.positive - a.positive)
              .map(item => (
                <div key={item.factorId} className="flex justify-between py-1">
                  <span>{item.factorId}</span>
                  <span className="text-green-600 font-medium">
                    +{item.positive.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
          
          {/* Отрицательные эффекты */}
          <div>
            <h4 className="font-semibold text-red-700 mb-2">
              ✗ Отрицательные эффекты (-{latestDay.negativeEffects.toFixed(1)})
            </h4>
            {latestDay.breakdown
              .filter(b => b.negative > 0.1)
              .sort((a, b) => b.negative - a.negative)
              .map(item => (
                <div key={item.factorId} className="flex justify-between py-1">
                  <span>{item.factorId}</span>
                  <span className="text-red-600 font-medium">
                    -{item.negative.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## План выполнения (Timeline)

### Неделя 1
- ✅ День 1-2: Фаза 1 (БД миграции)
- ✅ День 3-5: Фаза 2 (Математическое ядро)

### Неделя 2
- ✅ День 6-7: Фаза 3 (Frontend обновления)
- ✅ День 8-10: Фаза 4 начало (ML калибровка)

### Неделя 3
- ✅ День 11-12: Фаза 4 завершение
- ✅ День 13-14: Фаза 5 (Визуализация)
- ✅ День 15: Тестирование и документация

---

## Критерии успеха

### Технические
1. ✅ Импульсно-откликовая модель реализована
2. ✅ Количественный ввод работает для всех факторов
3. ✅ Персонализация калибрует параметры с MSE < 5.0
4. ✅ API endpoint возвращает детальную декомпозицию
5. ✅ Обратная совместимость с legacy данными

### Научные
1. ✅ Модель корректно обрабатывает двойственные эффекты (поход)
2. ✅ Дозозависимые эффекты учитываются
3. ✅ Временные константы соответствуют литературе (τ_fitness ≈ 42д, τ_fatigue ≈ 7д)

### UX
1. ✅ Пользователь видит понятное объяснение вкладов факторов
2. ✅ Форма ввода интуитивна для количественных данных
3. ✅ Существующие пользователи могут продолжать без потери данных

---

## Начало реализации

Готов начать с:
1. **Миграция 006** - расширение БД
2. **impulseResponseModel.ts** - математическое ядро
3. **Обновление seed** - новые дефолтные параметры для факторов

Продолжить?

