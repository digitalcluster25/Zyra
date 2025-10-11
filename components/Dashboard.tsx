import React from 'react';
import { CheckInRecord, Factor } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AthleteMonitoringService } from '../utils/athleteMonitoring';

interface DashboardProps {
  checkInHistory: CheckInRecord[];
  factors: Factor[];
  onStartCheckIn: () => void;
}

// Интерпретация для отображения метрик
// ВАЖНО: Шкалы теперь инвертированы под Индекс Хупера (1=хорошо, 7=плохо)
const getMetricInterpretation = (value: number | null, fieldName: string) => {
    if (value === null) return { label: '', color: '' };

    // Для Индекса Хупера: 1 = хорошо, 7 = плохо
    if (['sleepQuality', 'fatigue', 'muscleSoreness', 'stress', 'mood'].includes(fieldName)) {
      if (value <= 2) return { label: 'Отлично', color: 'text-green-600' };
      if (value <= 4) return { label: 'Хорошо', color: 'text-green-500' };
      if (value <= 5) return { label: 'Средне', color: 'text-yellow-600' };
      return { label: 'Плохо', color: 'text-red-600' };
    }
    
    // Для доп метрик (motivation, focus): 1 = хорошо, 7 = плохо
    if (value <= 2) return { label: 'Отлично', color: 'text-green-600' };
    if (value <= 4) return { label: 'Хорошо', color: 'text-green-500' };
    if (value <= 5) return { label: 'Средне', color: 'text-yellow-600' };
    return { label: 'Плохо', color: 'text-red-600' };
};

