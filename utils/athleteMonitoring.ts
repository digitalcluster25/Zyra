/**
 * Служба мониторинга атлетов
 * 
 * Реализует научно-обоснованные методологии:
 * 1. Индекс Хупера (Hooper Index)
 * 2. Метод sRPE (session Rating of Perceived Exertion)
 * 3. Модель Банистера (Fitness-Fatigue Model): CTL, ATL, TSB
 */

import { CheckInData, CheckInRecord } from '../types';

export interface HooperInterpretation {
  level: 'excellent' | 'good' | 'moderate' | 'high' | 'critical';
  description: string;
  color: string;
  recommendation: string;
}

export interface TSBInterpretation {
  level: 'fresh' | 'optimal' | 'productive' | 'high' | 'critical';
  description: string;
  color: string;
}

export class AthleteMonitoringService {
  // Константы времени для модели Банистера
  static readonly TAU_CHRONIC = 42; // дней (долгосрочная адаптация)
  static readonly TAU_ACUTE = 7;    // дней (краткосрочная усталость)
  
  /**
   * Расчет Индекса Хупера
   * Простая сумма 5 метрик (без весов)
   * Диапазон: 5 (идеально) - 35 (критично)
   */
  static calculateHooperIndex(data: CheckInData): number {
    return data.sleepQuality + 
           data.fatigue + 
           data.muscleSoreness + 
           data.stress + 
           data.mood;
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
  
  /**
   * Интерпретация Индекса Хупера
   */
  static interpretHooperIndex(hooperIndex: number): HooperInterpretation {
    if (hooperIndex <= 10) {
      return {
        level: 'excellent',
        description: 'Отличное состояние',
        color: 'green',
        recommendation: 'Вы в отличной форме и готовы к интенсивным тренировкам.'
      };
    }
    
    if (hooperIndex <= 15) {
      return {
        level: 'good',
        description: 'Хорошее состояние',
        color: 'green',
        recommendation: 'Состояние хорошее. Можно тренироваться по плану.'
      };
    }
    
    if (hooperIndex <= 20) {
      return {
        level: 'moderate',
        description: 'Умеренное напряжение',
        color: 'yellow',
        recommendation: 'Легкое напряжение. Рассмотрите снижение интенсивности или объема.'
      };
    }
    
    if (hooperIndex <= 25) {
      return {
        level: 'high',
        description: 'Высокая усталость',
        color: 'orange',
        recommendation: 'Высокая усталость. Рекомендуется легкая тренировка или активное восстановление.'
      };
    }
    
    return {
      level: 'critical',
      description: 'Критическое состояние',
      color: 'red',
      recommendation: 'Критическое состояние. Настоятельно рекомендуется полный отдых.'
    };
  }
  
  /**
   * Интерпретация Training Stress Balance (TSB)
   */
  static interpretTSB(tsb: number): TSBInterpretation {
    if (tsb > 5) {
      return {
        level: 'fresh',
        description: 'Свежесть',
        color: 'blue'
      };
    }
    
    if (tsb > -10) {
      return {
        level: 'optimal',
        description: 'Оптимальная нагрузка',
        color: 'green'
      };
    }
    
    if (tsb > -20) {
      return {
        level: 'productive',
        description: 'Продуктивная усталость',
        color: 'yellow'
      };
    }
    
    if (tsb > -30) {
      return {
        level: 'high',
        description: 'Высокая усталость',
        color: 'orange'
      };
    }
    
    return {
      level: 'critical',
      description: 'Риск перетренированности',
      color: 'red'
    };
  }
  
  /**
   * Контекстные рекомендации на основе Индекса Хупера и TSB
   * Согласно ТЗ раздел 2.4.3
   */
  static generateRecommendation(hooperIndex: number, tsb: number): string {
    // Высокий Хупер + высокая усталость по TSB
    if (hooperIndex > 20 && tsb < -20) {
      return 'Ваше самочувствие снижено, что соответствует высокому уровню накопленной тренировочной усталости. ' +
             'Это ожидаемая реакция на интенсивный блок. Уделите внимание восстановлению.';
    }
    
    // Высокий Хупер + низкая нагрузка по TSB (несоответствие)
    if (hooperIndex > 20 && tsb > -10) {
      return 'Вы сообщаете о плохом самочувствии, хотя ваша тренировочная нагрузка была умеренной. ' +
             'Возможно, на ваше восстановление влияют нетренировочные факторы, такие как общий стресс или качество сна.';
    }
    
    // Низкий Хупер + свежесть по TSB (оптимально)
    if (hooperIndex < 10 && tsb > 5) {
      return 'Ваши показатели самочувствия и баланс нагрузки указывают на то, что вы хорошо восстановлены ' +
             'и готовы к продуктивной тренировке.';
    }
    
    // Низкий Хупер + оптимальная нагрузка
    if (hooperIndex < 15 && tsb > -10 && tsb <= 5) {
      return 'Хорошее самочувствие при оптимальной нагрузке. Продолжайте в том же духе!';
    }
    
    // Умеренный Хупер + продуктивная усталость
    if (hooperIndex >= 15 && hooperIndex <= 20 && tsb >= -20 && tsb <= -10) {
      return 'Вы находитесь в зоне продуктивной усталости. Это нормальная часть тренировочного процесса, ' +
             'но следите за самочувствием.';
    }
    
    // Критический Хупер независимо от TSB
    if (hooperIndex > 25) {
      return 'Показатели самочувствия находятся в критической зоне. Настоятельно рекомендуется полный отдых ' +
             'и консультация со специалистом при необходимости.';
    }
    
    // Дефолтная рекомендация
    const hooperInterp = this.interpretHooperIndex(hooperIndex);
    const tsbInterp = this.interpretTSB(tsb);
    
    return `${hooperInterp.description} (Индекс Хупера: ${hooperIndex}). ` +
           `${tsbInterp.description} (TSB: ${tsb.toFixed(1)}). ` +
           `${hooperInterp.recommendation}`;
  }
  
  /**
   * Миграция данных из старого формата в новый
   * Инвертирует шкалы где необходимо
   */
  static migrateLegacyCheckInData(legacyData: any): CheckInData {
    return {
      // Индекс Хупера (инвертируем шкалы)
      sleepQuality: legacyData.sleepQuality ? (8 - legacyData.sleepQuality) : 1,
      fatigue: legacyData.energyLevel ? (8 - legacyData.energyLevel) : 1,
      muscleSoreness: legacyData.muscleSoreness || 1,
      stress: legacyData.stressLevel || 1,
      mood: legacyData.mood ? (8 - legacyData.mood) : 1,
      
      // Дополнительные метрики
      motivation: legacyData.motivation,
      focus: legacyData.focus,
      
      // sRPE (по умолчанию нет тренировки)
      hadTraining: false,
      trainingDuration: undefined,
      rpe: undefined,
      trainingLoad: 0,
      
      // Факторы
      factors: legacyData.factors || [],
      
      // Legacy поля для обратной совместимости
      energyLevel: legacyData.energyLevel,
      stressLevel: legacyData.stressLevel,
      tss: legacyData.tss
    };
  }
  
  /**
   * Создание нового чекина с расчетными показателями
   */
  static createCheckInRecord(
    data: CheckInData,
    previousRecord?: CheckInRecord
  ): CheckInRecord {
    // Расчет Индекса Хупера
    const hooperIndex = this.calculateHooperIndex(data);
    
    // Расчет Training Load
    const dailyLoad = data.hadTraining && data.trainingDuration && data.rpe
      ? this.calculateTrainingLoad(data.trainingDuration, data.rpe)
      : 0;
    
    // Расчет CTL, ATL, TSB
    const previousCTL = previousRecord?.ctl || 0;
    const previousATL = previousRecord?.atl || 0;
    
    const ctl = this.calculateCTL(previousCTL, dailyLoad);
    const atl = this.calculateATL(previousATL, dailyLoad);
    const tsb = this.calculateTSB(ctl, atl);
    
    return {
      id: new Date().toISOString(),
      data,
      hooperIndex,
      dailyLoad,
      ctl,
      atl,
      tsb,
      // Legacy для обратной совместимости
      recoveryScore: this.convertHooperToRecoveryScore(hooperIndex)
    };
  }
  
  /**
   * Конвертация Индекса Хупера в старый Recovery Score (1-7)
   * Для обратной совместимости
   */
  private static convertHooperToRecoveryScore(hooperIndex: number): number {
    // Инвертируем и масштабируем: 5 (лучший Хупер) -> 7 (лучший Recovery Score)
    //                              35 (худший Хупер) -> 1 (худший Recovery Score)
    const normalized = (35 - hooperIndex) / 30; // 0-1
    return Math.max(1, Math.min(7, 1 + normalized * 6));
  }
}

