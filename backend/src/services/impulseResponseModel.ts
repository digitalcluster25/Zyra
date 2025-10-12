/**
 * Импульсно-откликовая модель Банистера для системы Zyra 3.0
 * 
 * Научное обоснование:
 * - Базируется на модели Fitness-Fatigue Банистера (1975, 1991)
 * - Обобщена для всех факторов тренировок и образа жизни
 * - Каждый фактор генерирует положительный и отрицательный остаточные эффекты
 * - Эффекты затухают экспоненциально с разными временными константами
 * 
 * Ключевая формула:
 * Effect(t) = Σ k · Impulse(s) · e^(-(t-s)/τ)
 * Wellness(t) = Baseline + Σ PositiveEffects(t) - Σ NegativeEffects(t)
 */

export interface ImpulseParams {
  k_positive: number;     // Коэффициент усиления положительного эффекта
  tau_positive: number;   // Временная константа положительного эффекта (дни)
  k_negative: number;     // Коэффициент усиления отрицательного эффекта
  tau_negative: number;   // Временная константа отрицательного эффекта (дни)
}

export interface Impulse {
  timestamp: Date;
  magnitude: number;      // Величина импульса (sRPE, количество, продолжительность)
  factorId: string;
  factorName?: string;
  params: ImpulseParams;
  metadata?: {
    duration?: number;
    intensity?: number;
    quantity?: number;
  };
}

export interface WellnessResult {
  wellness: number;               // Итоговый wellness score (0-100)
  positiveEffects: number;        // Сумма всех положительных остаточных эффектов
  negativeEffects: number;        // Сумма всех отрицательных остаточных эффектов
  breakdown: FactorContribution[];
}

export interface FactorContribution {
  factorId: string;
  factorName?: string;
  positive: number;    // Вклад положительного эффекта
  negative: number;    // Вклад отрицательного эффекта
  netEffect: number;   // Чистый эффект (positive - negative)
}

/**
 * Рассчитывает остаточный эффект одного импульса в момент времени t
 * 
 * Формула: Effect = k · magnitude · e^(-Δt/τ)
 * где Δt = (t - t_impulse) в днях
 */