const MetricCard: React.FC<{ title: string; value: number | null; fieldName: string }> = ({ title, value, fieldName }) => {
    const interpretation = getMetricInterpretation(value, fieldName);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-600">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="flex flex-col">
                    <p className="text-3xl font-bold text-slate-800">
                        {value !== null ? value : '–'}
                    </p>
                    {value !== null && (
                        <p className={`text-sm font-semibold mt-1 ${interpretation.color}`}>
                            {interpretation.label}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ checkInHistory, factors, onStartCheckIn }) => {
  const [nickname] = useLocalStorage('userNickname', 'чемпион');
  const latestCheckIn = checkInHistory?.[0];
  
  // Индекс Хупера
  const hooperIndex = latestCheckIn?.hooperIndex ?? null;
  const hooperInterp = hooperIndex !== null 
    ? AthleteMonitoringService.interpretHooperIndex(hooperIndex)
    : null;

  // TSB (Training Stress Balance)
  const tsb = latestCheckIn?.tsb ?? null;
  const tsbInterp = tsb !== null 
    ? AthleteMonitoringService.interpretTSB(tsb)
    : null;

  // CTL и ATL для отображения
  const ctl = latestCheckIn?.ctl ?? null;
  const atl = latestCheckIn?.atl ?? null;

  // Training Load за сегодня
  const dailyLoad = latestCheckIn?.dailyLoad ?? null;

  // Контекстные рекомендации
  const contextualRecommendation = hooperIndex !== null && tsb !== null
    ? AthleteMonitoringService.generateRecommendation(hooperIndex, tsb)
    : null;

  return (
    <div className="space-y-8">
       <header className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Добрый день, {nickname}</h2>
                <p className="text-slate-500">
                  {latestCheckIn 
                    ? 'Вот ваше последнее обновление на основе научных методологий.'
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

      {/* Индекс Хупера и TSB */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Индекс Хупера */}
        <Card>
          <CardHeader>
            <CardTitle>Индекс Хупера</CardTitle>
            <CardDescription>Научно-валидированная оценка вашего состояния (5-35)</CardDescription>
          </CardHeader>
          <CardContent>
            {latestCheckIn && hooperInterp ? (
              <div className="flex items-start gap-6">
                <div className="flex-1 text-center">
                  <p className={`text-5xl font-bold ${
                    hooperInterp.level === 'excellent' || hooperInterp.level === 'good' ? 'text-green-600' :
                    hooperInterp.level === 'moderate' ? 'text-yellow-600' :
                    hooperInterp.level === 'high' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {hooperIndex}
                  </p>
                  <p className="font-semibold text-slate-600 mt-1">{hooperInterp.description}</p>
                  <p className="text-xs text-slate-400 mt-2">Чем ниже, тем лучше</p>
                </div>
                <div className="w-px bg-slate-200 self-stretch"></div>
                <div className="flex-1 flex flex-col justify-center space-y-2">
                  <div className="text-xs text-slate-500">
                    <div className="flex justify-between mb-1">
                      <span>Сон:</span>
                      <span className="font-semibold">{latestCheckIn.data.sleepQuality}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Усталость:</span>
                      <span className="font-semibold">{latestCheckIn.data.fatigue}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Боль:</span>
                      <span className="font-semibold">{latestCheckIn.data.muscleSoreness}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Стресс:</span>
                      <span className="font-semibold">{latestCheckIn.data.stress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Настроение:</span>
                      <span className="font-semibold">{latestCheckIn.data.mood}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Завершите чекин, чтобы получить оценку.</p>
            )}
          </CardContent>
        </Card>

        {/* Training Stress Balance (TSB) */}
        <Card>
          <CardHeader>
            <CardTitle>Баланс нагрузки (TSB)</CardTitle>
            <CardDescription>Ваша готовность к тренировкам на основе модели Банистера</CardDescription>
          </CardHeader>
          <CardContent>
            {latestCheckIn && tsbInterp ? (
              <div className="flex items-start gap-6">
                <div className="flex-1 text-center">
                  <p className={`text-5xl font-bold ${
                    tsbInterp.level === 'optimal' ? 'text-green-600' :
                    tsbInterp.level === 'productive' ? 'text-yellow-600' :
                    tsbInterp.level === 'fresh' ? 'text-blue-600' :
                    tsbInterp.level === 'high' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {tsb.toFixed(1)}
                  </p>
                  <p className="font-semibold text-slate-600 mt-1">{tsbInterp.description}</p>
                  <p className="text-xs text-slate-400 mt-2">Форма / Готовность</p>
                </div>
                <div className="w-px bg-slate-200 self-stretch"></div>
                <div className="flex-1 flex flex-col justify-center space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Фитнес (CTL):</span>
                    <span className="font-bold text-slate-800">{ctl.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Усталость (ATL):</span>
                    <span className="font-bold text-slate-800">{atl.toFixed(1)}</span>
                  </div>
                  {dailyLoad !== null && dailyLoad > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-slate-600">Сегодня (TL):</span>
                      <span className="font-bold text-slate-800">{dailyLoad.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">TSB будет доступен после вашего первого чекина.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Контекстные рекомендации */}
      {contextualRecommendation && (
        <Card className="bg-slate-50 border-slate-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              Рекомендация на основе ваших показателей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{contextualRecommendation}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Метрики чекина */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard title="Качество сна" value={latestCheckIn?.data.sleepQuality ?? null} fieldName="sleepQuality" />
          <MetricCard title="Усталость" value={latestCheckIn?.data.fatigue ?? null} fieldName="fatigue" />
          <MetricCard title="Боль в мышцах" value={latestCheckIn?.data.muscleSoreness ?? null} fieldName="muscleSoreness" />
          <MetricCard title="Стресс" value={latestCheckIn?.data.stress ?? null} fieldName="stress" />
          <MetricCard title="Настроение" value={latestCheckIn?.data.mood ?? null} fieldName="mood" />
      </div>

      {/* Дополнительные метрики (если есть) */}
      {(latestCheckIn?.data.motivation !== undefined || latestCheckIn?.data.focus !== undefined) && (
        <div className="grid grid-cols-2 gap-4 max-w-md">
          {latestCheckIn.data.motivation !== undefined && (
            <MetricCard title="Мотивация" value={latestCheckIn.data.motivation} fieldName="motivation" />
          )}
          {latestCheckIn.data.focus !== undefined && (
            <MetricCard title="Концентрация" value={latestCheckIn.data.focus} fieldName="focus" />
          )}
        </div>
      )}

      {/* Training Load за сегодня */}
      {latestCheckIn && latestCheckIn.data.hadTraining && dailyLoad !== null && dailyLoad > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Тренировка сегодня</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Длительность: <span className="font-semibold">{latestCheckIn.data.trainingDuration} минут</span></p>
                <p className="text-sm text-slate-600">RPE: <span className="font-semibold">{latestCheckIn.data.rpe} / 10</span></p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Training Load</p>
                <p className="text-4xl font-bold text-slate-800">{dailyLoad.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Факторы */}
       <Card>
          <CardHeader>
            <CardTitle>Влияющие факторы сегодня</CardTitle>
          </CardHeader>
          <CardContent>
            {latestCheckIn && latestCheckIn.data.factors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {latestCheckIn.data.factors.map((factor, idx) => (
                        <Badge key={idx} variant="secondary">{factor}</Badge>
                    ))}
                </div>
            ) : (
                <p className="text-slate-500 text-sm">Факторы, которые вы отметите в чекине, появятся здесь.</p>
            )}
          </CardContent>
      </Card>

      {/* Информационная карточка о методологии */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">О методологиях</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Индекс Хупера:</strong> Валидированная система мониторинга из 5 метрик (сон, усталость, боль, стресс, настроение). 
            Разработана для раннего выявления перетренированности.
          </p>
          <p>
            <strong>sRPE (session RPE):</strong> Метод оценки тренировочной нагрузки как произведение длительности и воспринимаемой интенсивности (шкала Борга 0-10).
          </p>
          <p>
            <strong>Модель Банистера:</strong> Математическая модель "Фитнес-Усталость", отслеживающая долгосрочную адаптацию (CTL) и краткосрочную усталость (ATL). 
            TSB = CTL - ATL показывает вашу готовность к тренировкам.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
