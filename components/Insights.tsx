import React, { useState } from 'react';
import { CheckInRecord, Factor } from '../types';
import { FactorImpactAnalysis } from './FactorImpactAnalysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

interface InsightsProps {
  checkInHistory: CheckInRecord[];
  factors: Factor[];
}

const chartConfig = {
  recoveryScore: {
    label: "Балл восстановления",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const RecoveryChart: React.FC<{ data: CheckInRecord[] }> = ({ data }) => {
  if (data.length < 2) {
    return <p className="text-slate-500">Нужно больше данных для построения графика. Сделайте еще несколько чекинов.</p>;
  }

  const chartData = data.slice().reverse().map(record => {
    const date = new Date(record.id);
    return {
      date: `${date.getDate()}.${date.getMonth() + 1}`,
      recoveryScore: parseFloat(record.recoveryScore.toFixed(1)),
    };
  });

  return (
    <div className="h-[180px]">
      <ChartContainer config={chartConfig}>
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
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[1, 7]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="recoveryScore"
            type="natural"
            stroke="var(--color-recoveryScore)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-recoveryScore)",
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

const MetricSquare: React.FC<{ value: number; isInverted?: boolean }> = ({ value, isInverted = false }) => {
    const normalizedValue = isInverted ? 8 - value : value;
    const colorClasses = [
        'bg-red-200', 'bg-red-300', 'bg-orange-300', 'bg-yellow-300',
        'bg-accent', 'bg-accent/80', 'bg-accent/60'
    ];
    const color = colorClasses[Math.max(0, Math.min(normalizedValue - 1, 6))];
    return <div className={`w-18 h-18 rounded-md ${color} flex items-center justify-center font-bold text-base text-slate-700`}>{value}</div>
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

  const selectedWeekRecords = weeks[selectedWeekIndex]?.[1] ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Аналитика</h2>
        <p className="text-slate-500">Отслеживайте свой прогресс и узнайте, что влияет на ваше состояние.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Динамика восстановления</CardTitle>
            <CardDescription>Изменение балла восстановления за последние дни</CardDescription>
          </CardHeader>
          <CardContent>
            <RecoveryChart data={checkInHistory} />
          </CardContent>
        </Card>

        <div className="flex">
          <FactorImpactAnalysis checkInHistory={checkInHistory} allFactors={factors} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>История чекинов</CardTitle>
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
                              <div className="flex items-baseline space-x-2">
                                <p className="text-sm text-slate-500 font-medium">Балл:</p>
                                <p className="text-2xl font-bold text-slate-800">{record.recoveryScore.toFixed(1)}</p>
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-3">
                          <MetricSquare value={record.data.sleepQuality} />
                          <MetricSquare value={record.data.energyLevel} />
                          <MetricSquare value={record.data.mood} />
                          <MetricSquare value={record.data.stressLevel} isInverted />
                          <MetricSquare value={record.data.motivation} />
                          <MetricSquare value={record.data.focus} />
                          <MetricSquare value={record.data.muscleSoreness} isInverted />
                          <MetricSquare value={record.data.tss} isInverted />
                      </div>
                      {record.data.factors.length > 0 && (
                          <div className="pt-3 border-t border-slate-200">
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
