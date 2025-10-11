import React, { useState } from 'react';
import { CheckInRecord, Factor } from '../types';
import { FactorImpactAnalysis } from './FactorImpactAnalysis';
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

  const chartData = data.slice().reverse().map(record => {
    const date = new Date(record.id);
    return {
      date: `${date.getDate()}.${date.getMonth() + 1}`,
      ctl: parseFloat(record.ctl.toFixed(1)),
      atl: parseFloat(record.atl.toFixed(1)),
      tsb: parseFloat(record.tsb.toFixed(1)),
    };
  });

  return (
    <div className="h-[250px] overflow-hidden">
      <ChartContainer config={pmcChartConfig} className="h-full w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
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

  return (
    <div className="h-[180px] overflow-hidden">
      <ChartContainer config={hooperChartConfig} className="h-full w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 0,
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
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          
          {/* Зоны Индекса Хупера */}
          <ReferenceLine y={10} stroke="var(--border)" strokeDasharray="2 2" label={{ value: 'Отлично', fontSize: 10 }} />
          <ReferenceLine y={15} stroke="var(--border)" strokeDasharray="2 2" label={{ value: 'Хорошо', fontSize: 10 }} />
          <ReferenceLine y={20} stroke="var(--border)" strokeDasharray="2 2" label={{ value: 'Умеренно', fontSize: 10 }} />
          <ReferenceLine y={25} stroke="var(--border)" strokeDasharray="2 2" label={{ value: 'Высокая усталость', fontSize: 10 }} />
          
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
const MetricSquare: React.FC<{ value: number; label: string }> = ({ value, label }) => {
    // Для Индекса Хупера: 1 = отлично (зелёный), 7 = плохо (красный)
    const colorClasses = [
        'bg-green-200', // 1 - отлично
        'bg-green-300', // 2
        'bg-yellow-300', // 3-4
        'bg-yellow-300',
        'bg-orange-300', // 5
        'bg-red-300',    // 6
        'bg-red-400'     // 7 - плохо
    ];
    const color = colorClasses[Math.max(0, Math.min(value - 1, 6))];
    return (
      <div className="flex flex-col items-center">
        <div className={`w-18 h-18 rounded-md ${color} flex items-center justify-center font-bold text-base text-slate-700`}>
          {value}
        </div>
        <p className="text-xs text-slate-500 mt-1 text-center">{label}</p>
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
      <Card>
        <CardHeader>
          <CardTitle>Performance Management Chart (PMC)</CardTitle>
          <CardDescription>
            Модель Банистера: отслеживание фитнеса (CTL), усталости (ATL) и формы (TSB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PMCChart data={checkInHistory} />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-blue-50 rounded">
              <p className="font-semibold text-blue-900">CTL (Chronic Training Load)</p>
              <p>Долгосрочная адаптация, "фитнес". Экспоненциальное среднее за 42 дня.</p>
            </div>
            <div className="p-3 bg-red-50 rounded">
              <p className="font-semibold text-red-900">ATL (Acute Training Load)</p>
              <p>Краткосрочная усталость. Экспоненциальное среднее за 7 дней.</p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <p className="font-semibold text-green-900">TSB (Training Stress Balance)</p>
              <p>Форма/готовность. TSB = CTL - ATL. Оптимально: от -10 до +5.</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                      <div className="flex justify-between items-center mb-4">
                          <div>
                              <p className="font-semibold text-slate-800">{new Date(record.id).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                              <div className="flex items-baseline space-x-4">
                                <div>
                                  <p className="text-xs text-slate-500">Индекс Хупера:</p>
                                  <p className="text-2xl font-bold text-slate-800">{record.hooperIndex}</p>
                                </div>
                                {record.dailyLoad > 0 && (
                                  <div>
                                    <p className="text-xs text-slate-500">Training Load:</p>
                                    <p className="text-2xl font-bold text-slate-800">{record.dailyLoad.toFixed(0)}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs text-slate-500">TSB:</p>
                                  <p className="text-xl font-bold text-slate-800">{record.tsb.toFixed(1)}</p>
                                </div>
                              </div>
                          </div>
                      </div>

                      {/* Метрики Индекса Хупера */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Метрики Хупера (1=отлично, 7=плохо):</p>
                        <div className="grid grid-cols-5 gap-3">
                            <MetricSquare value={record.data.sleepQuality} label="Сон" />
                            <MetricSquare value={record.data.fatigue} label="Усталость" />
                            <MetricSquare value={record.data.muscleSoreness} label="Боль" />
                            <MetricSquare value={record.data.stress} label="Стресс" />
                            <MetricSquare value={record.data.mood} label="Настроение" />
                        </div>
                      </div>

                      {/* Дополнительные метрики */}
                      {(record.data.motivation !== undefined || record.data.focus !== undefined) && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-slate-600 mb-2">Дополнительно:</p>
                          <div className="grid grid-cols-2 gap-3 max-w-xs">
                            {record.data.motivation !== undefined && (
                              <MetricSquare value={record.data.motivation} label="Мотивация" />
                            )}
                            {record.data.focus !== undefined && (
                              <MetricSquare value={record.data.focus} label="Концентрация" />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Тренировка */}
                      {record.data.hadTraining && record.data.trainingDuration && record.data.rpe !== undefined && (
                        <div className="mb-3 p-2 bg-white rounded border border-slate-200">
                          <p className="text-xs font-semibold text-slate-600 mb-1">Тренировка:</p>
                          <p className="text-sm text-slate-700">
                            {record.data.trainingDuration} минут × RPE {record.data.rpe}/10 = <span className="font-bold">{record.dailyLoad.toFixed(0)}</span> TL
                          </p>
                        </div>
                      )}

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