export function calculateResidualEffect(
  impulse: Impulse,
  currentTime: Date,
  effectType: 'positive' | 'negative'
): number {
  const daysPassed = (currentTime.getTime() - impulse.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  
  // Эффект не может быть в будущем
  if (daysPassed < 0) return 0;
  
  const k = effectType === 'positive' ? impulse.params.k_positive : impulse.params.k_negative;
  const tau = effectType === 'positive' ? impulse.params.tau_positive : impulse.params.tau_negative;
  
  // Если k или τ равны 0, эффекта нет
  if (k === 0 || tau === 0) return 0;
  
  // Экспоненциальное затухание
  return k * impulse.magnitude * Math.exp(-daysPassed / tau);
}

/**
 * Рассчитывает динамический wellness score с учетом всех исторических импульсов
 * 
 * @param impulseHistory - Массив всех импульсов пользователя
 * @param currentTime - Момент времени для расчета
 * @param baseline - Базовый уровень wellness (по умолчанию 100)
 * @returns Детализированный результат с декомпозицией по факторам
 */
export function calculateDynamicWellness(
  impulseHistory: Impulse[],
  currentTime: Date,
  baseline: number = 100
): WellnessResult {
  let totalPositive = 0;
  let totalNegative = 0;
  
  // Map для агрегации эффектов по факторам
  const breakdown = new Map<string, { positive: number; negative: number; name?: string }>();
  
  // Суммируем остаточные эффекты всех импульсов
  for (const impulse of impulseHistory) {
    const positive = calculateResidualEffect(impulse, currentTime, 'positive');
    const negative = calculateResidualEffect(impulse, currentTime, 'negative');
    
    totalPositive += positive;
    totalNegative += negative;
    
    // Агрегируем по factorId
    if (!breakdown.has(impulse.factorId)) {
      breakdown.set(impulse.factorId, { positive: 0, negative: 0, name: impulse.factorName });
    }
    const entry = breakdown.get(impulse.factorId)!;
    entry.positive += positive;
    entry.negative += negative;
  }
  
  // Рассчитываем итоговый wellness (ограничиваем 0-100)
  const wellness = Math.max(0, Math.min(100, baseline + totalPositive - totalNegative));
  
  // Конвертируем breakdown в массив
  const breakdownArray: FactorContribution[] = Array.from(breakdown.entries()).map(([factorId, effects]) => ({
    factorId,
    factorName: effects.name,
    positive: effects.positive,
    negative: effects.negative,
    netEffect: effects.positive - effects.negative,
  }));
  
  // Сортируем по абсолютному влиянию (чтобы самые значимые были сверху)
  breakdownArray.sort((a, b) => Math.abs(b.netEffect) - Math.abs(a.netEffect));
  
  return {
    wellness,
    positiveEffects: totalPositive,
    negativeEffects: totalNegative,
    breakdown: breakdownArray,
  };
}

/**
 * Конвертирует старые данные чекина в импульсы для обратной совместимости
 * 
 * @param checkIn - Legacy чекин из БД
 * @param factors - Список всех факторов с параметрами
 * @returns Массив импульсов
 */
export function convertLegacyCheckInToImpulses(
  checkIn: any,
  factors: any[]
): Impulse[] {
  const impulses: Impulse[] = [];
  const checkInDate = new Date(checkIn.created_at);
  
  // 1. Тренировочный импульс (sRPE = duration × RPE)
  if (checkIn.check_in_data?.hadTraining && 
      checkIn.check_in_data?.trainingDuration && 
      checkIn.check_in_data?.rpe !== undefined) {
    
    const sRPE = checkIn.check_in_data.trainingDuration * checkIn.check_in_data.rpe;
    
    impulses.push({
      timestamp: checkInDate,
      magnitude: sRPE,
      factorId: 'training',
      factorName: 'Тренировка',
      params: {
        k_positive: 1.0,   // Генерирует адаптацию/фитнес
        tau_positive: 42.0, // Фитнес затухает медленно (~6 недель)
        k_negative: 1.5,   // Генерирует усталость (больше в краткосрочной)
        tau_negative: 7.0,  // Усталость затухает быстро (~1 неделя)
      },
      metadata: {
        duration: checkIn.check_in_data.trainingDuration,
        intensity: checkIn.check_in_data.rpe,
      },
    });
  }
  
  // 2. Факторы образа жизни
  const selectedFactorNames = checkIn.check_in_data?.factors || [];
  
  for (const factorName of selectedFactorNames) {
    const factor = factors.find(f => f.name === factorName);
    if (!factor) continue;
    
    // Legacy data: используем бинарное присутствие как magnitude = 1.0
    // В новой версии это будет количественная мера
    impulses.push({
      timestamp: checkInDate,
      magnitude: 1.0,
      factorId: factor.id,
      factorName: factor.name,
      params: {
        // Конвертируем старые weight/tau в новую модель
        k_positive: Math.max(0, factor.weight || factor.default_k_positive || 0),
        tau_positive: (factor.tau || factor.default_tau_positive || 42) * 24, // часы → дни
        k_negative: Math.max(0, -(factor.weight || 0)) || factor.default_k_negative || 0,
        tau_negative: ((factor.tau || factor.default_tau_negative || 7) * 24) / 3, // быстрее затухает
      },
    });
  }
  
  return impulses;
}

/**
 * Прогнозирует wellness на N дней вперед
 * 
 * @param impulseHistory - История импульсов
 * @param fromDate - Дата начала прогноза
 * @param days - Количество дней для прогноза
 * @returns Массив прогнозных значений wellness по дням
 */
export function forecastWellness(
  impulseHistory: Impulse[],
  fromDate: Date,
  days: number
): { date: Date; wellness: number; confidence: number }[] {
  const forecast = [];
  
  for (let i = 0; i < days; i++) {
    const futureDate = new Date(fromDate);
    futureDate.setDate(futureDate.getDate() + i);
    
    const result = calculateDynamicWellness(impulseHistory, futureDate);
    
    // Confidence уменьшается с увеличением временного горизонта
    const confidence = Math.max(0, 1 - (i / (days * 2)));
    
    forecast.push({
      date: futureDate,
      wellness: result.wellness,
      confidence,
    });
  }
  
  return forecast;
}

/**
 * Рассчитывает оптимальное время для следующей тренировки
 * на основе текущего баланса фитнеса и усталости
 * 
 * @param impulseHistory - История импульсов
 * @param currentDate - Текущая дата
 * @returns Рекомендация по времени следующей тренировки
 */
export function recommendNextTraining(
  impulseHistory: Impulse[],
  currentDate: Date
): {
  recommendedDate: Date;
  readinessScore: number;
  reasoning: string;
} {
  // Прогнозируем wellness на 7 дней вперед
  const forecast = forecastWellness(impulseHistory, currentDate, 7);
  
  // Ищем день с максимальным wellness (оптимальная готовность)
  let bestDay = forecast[0];
  for (const day of forecast) {
    if (day.wellness > bestDay.wellness) {
      bestDay = day;
    }
  }
  
  let reasoning = '';
  if (bestDay.wellness > 85) {
    reasoning = 'Высокая готовность. Организм хорошо восстановился.';
  } else if (bestDay.wellness > 70) {
    reasoning = 'Средняя готовность. Можно тренироваться, но не на максимум.';
  } else if (bestDay.wellness > 50) {
    reasoning = 'Низкая готовность. Рекомендуется легкая активность или отдых.';
  } else {
    reasoning = 'Очень низкая готовность. Необходим отдых и восстановление.';
  }
  
  return {
    recommendedDate: bestDay.date,
    readinessScore: bestDay.wellness,
    reasoning,
  };
}

