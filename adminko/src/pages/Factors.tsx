import React, { useState, useEffect } from 'react';
import { factorsAPI } from '../services/api';
import type { Factor } from '../types/index';

export const Factors: React.FC = () => {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFactor, setEditingFactor] = useState<Factor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFactors();
  }, []);

  useEffect(() => {
    // Инициализация Preline после рендера
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [showCreateModal, editingFactor]);

  const loadFactors = async () => {
    try {
      setIsLoading(true);
      const response = await factorsAPI.getAll();
      const factorsData = response.data.data?.factors || response.data.data || response.data;
      setFactors(Array.isArray(factorsData) ? factorsData : []);
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

  const toggleFactorSelection = (factorId: string) => {
    const newSet = new Set(selectedFactors);
    if (newSet.has(factorId)) {
      newSet.delete(factorId);
    } else {
      newSet.add(factorId);
    }
    setSelectedFactors(newSet);
  };

  const toggleAllFactors = () => {
    if (selectedFactors.size === factors.length) {
      setSelectedFactors(new Set());
    } else {
      setSelectedFactors(new Set(factors.map(f => f.id)));
    }
  };

  const filteredFactors = factors.filter(factor =>
    factor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    factor.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[85rem] px-2 sm:px-5 lg:px-8 mx-auto py-5 space-y-5">
      {/* Page Header */}
      <div className="flex justify-between items-center gap-x-5">
        <h2 className="block font-medium text-lg sm:text-xl text-gray-800">
          Факторы
        </h2>

        <div className="flex justify-end items-center gap-x-2">
          {/* Search Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => document.getElementById('factor-search-input')?.focus()}
              className="size-8.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>

          {/* New Factor Button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="py-1.5 px-2.5 inline-flex items-center gap-x-1.5 text-sm rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Новый фактор
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
          <svg className="shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          id="factor-search-input"
          type="text"
          className="py-2.5 sm:py-3 px-4 ps-10 block w-full sm:text-sm input-border"
          placeholder="Поиск по названию или ключу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="border-t border-gray-200 divide-x divide-gray-200">
                <th scope="col" className="px-3 py-2.5 text-start">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-blue-600 checked:border-blue-600 focus:ring-blue-500"
                    checked={selectedFactors.size === factors.length && factors.length > 0}
                    onChange={toggleAllFactors}
                  />
                </th>

                <th scope="col" className="min-w-60">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500">
                      Название
                    </span>
                  </div>
                </th>

                <th scope="col">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500">
                      Ключ
                    </span>
                  </div>
                </th>

                <th scope="col">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500">
                      Вес
                    </span>
                  </div>
                </th>

                <th scope="col">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500">
                      Tau (ч)
                    </span>
                  </div>
                </th>

                <th scope="col">
                  <div className="ps-4 pe-2 flex items-center gap-x-3">
                    <span className="py-2.5 text-start text-sm font-normal text-gray-500">
                      Статус
                    </span>
                  </div>
                </th>

                <th scope="col" className="px-3 py-2.5 text-end">
                  <span className="text-sm font-normal text-gray-500">Действия</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Загрузка...
                  </td>
                </tr>
              ) : filteredFactors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Факторы не найдены
                  </td>
                </tr>
              ) : (
                filteredFactors.map((factor) => (
                  <tr key={factor.id} className="divide-x divide-gray-200">
                    <td className="size-px whitespace-nowrap px-3 py-4">
                      <input
                        type="checkbox"
                        className="shrink-0 border-gray-300 rounded-sm text-blue-600 checked:border-blue-600 focus:ring-blue-500"
                        checked={selectedFactors.has(factor.id)}
                        onChange={() => toggleFactorSelection(factor.id)}
                      />
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className="font-medium text-sm text-gray-800">
                        {factor.name}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className="text-sm text-gray-600 font-mono">
                        {factor.key}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className={`text-sm font-semibold ${
                        factor.weight > 0
                          ? 'text-green-600'
                          : factor.weight < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}>
                        {factor.weight > 0 ? '+' : ''}{factor.weight}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {factor.tau}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium ${
                        factor.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {factor.is_active ? '✓ Активен' : '✗ Неактивен'}
                      </span>
                    </td>

                    <td className="size-px whitespace-nowrap py-3 px-4">
                      <div className="flex justify-end items-center gap-x-1">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingFactor(factor)}
                          className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(factor.id)}
                          className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-red-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

  useEffect(() => {
    // Показать модалку
    const modal = document.getElementById('factor-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('open');
    }
  }, []);

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

  const handleClose = () => {
    const modal = document.getElementById('factor-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('open');
    }
    onClose();
  };

  return (
    <div
      id="factor-modal"
      className="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="factor-modal-label"
    >
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
          <h3 id="factor-modal-label" className="font-semibold text-gray-800">
            {factor ? 'Редактировать фактор' : 'Создать фактор'}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
          >
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-gray-800 mb-2">
                Ключ (key)
              </label>
              <input
                id="key"
                type="text"
                className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border font-mono"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                disabled={!!factor || isLoading}
                placeholder="lack_sleep"
                required
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1">Уникальный идентификатор (snake_case)</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
                Название
              </label>
              <input
                id="name"
                type="text"
                className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                placeholder="Недосып"
                required
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-800 mb-2">
                  Вес (weight)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.01"
                  className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  ± влияние на состояние
                </p>
              </div>

              <div>
                <label htmlFor="tau" className="block text-sm font-medium text-gray-800 mb-2">
                  Tau (часов)
                </label>
                <input
                  id="tau"
                  type="number"
                  className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm input-border"
                  value={formData.tau}
                  onChange={(e) => setFormData({ ...formData, tau: e.target.value })}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Период полувывода
                </p>
              </div>
            </div>

            <div className="flex items-center gap-x-3">
              <input
                id="is_active"
                type="checkbox"
                className="shrink-0 border-gray-300 rounded-sm text-blue-600 checked:border-blue-600 focus:ring-blue-500"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                disabled={isLoading}
              />
              <label htmlFor="is_active" className="text-sm text-gray-800">
                Активен
              </label>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
