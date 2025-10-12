import { useState, useEffect } from 'react';
import { goalsAPI } from '../services/api';

export interface Goal {
  id: string;
  name: string;
  deadline: string;
  category: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await goalsAPI.getAll();
      setGoals(response.data.data);
    } catch (err: any) {
      console.error('Failed to load goals:', err);
      setError(err.response?.data?.error || 'Failed to load goals');
      
      // Fallback к localStorage если API недоступен
      const storedGoals = localStorage.getItem('goals');
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      const response = await goalsAPI.create(goal);
      setGoals((prev) => [...prev, response.data.data]);
      return response.data.data;
    } catch (err: any) {
      console.error('Failed to create goal:', err);
      throw err.response?.data?.error || 'Failed to create goal';
    }
  };

  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    try {
      const response = await goalsAPI.update(id, goal);
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? response.data.data : g))
      );
      return response.data.data;
    } catch (err: any) {
      console.error('Failed to update goal:', err);
      throw err.response?.data?.error || 'Failed to update goal';
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await goalsAPI.delete(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      console.error('Failed to delete goal:', err);
      throw err.response?.data?.error || 'Failed to delete goal';
    }
  };

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refresh: loadGoals,
  };
};

