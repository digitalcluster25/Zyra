import React, { useState } from 'react';
import { Goal } from '../types';
import { Button } from './ui/button';

interface LogGoalFlowProps {
  activeGoals: Goal[];
  onLogComplete: (goalTitles: string[]) => void;
  onCancel: () => void;
}

const LogGoalFlow: React.FC<LogGoalFlowProps> = ({ activeGoals, onLogComplete, onCancel }) => {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const toggleSelection = (title: string) => {
        setSelectedGoals(prev => 
            prev.includes(title) 
            ? prev.filter(t => t !== title) 
            : [...prev, title]
        );
    };

    const handleSubmit = () => {
        onLogComplete(selectedGoals);
    };

    return (
        <div className="bg-slate-50 p-4 sm:p-8 rounded-xl border border-slate-200 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-700 mb-2">Отметить прогресс по целям</h2>
                <p className="text-slate-500">Выберите цели, над которыми вы работали сегодня.</p>
            </div>
            <div className="mb-8 min-h-[200px] space-y-3">
                {activeGoals.length > 0 ? activeGoals.map(goal => (
                    <Button
                        key={goal.id}
                        type="button"
                        variant="outline"
                        onClick={() => toggleSelection(goal.title)}
                        className={`w-full flex items-center p-4 h-auto ${
                            selectedGoals.includes(goal.title)
                            ? 'border-primary bg-accent'
                            : ''
                        }`}
                    >
                        <span className="font-semibold">{goal.title}</span>
                    </Button>
                )) : (
                     <div className="flex items-center justify-center h-full min-h-[150px]">
                        <p className="text-slate-500 text-center">У вас нет активных целей. <br/>Перейдите на страницу "Цели", чтобы добавить их.</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                >
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={selectedGoals.length === 0}
                >
                    Сохранить
                </Button>
            </div>
        </div>
    );
};

export default LogGoalFlow;