import React, { useState, useEffect } from 'react';
import { factorsAPI } from '../services/api';
import type { Factor } from '../types/index';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

export const Factors: React.FC = () => {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFactor, setEditingFactor] = useState<Factor | null>(null);

  useEffect(() => {
    loadFactors();
  }, []);

  const loadFactors = async () => {
    try {
      setIsLoading(true);
      const response = await factorsAPI.getAll();
      setFactors(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка загрузки факторов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот фактор?')) return;

    try {
      await factorsAPI.delete(id);
      loadFactors();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка удаления');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Факторы</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          + Создать фактор
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factors.map((factor) => (
          <Card key={factor.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{factor.name}</CardTitle>
                <Badge variant={factor.is_active ? 'default' : 'outline'}>
                  {factor.is_active ? 'Активен' : 'Неактивен'}
                </Badge>
              </div>
              <CardDescription className="text-xs font-mono">{factor.key}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Вес (weight):</span>
                <span className="font-semibold">{factor.weight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tau (полувывод):</span>
                <span className="font-semibold">{factor.tau}ч</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingFactor(factor)}
                >
                  Изменить
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(factor.id)}
                >
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingFactor) && (
        <FactorModal
          factor={editingFactor}
          onClose={() => {
            setShowCreateModal(false);
            setEditingFactor(null);
          }}
          onSave={() => {
            setShowCreateModal(false);
            setEditingFactor(null);
            loadFactors();
          }}
        />
      )}
    </div>
  );
};

// Modal Component
interface FactorModalProps {
  factor: Factor | null;
  onClose: () => void;
  onSave: () => void;
}

const FactorModal: React.FC<FactorModalProps> = ({ factor, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    key: factor?.key || '',
    name: factor?.name || '',
    weight: factor?.weight?.toString() || '0',
    tau: factor?.tau?.toString() || '24',
    is_active: factor?.is_active ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        key: formData.key,
        name: formData.name,
        weight: parseFloat(formData.weight),
        tau: parseInt(formData.tau),
        is_active: formData.is_active,
      };

      if (factor) {
        await factorsAPI.update(factor.id, payload);
      } else {
        await factorsAPI.create(payload);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{factor ? 'Редактировать фактор' : 'Создать фактор'}</CardTitle>
          <CardDescription>
            {factor ? 'Измените параметры фактора' : 'Заполните форму для создания нового фактора'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key">Ключ (key)</Label>
              <Input
                id="key"
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                disabled={!!factor || isLoading}
                placeholder="lack_sleep"
                required
              />
              <p className="text-xs text-slate-500">Уникальный идентификатор (snake_case)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                placeholder="Недосып"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Вес (weight)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-slate-500">
                Отрицательное значение ухудшает состояние, положительное - улучшает
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tau">Tau (период полувывода, часов)</Label>
              <Input
                id="tau"
                type="number"
                value={formData.tau}
                onChange={(e) => setFormData({ ...formData, tau: e.target.value })}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-slate-500">Время, за которое влияние фактора уменьшается вдвое</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                disabled={isLoading}
              />
              <Label htmlFor="is_active">Активен</Label>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

