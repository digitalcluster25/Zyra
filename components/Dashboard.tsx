import React from 'react';
import { CheckInRecord, Factor } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DashboardProps {
  checkInHistory: CheckInRecord[];
  factors: Factor[];
  onStartCheckIn: () => void;
}

const getRecoveryInterpretation = (score: number | null) => {
    if (score === null) return { state: 'Нет данных', recommendation: 'Завершите чекин, чтобы получить оценку.' };
    if (score > 6.0) return { state: 'Отлично', recommendation: 'Можно тренироваться интенсивно.' };
    if (score > 5.0) return { state: 'Хорошее', recommendation: 'Лёгкая или средняя активность.' };
    if (score > 4.0) return { state: 'Умеренное', recommendation: 'Лучше восстановиться.' };
    return { state: 'Переутомление', recommendation: 'Отдых, сон, релаксация.' };
};

const getMetricInterpretation = (value: number | null, isInverted: boolean = false) => {
    if (value === null) return { label: '' };

    if (isInverted) { // Lower is better (e.g., Stress)
        if (value <= 2) return { label: 'Низкий' };
        if (value <= 4) return { label: 'Средний' };
        return { label: 'Высокий' };
    } else { // Higher is better
        if (value >= 6) return { label: 'Отличное' };
        if (value >= 4) return { label: 'Хорошее' };
        return { label: 'Низкое' };
    }
};

