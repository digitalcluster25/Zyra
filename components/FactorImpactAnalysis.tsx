import React, { useMemo } from 'react';
import { CheckInRecord, Factor } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FactorImpactAnalysisProps {
  checkInHistory: CheckInRecord[];
  allFactors: Factor[];
}

interface FactorInfluence {
  factorName: string;
  influenceValue: number;
}

const calculateFactorInfluence = (
  record_t: CheckInRecord,
  record_t_plus_1: CheckInRecord,
  allFactors: Factor[]
): { delta_R: number; influences: FactorInfluence[] } => {
  // Используем hooperIndex: чем МЕНЬШЕ - тем ЛУЧШЕ (инвертируем для delta)
  const H_t = record_t.hooperIndex;
  const H_t_plus_1 = record_t_plus_1.hooperIndex;
  // Если Хупер снизился - состояние улучшилось (delta_R положительный)
  const delta_R = H_t - H_t_plus_1;

  // Нормализуем Хупер (5-35 -> 0-1, где 0 = лучшее)
  const Rn = (H_t - 5) / 30;
  const beta = 2.0;
  const nonlinearFactor = 1 - Math.exp(-beta * (1 - Rn));

  const activeFactorNames = record_t.data.factors;
  const factorsMap = new Map(allFactors.map(f => [f.name, f]));

  const activeFactorsWithInfluence = activeFactorNames.map(name => {
    const factor = factorsMap.get(name);
    if (!factor) return { name, influence: 0 };
    // Отрицательный weight = ухудшает состояние (повышает Хупер)
    // Положительный weight = улучшает состояние (снижает Хупер)
    const influence = -factor.weight * 1 * nonlinearFactor; // Инвертируем для совместимости с delta_R
    return { name, influence };
  }).filter(f => f.influence !== 0);

  const sumOfAbsoluteInfluences = activeFactorsWithInfluence.reduce((acc, f) => acc + Math.abs(f.influence), 0);

  if (sumOfAbsoluteInfluences === 0) {
    return { delta_R, influences: [] };
  }

  const finalInfluences = activeFactorsWithInfluence.map(({ name, influence }) => ({
    factorName: name,
    influenceValue: (influence / sumOfAbsoluteInfluences) * delta_R,
  }));
  
  return { delta_R, influences: finalInfluences };
};

const generateSummaryText = (delta_R: number, influences: FactorInfluence[]): string => {
  const sortedInfluences = [...influences].sort((a, b) => b.influenceValue - a.influenceValue);
  const positive = sortedInfluences.filter(f => f.influenceValue > 0);
  const negative = sortedInfluences.filter(f => f.influenceValue < 0).sort((a, b) => a.influenceValue - b.influenceValue);

  let summaryParts: string[] = [];

  if (delta_R > 0.05) {
    summaryParts.push(`Ваше состояние улучшилось на +${delta_R.toFixed(1)} балла.`);
  } else if (delta_R < -0.05) {
    summaryParts.push(`Ваше состояние ухудшилось на ${delta_R.toFixed(1)} балла.`);
  } else {
    summaryParts.push('Ваше состояние практически не изменилось.');
  }

  if (positive.length > 0) {
    const mainPositive = positive.slice(0, 2).map(f => `"${f.factorName.toLowerCase()}"`).join(' и ');
    summaryParts.push(`Основной вклад в улучшение внесли: ${mainPositive}.`);
  }
  if (negative.length > 0) {
    const mainNegative = negative.slice(0, 2).map(f => `"${f.factorName.toLowerCase()}"`).join(' и ');
    summaryParts.push(`Негативное влияние оказали: ${mainNegative}.`);
  }

  return summaryParts.join(' ');
};

export const FactorImpactAnalysis: React.FC<FactorImpactAnalysisProps> = ({ checkInHistory, allFactors }) => {
  if (checkInHistory.length < 2) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Анализ влияния факторов</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-slate-500">Завершите еще хотя бы один чекин, чтобы увидеть, как факторы влияют на ваше состояние.</p>
        </CardContent>
      </Card>
    );
  }

  const { delta_R, influences } = useMemo(() => {
    const record_t_plus_1 = checkInHistory[0];
    const record_t = checkInHistory[1];
    return calculateFactorInfluence(record_t, record_t_plus_1, allFactors);
  }, [checkInHistory, allFactors]);

  const summaryText = generateSummaryText(delta_R, influences);
  const maxAbsInfluence = Math.max(...influences.map(f => Math.abs(f.influenceValue)), 0.1);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Анализ влияния факторов</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-600 text-sm">Изменение балла между последними чекинами:</span>
            <span className={`text-2xl font-bold ${delta_R > 0 ? 'text-primary' : delta_R < 0 ? 'text-red-600' : 'text-slate-600'}`}>
              {delta_R > 0 ? '+' : ''}{delta_R.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ниже показано, какой вклад внёс каждый активный фактор в это изменение
          </p>
        </div>

        <div className="space-y-2">
          {influences.length > 0 ? (
            <>
              {influences.sort((a, b) => b.influenceValue - a.influenceValue).map(({ factorName, influenceValue }) => {
                const isPositive = influenceValue > 0;
                const percentage = (Math.abs(influenceValue) / maxAbsInfluence) * 100;
                
                return (
                  <div key={factorName} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{factorName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          isPositive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {isPositive ? '✓ Улучшает' : '✗ Ухудшает'}
                        </span>
                        <span className={`text-base font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {influenceValue > 0 ? '+' : ''}{influenceValue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isPositive ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              <div className="text-xs text-slate-500 mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <span className="font-semibold text-blue-900">💡 Как читать:</span>
                <ul className="mt-1 ml-4 space-y-0.5">
                  <li>• Зелёные факторы улучшают ваше состояние (снижают Индекс Хупера)</li>
                  <li>• Красные факторы ухудшают состояние (повышают Индекс Хупера)</li>
                  <li>• Длина полосы показывает силу влияния относительно других</li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-slate-500">Нет активных факторов для анализа за прошлый день.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
