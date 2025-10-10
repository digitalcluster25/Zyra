import React from 'react';
import { Factor } from '../types';

interface FactorsProps {
  factors: Factor[];
  setFactors: React.Dispatch<React.SetStateAction<Factor[]>>;
}

const Factors: React.FC<FactorsProps> = ({ factors, setFactors }) => {

  const toggleFactorActive = (id: string) => {
    setFactors(
      factors.map(factor =>
        factor.id === id ? { ...factor, active: !factor.active } : factor
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Управление факторами</h2>
        <p className="text-slate-500">Включайте или отключайте факторы, доступные при чекине.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Текущие факторы</h3>
        <div className="space-y-3">
          {factors.map(factor => (
            <div key={factor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-700">{factor.name}</p>
              <div className="flex items-center space-x-4">
                <label htmlFor={`toggle-factor-${factor.id}`} className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`toggle-factor-${factor.id}`}
                      className="sr-only peer"
                      checked={factor.active}
                      onChange={() => toggleFactorActive(factor.id)}
                    />
                    <div className="block w-14 h-8 rounded-full bg-slate-200 peer-checked:bg-emerald-500"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-full"></div>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Factors;