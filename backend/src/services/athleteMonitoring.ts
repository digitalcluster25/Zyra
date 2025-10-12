/**
 * Служба мониторинга атлетов
 * 
 * Реализует научно-обоснованные методологии:
 * 1. Индекс Хупера (Hooper Index)
 * 2. Метод sRPE (session Rating of Perceived Exertion)
 * 3. Модель Банистера (Fitness-Fatigue Model): CTL, ATL, TSB
 */

export class AthleteMonitoringService {
  // Константы времени для модели Банистера
  static readonly TAU_CHRONIC = 42; // дней (долгосрочная адаптация)
  static readonly TAU_ACUTE = 7;    // дней (краткосрочная усталость)
  
  /**
   * Расчет Индекса Хупера
   * Простая сумма 5 метрик (без весов)
   * Диапазон: 5 (идеально) - 35 (критично)
   */
  static calculateHooperIndex(
    sleepQuality: number,
    fatigue: number,
    muscleSoreness: number,
    stress: number,
    mood: number
  ): number {
    return sleepQuality + fatigue + muscleSoreness + stress + mood;
  }
  
  /**
   * Расчет Training Load по методу sRPE
   * TL = Длительность (мин) × RPE (0-10)
   */
  static calculateTrainingLoad(duration: number, rpe: number): number {
    if (!duration || !rpe) return 0;
    return duration * rpe;
  }
  
  /**
   * Расчет Chronic Training Load (CTL) - "Фитнес"
   * Экспоненциально взвешенное скользящее среднее с tau = 42 дня
   */
  static calculateCTL(
    previousCTL: number,
    dailyLoad: number,
    tau: number = AthleteMonitoringService.TAU_CHRONIC
  ): number {
    const decay = Math.exp(-1 / tau);
    return previousCTL * decay + dailyLoad * (1 - decay);
  }
  
  /**
   * Расчет Acute Training Load (ATL) - "Усталость"
   * Экспоненциально взвешенное скользящее среднее с tau = 7 дней
   */
  static calculateATL(
    previousATL: number,
    dailyLoad: number,
    tau: number = AthleteMonitoringService.TAU_ACUTE
  ): number {
    const decay = Math.exp(-1 / tau);
    return previousATL * decay + dailyLoad * (1 - decay);
  }
  
  /**
   * Расчет Training Stress Balance (TSB) - "Форма" / Готовность
   * TSB = CTL - ATL
   */
  static calculateTSB(ctl: number, atl: number): number {
    return ctl - atl;
  }
}

