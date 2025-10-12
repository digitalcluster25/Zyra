import React, { useState, useEffect } from 'react';
import api from '../src/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface Recommendation {
  recommendedDate: string;
  readinessScore: number;
  reasoning: string;
  daysUntilOptimal: number;
}

/**
 * Компонент рекомендаций по следующей тренировке
 * На основе импульсно-откликовой модели
 */
export const TrainingRecommendation: React.FC = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendation();
  }, []);

  const loadRecommendation = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.get('/api/analytics/training-recommendation');
      setRecommendation(response.data.data);
    } catch (err: any) {
      console.error('Failed to load recommendation:', err);
      setError(err.response?.data?.error || 'Ошибка загрузки рекомендации');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500">Анализ готовности...</div>
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

  if (!recommendation) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500">
            Недостаточно данных для рекомендации
          </div>
        </CardContent>
      </Card>
    );
  }

  // Определяем цвет и иконку на основе готовности
  const getReadinessColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getReadinessIcon = (score: number) => {
    if (score >= 85) return '🟢';
    if (score >= 70) return '🟡';
    if (score >= 50) return '🟠';
    return '🔴';
  };

  const readinessClass = getReadinessColor(recommendation.readinessScore);
  const readinessIcon = getReadinessIcon(recommendation.readinessScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Рекомендация по тренировке</CardTitle>
        <CardDescription>
          На основе баланса фитнеса и усталости
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Уровень готовности */}
        <div className={`p-4 rounded-lg border ${readinessClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Уровень готовности</span>
            <span className="text-3xl">{readinessIcon}</span>
          </div>
          <div className="text-3xl font-bold">
            {recommendation.readinessScore.toFixed(1)}%
          </div>
        </div>

        {/* Рекомендуемая дата */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-sm font-medium text-slate-600 mb-1">
            Оптимальная дата для тренировки
          </div>
          <div className="text-xl font-bold text-slate-900 mb-2">
            {new Date(recommendation.recommendedDate).toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {recommendation.daysUntilOptimal > 0 && (
            <div className="text-sm text-slate-500">
              Через {recommendation.daysUntilOptimal} {recommendation.daysUntilOptimal === 1 ? 'день' : 'дней'}
            </div>
          )}
          {recommendation.daysUntilOptimal === 0 && (
            <div className="text-sm text-green-600 font-medium">
              Сегодня оптимально!
            </div>
          )}
        </div>

        {/* Объяснение */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-2">
            💡 Почему именно эта дата?
          </div>
          <p className="text-sm text-blue-800">
            {recommendation.reasoning}
          </p>
        </div>

        {/* Кнопка обновления */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={loadRecommendation}
          disabled={isLoading}
        >
          Обновить рекомендацию
        </Button>

        {/* Информация о модели */}
        <div className="text-xs text-slate-500">
          <p className="mb-1">
            <strong>Модель учитывает:</strong>
          </p>
          <ul className="ml-4 space-y-0.5">
            <li>• Текущий баланс фитнеса и усталости (TSB)</li>
            <li>• Затухание эффектов прошлых тренировок</li>
            <li>• Влияние факторов образа жизни</li>
            <li>• Индивидуальную скорость восстановления</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingRecommendation;

