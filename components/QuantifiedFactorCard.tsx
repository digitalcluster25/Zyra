import React from 'react';
import { Factor } from '../types';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export interface QuantifiedFactorValue {
  quantity?: number;
  duration?: number;
  intensity?: number;
}

interface QuantifiedFactorCardProps {
  factor: Factor;
  isSelected: boolean;
  value?: QuantifiedFactorValue;
  onChange: (value: QuantifiedFactorValue | null) => void;
}

/**
 * Компонент карточки фактора с количественным вводом
 * Поддерживает три типа данных: quantity, duration, intensity
 */
export const QuantifiedFactorCard: React.FC<QuantifiedFactorCardProps> = ({
  factor,
  isSelected,
  value = {},
  onChange,
}) => {
  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      // Инициализируем дефолтными значениями
      onChange({
        quantity: factor.requires_quantity ? 1 : undefined,
        duration: factor.requires_duration ? 30 : undefined,
        intensity: factor.requires_intensity ? 5 : undefined,
      });
    } else {
      onChange(null);
    }
  };

  const handleFieldChange = (field: keyof QuantifiedFactorValue, newValue: number) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const getFactorTypeLabel = (type?: string): string => {
    const labels: Record<string, string> = {
      'lifestyle_positive': '✓ Положительный',
      'lifestyle_negative': '✗ Отрицательный',
      'dual_nature': '⚖️ Двойственный',
    };
    return labels[type || ''] || 'Фактор';
  };

  const getQuantityLabel = (key: string): string => {
    if (key === 'alcohol') return 'Количество порций';
    if (key === 'caffeine_late') return 'Количество чашек';
    return 'Количество';
  };

  const getQuantityPlaceholder = (key: string): string => {
    if (key === 'alcohol') return '1, 2, 3...';
    if (key === 'caffeine_late') return '1, 2, 3...';
    return '1';
  };

  const getQuantityHint = (key: string): string => {
    if (key === 'alcohol') return '1 порция = 150мл вина / 350мл пива / 40мл крепкого';
    if (key === 'caffeine_late') return 'Кофе или чай после 16:00';
    return '';
  };

  const getRPELabel = (intensity: number): string => {
    if (intensity <= 2) return 'Очень легко';
    if (intensity <= 4) return 'Легко';
    if (intensity <= 6) return 'Средне';
    if (intensity <= 8) return 'Тяжело';
    return 'Максимум';
  };

  return (
    <Card 
      className={`transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-sm' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <CardContent className="p-4">
        {/* Header с Toggle */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1">
            <Switch
              checked={isSelected}
              onCheckedChange={handleToggle}
            />
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 text-sm">{factor.name}</h4>
              <p className="text-xs text-slate-500">{getFactorTypeLabel(factor.factor_type)}</p>
            </div>
          </div>
          {isSelected && (
            <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-100 rounded">
              Активен
            </span>
          )}
        </div>

        {/* Количественные поля (если фактор выбран) */}
        {isSelected && (
          <div className="space-y-3 mt-4 pl-0 animate-in fade-in duration-200 slide-in-from-top-2">
            {/* Количество (для алкоголя, кофеина) */}
            {factor.requires_quantity && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">
                  {getQuantityLabel(factor.key || factor.id)}
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={value.quantity || ''}
                  onChange={(e) => handleFieldChange('quantity', parseFloat(e.target.value) || 0)}
                  placeholder={getQuantityPlaceholder(factor.key || factor.id)}
                  className="h-10"
                />
                {getQuantityHint(factor.key || factor.id) && (
                  <p className="text-xs text-slate-500 italic">
                    {getQuantityHint(factor.key || factor.id)}
                  </p>
                )}
              </div>
            )}

            {/* Продолжительность (для медитации, массажа, прогулок) */}
            {factor.requires_duration && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">
                  Продолжительность (минут)
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="720"
                  step="5"
                  value={value.duration || ''}
                  onChange={(e) => handleFieldChange('duration', parseInt(e.target.value) || 0)}
                  placeholder="30"
                  className="h-10"
                />
                <p className="text-xs text-slate-500 italic">
                  Как долго длился фактор (от 1 до 720 минут)
                </p>
              </div>
            )}

            {/* Интенсивность (для походов, стресса, болезни) */}
            {factor.requires_intensity && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">
                  Интенсивность (RPE 0-10)
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={value.intensity || ''}
                    onChange={(e) => handleFieldChange('intensity', parseFloat(e.target.value) || 0)}
                    placeholder="5"
                    className="h-10 flex-1"
                  />
                  <span className="text-sm text-slate-600 font-medium whitespace-nowrap min-w-[100px]">
                    {getRPELabel(value.intensity || 5)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 italic">
                  0 = очень легко, 5 = средне, 10 = максимум
                </p>
              </div>
            )}

            {/* Если ни одно поле не требуется (только toggle) */}
            {!factor.requires_quantity && !factor.requires_duration && !factor.requires_intensity && (
              <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                ✓ Фактор отмечен. Дополнительные данные не требуются.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantifiedFactorCard;

