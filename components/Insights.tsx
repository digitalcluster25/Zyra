import React, { useState } from 'react';
import { CheckInRecord, Factor } from '../types';
import { FactorImpactAnalysis } from './FactorImpactAnalysis';
import WellnessDecomposition from './WellnessDecomposition';
import TrainingRecommendation from './TrainingRecommendation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend, ReferenceLine } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

interface InsightsProps {
  checkInHistory: CheckInRecord[];
  factors: Factor[];
}

// Конфигурация для графика PMC (Performance Management Chart)
const pmcChartConfig = {
  ctl: {
    label: "CTL (Фитнес)",
    color: "var(--chart-1)",
  },
  atl: {
    label: "ATL (Усталость)",
    color: "var(--chart-2)",
  },
  tsb: {
    label: "TSB (Форма)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// Конфигурация для графика Индекса Хупера
const hooperChartConfig = {
  hooperIndex: {
    label: "Индекс Хупера",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// График PMC (Performance Management Chart)
const PMCChart: React.FC<{ data: CheckInRecord[] }> = ({ data }) => {
  if (data.length < 2) {
    return <p className="text-slate-500">Нужно больше данных для построения графика. Сделайте еще несколько чекинов.</p>;
  }

  // Проверяем, есть ли реальные данные о тренировках
  const hasTrainingData = data.some(record => record.ctl > 0 || record.atl > 0);
  if (!hasTrainingData) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 mb-2">Данных недостаточно для построения PMC</p>
        <p className="text-xs text-slate-400">
          PMC отслеживает тренировочную нагрузку на основе sRPE (длительность × RPE).
          <br />
          Заполните чекины с данными о тренировках, чтобы увидеть график.
        </p>
      </div>
    );
  }

  const chartData = data.slice().reverse().map(record => {
    const date = new Date(record.id);
    return {
      date: `${date.getDate()}.${date.getMonth() + 1}`,
      ctl: parseFloat((record.ctl ?? 0).toFixed(1)),
      atl: parseFloat((record.atl ?? 0).toFixed(1)),
      tsb: parseFloat((record.tsb ?? 0).toFixed(1)),
    };
  });

  // Фильтруем данные, чтобы график начинался с первого дня с данными
  const firstDataIndex = chartData.findIndex(item => item.ctl > 0 || item.atl > 0 || item.tsb !== 0);
  const filteredChartData = firstDataIndex >= 0 ? chartData.slice(firstDataIndex) : chartData;

  return (
    <div className="h-[250px] overflow-hidden">
      <ChartContainer config={pmcChartConfig} className="h-full w-full">
        <LineChart
          accessibilityLayer
          data={filteredChartData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={11}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            iconType="line"
          />
          
          {/* Референсная линия для TSB = 0 */}
          <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />
          
          {/* CTL - долгосрочная адаптация (синий) */}
          <Line
            dataKey="ctl"
            name="CTL (Фитнес)"
            type="monotone"
            stroke="var(--color-ctl)"
            strokeWidth={2}
            dot={false}
          />
          
          {/* ATL - краткосрочная усталость (красный) */}
          <Line
            dataKey="atl"
            name="ATL (Усталость)"
            type="monotone"
            stroke="var(--color-atl)"
            strokeWidth={2}
            dot={false}
          />
          
          {/* TSB - форма/готовность (зеленый) */}
          <Line
            dataKey="tsb"
            name="TSB (Форма)"
            type="monotone"
            stroke="var(--color-tsb)"
            strokeWidth={2.5}
            dot={{
              fill: "var(--color-tsb)",
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

// График Индекса Хупера
const HooperChart: React.FC<{ data: CheckInRecord[] }> = ({ data }) => {
  if (data.length < 2) {
    return <p className="text-slate-500">Нужно больше данных для построения графика.</p>;
  }

  const chartData = data.slice().reverse().map(record => {
    const date = new Date(record.id);
    return {
      date: `${date.getDate()}.${date.getMonth() + 1}`,
      hooperIndex: record.hooperIndex,
    };
  });

  // Фильтруем данные, чтобы график начинался с первого дня с данными
  const firstDataIndex = chartData.findIndex(item => item.hooperIndex !== undefined && item.hooperIndex !== null);
  const filteredChartData = firstDataIndex >= 0 ? chartData.slice(firstDataIndex) : chartData;

  return (
    <div className="h-[180px] overflow-hidden">
      <ChartContainer config={hooperChartConfig} className="h-full w-full">
        <LineChart
          accessibilityLayer
          data={filteredChartData}
          margin={{
            left: 120,
            right: 12,
            top: 12,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[5, 35]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              let label = '';
              if (value <= 10) {
                label = 'Отлично';
              } else if (value <= 15) {
                label = 'Хорошо';
              } else if (value <= 20) {
                label = 'Умеренно';
              } else if (value <= 25) {
                label = 'Усталость';
              } else {
                label = 'Критично';
              }
              return `${value} ${label}`;
            }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          
          <Line
            dataKey="hooperIndex"
            type="natural"
            stroke="var(--color-hooperIndex)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-hooperIndex)",
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

// Квадратики метрик (теперь для новой шкалы)
const MetricSquare: React.FC<{ value?: number; label: string }> = ({ value, label }) => {
    // Если значение отсутствует, используем 1 (отлично по умолчанию)
    const safeValue = (value === undefined || value === null || isNaN(value)) ? 1 : value;
    
    // Для Индекса Хупера: 1 = отлично (светлый slate), 7 = плохо (темный slate)
    const colorClasses = [
        'bg-slate-100 text-slate-700', // 1 - отлично
        'bg-slate-200 text-slate-700', // 2
        'bg-slate-300 text-slate-800', // 3
        'bg-slate-400 text-slate-900', // 4
        'bg-slate-500 text-slate-50',  // 5
        'bg-slate-600 text-slate-50',  // 6
        'bg-slate-700 text-slate-50'   // 7 - плохо
    ];
    const color = colorClasses[Math.max(0, Math.min(safeValue - 1, 6))];
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`w-full aspect-square rounded-lg ${color} flex items-center justify-center font-bold text-2xl`}>
          {safeValue}
        </div>
        <p className="text-xs text-slate-600 text-center leading-tight">{label}</p>
      </div>
    );
};

// Квадратики для параметров (Индекс Хупера, Нагрузка, TSB)
const ParameterSquare: React.FC<{ value?: number; label: string; type: 'hooper' | 'load' | 'tsb' }> = ({ value, label, type }) => {
    // Если значение отсутствует, используем 0
    const safeValue = (value === undefined || value === null || isNaN(value)) ? 0 : value;
    
    let color = 'bg-slate-300 text-slate-800';
    let displayValue = String(safeValue);
    
    if (type === 'hooper') {
        // Индекс Хупера: 5-35 (5=отлично, 35=плохо)
        // Маппим на шкалу 1-7
        const normalized = Math.max(1, Math.min(7, Math.round(((safeValue - 5) / 30) * 6 + 1)));
        const colorClasses = [
            'bg-slate-100 text-slate-700',
            'bg-slate-200 text-slate-700',
            'bg-slate-300 text-slate-800',
            'bg-slate-400 text-slate-900',
            'bg-slate-500 text-slate-50',
            'bg-slate-600 text-slate-50',
            'bg-slate-700 text-slate-50'
        ];
        color = colorClasses[normalized - 1];
        displayValue = safeValue.toFixed(0);
    } else if (type === 'load') {
        // Тренировочная нагрузка: 0-300+ (чем выше, тем темнее)
        const normalized = Math.max(1, Math.min(7, Math.round((safeValue / 300) * 6 + 1)));
        const colorClasses = [
            'bg-slate-100 text-slate-700',
            'bg-slate-200 text-slate-700',
            'bg-slate-300 text-slate-800',
            'bg-slate-400 text-slate-900',
            'bg-slate-500 text-slate-50',
            'bg-slate-600 text-slate-50',
            'bg-slate-700 text-slate-50'
        ];
        color = colorClasses[normalized - 1];
        displayValue = safeValue.toFixed(0);
    } else if (type === 'tsb') {
        // TSB: -30 до +30 (отрицательный=темный/усталость, положительный=светлый/свежесть)
        const normalized = Math.max(1, Math.min(7, Math.round(((safeValue + 30) / 60) * 6 + 1)));
        const colorClasses = [
            'bg-slate-700 text-slate-50',  // -30 (усталость)
            'bg-slate-600 text-slate-50',
            'bg-slate-500 text-slate-50',
            'bg-slate-400 text-slate-900',
            'bg-slate-300 text-slate-800',
            'bg-slate-200 text-slate-700',
            'bg-slate-100 text-slate-700'  // +30 (свежесть)
        ];
        color = colorClasses[normalized - 1];
        displayValue = safeValue === 0 ? '0' : safeValue.toFixed(1);
    }
    
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`w-full aspect-square rounded-lg ${color} flex items-center justify-center font-bold text-2xl`}>
          {displayValue}
        </div>
        <p className="text-xs text-slate-600 text-center leading-tight">{label}</p>
      </div>
    );
};

// Helper to group check-ins by week
const getWeeks = (records: CheckInRecord[]) => {
    const weeks: { [key: string]: CheckInRecord[] } = {};
    records.forEach(record => {
        const d = new Date(record.id);
        const day = d.getDay();
        const firstDayOfWeek = new Date(d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)));
        firstDayOfWeek.setHours(0, 0, 0, 0);
        const weekKey = firstDayOfWeek.toISOString().split('T')[0];
        if (!weeks[weekKey]) weeks[weekKey] = [];
        weeks[weekKey].push(record);
    });
    return Object.entries(weeks).sort((a, b) => b[0].localeCompare(a[0]));
};

const Insights: React.FC<InsightsProps> = ({ checkInHistory, factors }) => {
  const weeks = getWeeks(checkInHistory);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Аналитика</h2>
        <p className="text-slate-500">Научно-обоснованный мониторинг вашего состояния и тренировочной нагрузки.</p>
      </div>

      {/* График PMC (Performance Management Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Модель Банистера: отслеживание фитнеса, усталости и формы</CardTitle>
            <CardDescription>
              График показывает динамику тренировочной нагрузки и готовности к соревнованиям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PMCChart data={checkInHistory} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <p className="font-semibold text-slate-900">CTL (Фитнес)</p>
              </div>
              <p className="text-sm text-slate-800 mb-2">
                <strong>Что показывает:</strong> Ваш общий уровень физической подготовки
              </p>
              <p className="text-xs text-slate-700">
                Долгосрочная адаптация за 42 дня. Чем выше CTL, тем лучше ваша базовая форма.
              </p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <p className="font-semibold text-slate-900">ATL (Усталость)</p>
              </div>
              <p className="text-sm text-slate-800 mb-2">
                <strong>Что показывает:</strong> Ваш текущий уровень усталости от тренировок
              </p>
              <p className="text-xs text-slate-700">
                Краткосрочная нагрузка за 7 дней. Высокий ATL = нужен отдых.
              </p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <p className="font-semibold text-slate-900">TSB (Форма)</p>
              </div>
              <p className="text-sm text-slate-800 mb-2">
                <strong>Что показывает:</strong> Ваша готовность к соревнованиям
              </p>
              <p className="text-xs text-slate-700">
                TSB = CTL - ATL. Оптимально: от -10 до +5. Положительный TSB = пик формы.
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-700">
              <strong>Как читать график:</strong> Когда желтая линия (CTL) растет - вы становитесь сильнее. 
              Когда синяя линия (ATL) выше желтой - вы устали. 
              Серая линия (TSB) показывает вашу готовность: выше нуля = отличная форма для соревнований.
            </p>
          </div>
        </div>
      </div>

      {/* Индекс Хупера и Анализ факторов */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Динамика Индекса Хупера</CardTitle>
            <CardDescription>Чем ниже значение, тем лучше ваше состояние (5-35)</CardDescription>
          </CardHeader>
          <CardContent>
            <HooperChart data={checkInHistory} />
          </CardContent>
        </Card>

        <div className="flex">
          <FactorImpactAnalysis checkInHistory={checkInHistory} allFactors={factors} />
        </div>
      </div>

      {/* История чекинов */}
      <Card>
        <CardHeader>
          <CardTitle>История чекинов</CardTitle>
          <CardDescription>Детальный просмотр ваших чекинов по неделям</CardDescription>
        </CardHeader>
        <CardContent>
          {checkInHistory.length > 0 ? (
            <Tabs value={selectedWeekIndex.toString()} onValueChange={(val) => setSelectedWeekIndex(parseInt(val))}>
              <TabsList>
                {weeks.map(([weekKey], index) => {
                  const startDate = new Date(weekKey);
                  const endDate = new Date(startDate);
                  endDate.setDate(startDate.getDate() + 6);
                  const label = `${startDate.getDate()}.${startDate.getMonth() + 1} - ${endDate.getDate()}.${endDate.getMonth() + 1}`;
                  return (
                    <TabsTrigger key={weekKey} value={index.toString()}>
                      {label}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              {weeks.map(([weekKey, records], index) => (
                <TabsContent key={weekKey} value={index.toString()} className="space-y-4 mt-4">
                  {records.map(record => (
                    <div key={record.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="mb-3">
                        <p className="font-semibold text-slate-800 mb-3">
                          {new Date(record.id).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                          {' в '}
                          {new Date(record.id).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="grid grid-cols-10 gap-2">
                          <ParameterSquare value={record.hooperIndex} label="Индекс Хупера" type="hooper" />
                          <ParameterSquare value={record.dailyLoad} label="Нагрузка" type="load" />
                          <ParameterSquare value={record.tsb} label="Баланс" type="tsb" />
                            <MetricSquare value={record.data.sleepQuality} label="Сон" />
                            <MetricSquare value={record.data.fatigue} label="Усталость" />
                            <MetricSquare value={record.data.muscleSoreness} label="Боль" />
                            <MetricSquare value={record.data.stress} label="Стресс" />
                            <MetricSquare value={record.data.mood} label="Настроение" />
                          <MetricSquare value={record.data.motivation} label="Мотивация" />
                          <MetricSquare value={record.data.focus} label="Концентрация" />
                        </div>
                      </div>

                      {/* Факторы */}
                      {record.data.factors.length > 0 && (
                          <div className="pt-3 border-t border-slate-200">
                              <p className="text-xs font-semibold text-slate-600 mb-2">Факторы:</p>
                              <div className="flex flex-wrap gap-2">
                                {record.data.factors.map(f => <Badge key={f} variant="secondary">{f}</Badge>)}
                              </div>
                          </div>
                      )}
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          ) : <p className="text-slate-500">Ваша история чекинов появится здесь.</p>}
        </CardContent>
      </Card>

    </div>
  );
};

export default Insights;
