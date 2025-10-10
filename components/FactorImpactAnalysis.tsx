import React, { useMemo } from 'react';
import { CheckInRecord, Factor } from '../types';

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
  const R_t = record_t.recoveryScore;
  const R_t_plus_1 = record_t_plus_1.recoveryScore;
  const delta_R = R_t_plus_1 - R_t;

  const Rn = (R_t - 1) / 6;
  const beta = 2.0;
  const nonlinearFactor = 1 - Math.exp(-beta * (1 - Rn));

  const activeFactorNames = record_t.data.factors;
  const factorsMap = new Map(allFactors.map(f => [f.name, f]));

  const activeFactorsWithInfluence = activeFactorNames.map(name => {
    const factor = factorsMap.get(name);
    if (!factor) return { name, influence: 0 };
    const influence = factor.weight * 1 * nonlinearFactor;
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
      <div className="bg-white p-6 rounded-xl border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Анализ влияния факторов</h3>
        <p className="text-slate-500">Завершите еще хотя бы один чекин, чтобы увидеть, как факторы влияют на ваше состояние.</p>
      </div>
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
    <div className="bg-white p-6 rounded-xl border border-slate-100">
      <h3 className="text-xl font-semibold text-slate-700 mb-2">Анализ влияния факторов</h3>
      <p className="text-slate-500 mb-4">
        {summaryText}
      </p>

      <div className="space-y-3">
        {influences.length > 0 ? influences.map(({ factorName, influenceValue }) => (
          <div key={factorName} className="flex items-center text-sm">
            <div className="w-1/3 truncate pr-2 text-slate-600">{factorName}</div>
            <div className="w-2/3 flex items-center">
              <div className="flex-1 h-6 bg-red-100 rounded-l-md flex justify-end">
                {influenceValue < 0 && (
                  <div
                    className="bg-red-400 h-6 rounded-l-md"
                    style={{ width: `${(Math.abs(influenceValue) / maxAbsInfluence) * 100}%` }}
                  ></div>
                )}
              </div>
              <div className="flex-1 h-6 bg-emerald-100 rounded-r-md">
                {influenceValue > 0 && (
                  <div
                    className="bg-emerald-400 h-6 rounded-r-md"
                    style={{ width: `${(influenceValue / maxAbsInfluence) * 100}%` }}
                  ></div>
                )}
              </div>
              <span className={`w-16 text-right font-semibold ml-2 ${influenceValue > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {influenceValue > 0 ? '+' : ''}{influenceValue.toFixed(2)}
              </span>
            </div>
          </div>
        )) : <p className="text-slate-500">Нет активных факторов для анализа за прошлый день.</p>}
      </div>
    </div>
  );
};
