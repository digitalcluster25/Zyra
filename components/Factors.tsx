import React from 'react';
import { Factor } from '../types';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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

      <Card>
        <CardHeader>
          <CardTitle>Текущие факторы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {factors.map(factor => (
              <div key={factor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <Label htmlFor={`toggle-factor-${factor.id}`} className="font-medium text-slate-700 cursor-pointer flex-1">
                  {factor.name}
                </Label>
                <Switch
                  id={`toggle-factor-${factor.id}`}
                  checked={factor.active}
                  onCheckedChange={() => toggleFactorActive(factor.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Factors;