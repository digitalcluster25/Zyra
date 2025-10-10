import React, { useState } from 'react';
import { Goal } from '../types';

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
                    <button
                        key={goal.id}
                        type="button"
                        onClick={() => toggleSelection(goal.title)}
                        className={`w-full flex items-center p-4 rounded-lg border-2 transition-all ${
                            selectedGoals.includes(goal.title)
                            ? 'border-primary bg-accent'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                        <span className="font-semibold text-slate-700">{goal.title}</span>
                    </button>
                )) : (
                     <div className="flex items-center justify-center h-full min-h-[150px]">
                        <p className="text-slate-500 text-center">У вас нет активных целей. <br/>Перейдите на страницу "Цели", чтобы добавить их.</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center">
                <button
                    onClick={onCancel}
                    className="text-slate-600 font-bold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Отмена
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                    disabled={selectedGoals.length === 0}
                >
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default LogGoalFlow;