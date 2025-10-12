import { useState, useEffect } from 'react';
import { checkInsAPI } from '../services/api';
import { CheckInRecord } from '../types';

export const useCheckIns = () => {
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCheckIns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await checkInsAPI.getAll();
      setCheckIns(response.data.data);
    } catch (err: any) {
      console.error('Failed to load check-ins:', err);
      setError(err.response?.data?.error || 'Failed to load check-ins');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCheckIns();
  }, []);

  const addCheckIn = async (data: any) => {
    try {
      const response = await checkInsAPI.create(data);
      setCheckIns((prev) => [response.data.data, ...prev]);
      return response.data.data;
    } catch (err: any) {
      console.error('Failed to create check-in:', err);
      throw err.response?.data?.error || 'Failed to create check-in';
    }
  };

  const updateCheckIn = async (id: string, data: any) => {
    try {
      const response = await checkInsAPI.update(id, data);
      setCheckIns((prev) =>
        prev.map((checkIn) => (checkIn.id === id ? response.data.data : checkIn))
      );
      return response.data.data;
    } catch (err: any) {
      console.error('Failed to update check-in:', err);
      throw err.response?.data?.error || 'Failed to update check-in';
    }
  };

  const deleteCheckIn = async (id: string) => {
    try {
      await checkInsAPI.delete(id);
      setCheckIns((prev) => prev.filter((checkIn) => checkIn.id !== id));
    } catch (err: any) {
      console.error('Failed to delete check-in:', err);
      throw err.response?.data?.error || 'Failed to delete check-in';
    }
  };

  const importCheckIns = async (oldCheckIns: CheckInRecord[]) => {
    try {
      await checkInsAPI.import(oldCheckIns);
      await loadCheckIns(); // Перезагрузить после импорта
    } catch (err: any) {
      console.error('Failed to import check-ins:', err);
      throw err.response?.data?.error || 'Failed to import check-ins';
    }
  };

  return {
    checkIns,
    isLoading,
    error,
    addCheckIn,
    updateCheckIn,
    deleteCheckIn,
    importCheckIns,
    refresh: loadCheckIns,
  };
};

