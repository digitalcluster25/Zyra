import React, { useState, useEffect } from 'react';
import api from '../src/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface FactorContribution {
  factorId: string;
  factorName?: string;
  positive: number;
  negative: number;
  netEffect: number;
}

interface WellnessData {
  wellness: number;
  positiveEffects: number;
  negativeEffects: number;
  breakdown: FactorContribution[];
}

/**
 * Компонент декомпозиции Wellness Score
 * Показывает вклад каждого фактора в текущее состояние
 * Разделяет на положительные и отрицательные компоненты
 */
export const WellnessDecomposition: React.FC = () => {
  const [data, setData] = useState<WellnessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/analytics/current-breakdown');
      setData(response.data.data);
    } catch (err: any) {
      console.error('Failed to load wellness breakdown:', err);
      setError(err.response?.data?.error || 'Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500">Загрузка декомпозиции...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  // Фильтруем значимые факторы (с эффектом > 0.1)
  const positiveFactors = data.breakdown
    .filter(f => f.positive > 0.1)
    .sort((a, b) => b.positive - a.positive);
  
  const negativeFactors = data.breakdown
    .filter(f => f.negative > 0.1)
    .sort((a, b) => b.negative - a.negative);

  // Максимальные значения для масштабирования прогресс-баров
  const maxPositive = Math.max(...positiveFactors.map(f => f.positive), 1);
  const maxNegative = Math.max(...negativeFactors.map(f => f.negative), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Декомпозиция Wellness Score (Zyra 3.0)</CardTitle>
        <CardDescription>
          Импульсно-откликовая модель Банистера
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Текущий Wellness */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Текущий Wellness</span>
            <span className="text-3xl font-bold text-slate-900">{data.wellness.toFixed(1)}</span>
          </div>
          <Progress value={data.wellness} className="h-3" />
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>Низкий</span>
            <span>Средний</span>
            <span>Высокий</span>
          </div>
        </div>

        {/* Баланс эффектов */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs font-medium text-green-700 mb-1">Положительные эффекты</div>
            <div className="text-2xl font-bold text-green-900">
              +{data.positiveEffects.toFixed(1)}
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-xs font-medium text-red-700 mb-1">Отрицательные эффекты</div>
            <div className="text-2xl font-bold text-red-900">
              -{data.negativeEffects.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Положительные факторы */}
        {positiveFactors.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <span className="text-xl">✓</span>
              Положительные факторы ({positiveFactors.length})
            </h4>
            <div className="space-y-3">
              {positiveFactors.map((factor) => (
                <div key={factor.factorId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {factor.factorName || factor.factorId}
                    </span>
                    <span className="text-green-600 font-semibold">
                      +{factor.positive.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${(factor.positive / maxPositive) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Отрицательные факторы */}
        {negativeFactors.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <span className="text-xl">✗</span>
              Отрицательные факторы ({negativeFactors.length})
            </h4>
            <div className="space-y-3">
              {negativeFactors.map((factor) => (
                <div key={factor.factorId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {factor.factorName || factor.factorId}
                    </span>
                    <span className="text-red-600 font-semibold">
                      -{factor.negative.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${(factor.negative / maxNegative) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пояснение */}
        {(positiveFactors.length > 0 || negativeFactors.length > 0) && (
          <div className="text-xs text-slate-500 p-3 bg-blue-50 rounded border border-blue-200">
            <span className="font-semibold text-blue-900">💡 Импульсно-откликовая модель:</span>
            <ul className="mt-1 ml-4 space-y-0.5">
              <li>• Каждый фактор генерирует остаточные эффекты, затухающие со временем</li>
              <li>• Положительные эффекты (восстановление) затухают медленно (τ ≈ 14-42 дня)</li>
              <li>• Отрицательные эффекты (усталость) затухают быстрее (τ ≈ 6-18 дней)</li>
              <li>• Показаны эффекты от всех прошлых импульсов, влияющие на сегодня</li>
            </ul>
          </div>
        )}

        {/* Если нет данных */}
        {positiveFactors.length === 0 && negativeFactors.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p className="mb-2">Нет активных факторов</p>
            <p className="text-sm">
              Начните делать чекины, чтобы увидеть декомпозицию wellness
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WellnessDecomposition;

