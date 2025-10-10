import React from 'react';
import { CheckInRecord, Factor } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

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
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-600">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-slate-800">
                        {value !== null ? value : '–'}
                    </p>
                    {value !== null && <p className="text-sm font-semibold text-slate-600">{interpretation.label}</p>}
                </div>
            </CardContent>
        </Card>
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
                <h2 className="text-2xl font-bold text-slate-800">Добрый день, {nickname}</h2>
                <p className="text-slate-500">
                  {latestCheckIn 
                    ? 'Вот ваше последнее обновление.'
                    : 'Добро пожаловать! Начните с первого чекина, чтобы заполнить панель.'
                  }
                </p>
            </div>
             <Button
                onClick={onStartCheckIn}
                size="lg"
            >
                {latestCheckIn ? 'Начать новый чекин' : 'Начать первый чекин' }
            </Button>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ваш балл восстановления</CardTitle>
          </CardHeader>
          <CardContent>
            {latestCheckIn ? (
              <div className="flex items-start gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-slate-800">{latestCheckIn.recoveryScore.toFixed(1)}</p>
                  <p className="font-semibold text-slate-600 mt-1">{interpretation.state}</p>
                  <p className="text-xs text-slate-400 mt-2">Текущее состояние</p>
                </div>
                <div className="w-px bg-slate-200 self-stretch"></div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-slate-700">{interpretation.recommendation}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Завершите чекин, чтобы получить оценку.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Прогноз на завтра</CardTitle>
          </CardHeader>
          <CardContent>
            {predictedScore !== null && predictionDetails ? (
              <div className="flex items-start gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-slate-800">{predictedScore.toFixed(1)}</p>
                  <p className="font-semibold text-slate-600 mt-1">{predictedInterpretation.state}</p>
                  <p className="text-xs text-slate-400 mt-2">Ожидаемый балл</p>
                </div>
                <div className="w-px bg-slate-200 self-stretch"></div>
                <div className="flex-1 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Естественное восстановление:</span>
                    <span className="font-bold text-slate-800">+{predictionDetails.naturalRecovery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Штраф за нагрузку:</span>
                    <span className="font-bold text-slate-800">-{predictionDetails.loadPenalty.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Влияние факторов:</span>
                    <span className="font-bold text-slate-800">
                      {predictionDetails.factorEffect >= 0 ? '+' : ''}{predictionDetails.factorEffect.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Прогноз будет доступен после вашего первого чекина.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <MetricCard title="Качество сна" value={latestCheckIn?.data.sleepQuality ?? null} />
          <MetricCard title="Энергия" value={latestCheckIn?.data.energyLevel ?? null} />
          <MetricCard title="Настроение" value={latestCheckIn?.data.mood ?? null} />
          <MetricCard title="Стресс" value={latestCheckIn?.data.stressLevel ?? null} isInverted={true} />
          <MetricCard title="Мотивация" value={latestCheckIn?.data.motivation ?? null} />
          <MetricCard title="Концентрация" value={latestCheckIn?.data.focus ?? null} />
          <MetricCard title="Боль в мышцах" value={latestCheckIn?.data.muscleSoreness ?? null} isInverted={true} />
          <MetricCard title="TSS" value={latestCheckIn?.data.tss ?? null} isInverted={true} />
      </div>
      
       <Card>
          <CardHeader>
            <CardTitle>Влияющие факторы сегодня</CardTitle>
          </CardHeader>
          <CardContent>
            {latestCheckIn && latestCheckIn.data.factors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {latestCheckIn.data.factors.map(factor => (
                        <Badge key={factor} variant="secondary">{factor}</Badge>
                    ))}
                </div>
            ) : (
                <p className="text-slate-500 text-sm">Факторы, которые вы отметите в чекине, появятся здесь.</p>
            )}
          </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;