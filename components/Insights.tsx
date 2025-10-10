import React, { useState } from 'react';
import { CheckInRecord, Factor } from '../types';
import { FactorImpactAnalysis } from './FactorImpactAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface InsightsProps {
  checkInHistory: CheckInRecord[];
  factors: Factor[];
}

const RecoveryChart: React.FC<{ data: CheckInRecord[] }> = ({ data }) => {
  if (data.length < 2) {
    return <p className="text-slate-500">Нужно больше данных для построения графика. Сделайте еще несколько чекинов.</p>;
  }

  const chartWidth = 500;
  const chartHeight = 220;
  const padding = 40;

  const scores = data.map(d => d.recoveryScore).reverse();
  const maxScore = 7;
  const minScore = 1;

  const points = scores.map((score, index) => {
    const x = (index / (scores.length - 1)) * (chartWidth - 2 * padding) + padding;
    const y = chartHeight - padding - ((score - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const xLabels = data.map((d, i) => {
      const date = new Date(d.id);
      return {
          x: (i / (data.length - 1)) * (chartWidth - 2 * padding) + padding,
          label: `${date.getDate()}.${date.getMonth() + 1}`
      }
  }).reverse();

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
       <text x={chartWidth / 2} y={15} textAnchor="middle" className="text-sm font-semibold fill-current text-slate-600">Динамика восстановления</text>
      {/* Y axis labels and grid lines */}
      <text x={padding - 15} y={padding - 20} textAnchor="middle" className="text-xs fill-current text-slate-400 -rotate-90 origin-center">Балл</text>
      {[1, 2, 3, 4, 5, 6, 7].map(val => (
        <g key={val}>
          <text
            x={padding - 10}
            y={chartHeight - padding - ((val - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding)}
            className="text-xs fill-current text-slate-400"
            textAnchor="end"
            alignmentBaseline="middle"
          >
            {val}
          </text>
          <line
            x1={padding}
            x2={chartWidth - padding}
            y1={chartHeight - padding - ((val - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding)}
            y2={chartHeight - padding - ((val - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding)}
            className="stroke-current text-slate-200"
            strokeWidth="1"
          />
        </g>
      ))}
      
      {/* X axis labels */}
      <text x={chartWidth / 2} y={chartHeight - 5} textAnchor="middle" className="text-xs fill-current text-slate-400">Дата</text>
      {xLabels.map(({x, label}, index) => (
        <text key={`${label}-${index}`} x={x} y={chartHeight - padding + 20} className="text-xs fill-current text-slate-400" textAnchor="middle">
          {label}
        </text>
      ))}

      {/* Data line */}
      <polyline fill="none" strokeWidth="2" className="stroke-current text-primary" points={points} />

      {/* Data points */}
      {points.split(' ').map((p, index) => {
        if (!p) return null;
        const [x, y] = p.split(',');
        return <circle key={index} cx={x} cy={y} r="3" className="fill-current text-primary" />;
      })}
    </svg>
  );
};

const MetricSquare: React.FC<{ value: number; isInverted?: boolean }> = ({ value, isInverted = false }) => {
    const normalizedValue = isInverted ? 8 - value : value;
    const colorClasses = [
        'bg-red-200', 'bg-red-300', 'bg-orange-300', 'bg-yellow-300',
        'bg-accent', 'bg-accent/80', 'bg-accent/60'
    ];
    const color = colorClasses[Math.max(0, Math.min(normalizedValue - 1, 6))];
    return <div className={`w-6 h-6 rounded-md ${color} flex items-center justify-center font-bold text-xs text-slate-700`}>{value}</div>
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

      <Card>
        <CardContent className="p-6">
          <RecoveryChart data={checkInHistory} />
        </CardContent>
      </Card>

      <FactorImpactAnalysis checkInHistory={checkInHistory} allFactors={factors} />

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

                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3 text-center text-xs text-slate-500">
                          <span>💤</span><span>💪</span><span>🙂</span><span>🤯</span>
                          <span>🎯</span><span>🧠</span><span>🤕</span><span>🏋️</span>
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
