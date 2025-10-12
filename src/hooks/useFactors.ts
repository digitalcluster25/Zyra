import { useState, useEffect } from 'react';
import { factorsAPI } from '../services/api';
import { Factor } from '../types';

export const useFactors = () => {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFactors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await factorsAPI.getAll();
      setFactors(response.data.data);
    } catch (err: any) {
      console.error('Failed to load factors:', err);
      setError(err.response?.data?.error || 'Failed to load factors');
      
      // Fallback к localStorage если API недоступен
      const storedFactors = localStorage.getItem('factors');
      if (storedFactors) {
        setFactors(JSON.parse(storedFactors));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFactors();
  }, []);

  return {
    factors,
    isLoading,
    error,
    refresh: loadFactors,
  };
};