const MetricCard: React.FC<{ title: string; value: number | null; isInverted?: boolean }> = ({ title, value, isInverted = false }) => {
    const interpretation = getMetricInterpretation(value, isInverted);

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col">
            <h3 className="font-semibold text-slate-600 mb-2 text-sm">{title}</h3>
            <div className="mt-auto">
                <p className="text-3xl font-bold text-slate-800">
                    {value !== null ? value : '–'}
                    <span className="text-xl text-slate-400">/7</span>
                </p>
                {value !== null && <p className="text-sm font-semibold text-slate-600">{interpretation.label}</p>}
            </div>
        </div>
    );
};

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const Dashboard: React.FC<DashboardProps> = ({ checkInHistory, factors, onStartCheckIn }) => {
  const [nickname] = useLocalStorage('userNickname', 'чемпион');
  const latestCheckIn = checkInHistory?.[0];
  const interpretation = getRecoveryInterpretation(latestCheckIn?.recoveryScore ?? null);

  let predictedScore: number | null = null;
  let predictionDetails: { currentScore: number; naturalRecovery: number; loadPenalty: number; factorEffect: number; } | null = null;

  if (latestCheckIn) {
      const R_1_7 = latestCheckIn.recoveryScore;
      const R_frac = (R_1_7 - 1) / 6;

      const tss = latestCheckIn.data.tss;
      const tss_n = (tss - 1) / 6; // Normalize from 1-7 scale

      // --- New Prediction Formula ---
      const k = 0.20;
      const R_recov = R_frac + k * (1 - R_frac);

      const lambda = 0.12;
      const P = lambda * tss_n;

      const factorsMap = new Map(factors.map(f => [f.name, f]));
      const F_t_plus_1_frac = latestCheckIn.data.factors.reduce((acc, factorName) => {
          const factor = factorsMap.get(factorName);
          if (factor) {
              const w_j = factor.weight;
              const tau_j = factor.tau || 24;
              // t_j (time since check-in) is ~0 when calculating prediction right after.
              const decayedContribution = w_j * Math.exp(-(0 + 24) / tau_j);
              return acc + decayedContribution;
          }
          return acc;
      }, 0);
      
      const R_frac_t_plus_1 = clamp(R_recov - P + F_t_plus_1_frac, 0, 1);
      predictedScore = 1 + 6 * R_frac_t_plus_1;
      
      predictionDetails = {
        currentScore: R_1_7,
        naturalRecovery: 6 * (k * (1 - R_frac)), // map effect to 1-7 scale
        loadPenalty: 6 * P, // map effect to 1-7 scale
        factorEffect: 6 * F_t_plus_1_frac, // map effect to 1-7 scale
      };
  }
  const predictedInterpretation = getRecoveryInterpretation(predictedScore);

  return (
    <div className="space-y-8">
       <header className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Добрый день, {nickname} 🌿</h2>
                <p className="text-slate-500">
                  {latestCheckIn 
                    ? 'Вот ваше последнее обновление.'
                    : 'Добро пожаловать! Начните с первого чекина, чтобы заполнить панель.'
                  }
                </p>
            </div>
             <button
                onClick={onStartCheckIn}
                className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors whitespace-nowrap"
            >
                {latestCheckIn ? 'Начать новый чекин' : 'Начать первый чекин' }
            </button>
        </header>

      <div className="bg-white p-6 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-slate-200 gap-6 md:gap-0">
          <div className="text-center md:pr-6 flex flex-col justify-center">
              <h3 className="text-slate-500 text-sm font-medium mb-2">Ваш балл восстановления</h3>
              <p className="text-6xl font-bold text-slate-800">{latestCheckIn ? latestCheckIn.recoveryScore.toFixed(1) : '--'}</p>
              <p className="font-semibold text-slate-600 mt-1">{interpretation.state}</p>
              <p className="text-xs text-slate-400 mt-2">Отражает ваше текущее состояние по шкале от 1 до 7.</p>
          </div>
          <div className="text-center flex flex-col justify-center md:pl-6">
              <h3 className="text-slate-500 text-sm font-medium mb-2">Рекомендация на сегодня</h3>
              <p className="text-lg font-semibold text-slate-700">{interpretation.recommendation}</p>
              <p className="text-xs text-slate-400 mt-2">Основана на вашем балле восстановления.</p>
          </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard title="💤 Качество сна" value={latestCheckIn?.data.sleepQuality ?? null} />
          <MetricCard title="💪 Энергия" value={latestCheckIn?.data.energyLevel ?? null} />
          <MetricCard title="🙂 Настроение" value={latestCheckIn?.data.mood ?? null} />
          <MetricCard title="🤯 Стресс" value={latestCheckIn?.data.stressLevel ?? null} isInverted={true} />
          <MetricCard title="🎯 Мотивация" value={latestCheckIn?.data.motivation ?? null} />
          <MetricCard title="🧠 Концентрация" value={latestCheckIn?.data.focus ?? null} />
          <MetricCard title="🤕 Боль в мышцах" value={latestCheckIn?.data.muscleSoreness ?? null} isInverted={true} />
          <MetricCard title="🏋️ TSS" value={latestCheckIn?.data.tss ?? null} isInverted={true} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Детализация прогноза</h3>
        {predictedScore !== null && predictionDetails ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Прогноз на завтра</h3>
              <p className="text-6xl font-bold text-slate-800">{predictedScore.toFixed(1)}</p>
              <p className="font-semibold text-slate-600">{predictedInterpretation.state}</p>
               <p className="text-xs text-slate-400 mt-2">Ожидаемый балл (1-7) через 24 часа.</p>
            </div>
            <div className="w-full md:w-px bg-slate-200 h-px md:h-32"></div>
            <div className="space-y-3 text-sm flex-grow w-full max-w-sm">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Текущий балл:</span>
                    <span className="font-bold text-slate-800">{predictionDetails.currentScore.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Ваш последний рассчитанный балл восстановления.</p>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Естественное восстановление:</span>
                    <span className="font-bold text-slate-800">+{predictionDetails.naturalRecovery.toFixed(2)}</span>
                  </div>
                   <p className="text-xs text-slate-400 mt-1">Прогнозируемое улучшение за счет естественных процессов отдыха.</p>
                </div>
                 <div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Штраф за нагрузку:</span>
                    <span className="font-bold text-slate-800">-{predictionDetails.loadPenalty.toFixed(2)}</span>
                  </div>
                   <p className="text-xs text-slate-400 mt-1">Негативное влияние последней тренировки на завтрашний день.</p>
                </div>
                 <div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Влияние факторов (завтра):</span>
                    <span className="font-bold text-slate-800">
                      {predictionDetails.factorEffect >= 0 ? '+' : ''}{predictionDetails.factorEffect.toFixed(2)}
                    </span>
                  </div>
                   <p className="text-xs text-slate-400 mt-1">Остаточный эффект от отмеченных вами факторов на следующий день.</p>
                </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500">Прогноз будет доступен после вашего первого чекина.</p>
        )}
      </div>
      
       <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-3">Влияющие факторы сегодня</h3>
            {latestCheckIn && latestCheckIn.data.factors.length > 0 ? (
                <div className="max-h-36 overflow-y-auto pr-2">
                    <div className="flex flex-wrap gap-2">
                        {latestCheckIn.data.factors.map(factor => (
                            <span key={factor} className="bg-slate-200 text-slate-800 text-sm font-semibold px-3 py-1.5 rounded-full">{factor}</span>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-slate-500 text-sm">Факторы, которые вы отметите в чекине, появятся здесь.</p>
            )}
      </div>

    </div>
  );
};

export default Dashboard;