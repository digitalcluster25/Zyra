import React, { useState } from 'react';
import { Goal } from '../types';

interface GoalsProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const Goals: React.FC<GoalsProps> = ({ goals, setGoals }) => {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');

  const toggleGoalActive = (id: string) => {
    setGoals(
      goals.map(goal =>
        goal.id === id ? { ...goal, active: !goal.active } : goal
      )
    );
  };

  const handleAddGoal = () => {
    if (newGoalTitle.trim() === '') return;
    if (goals.find(g => g.title.toLowerCase() === newGoalTitle.trim().toLowerCase())) {
        // Optionally, show an error to the user
        setNewGoalTitle('');
        setNewGoalDescription('');
        return;
    }

    const newGoal: Goal = {
      id: `custom-${Date.now()}`,
      title: newGoalTitle.trim(),
      description: newGoalDescription.trim(),
      active: true,
      isCustom: true,
    };
    setGoals(prev => [...prev, newGoal]);
    setNewGoalTitle('');
    setNewGoalDescription('');
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Ваши цели</h2>
        <p className="text-slate-500">Выберите направления, которые важны для вас прямо сейчас.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Добавить новую цель</h3>
        <div className="space-y-4">
            <input
              type="text"
              value={newGoalTitle}
              onChange={e => setNewGoalTitle(e.target.value)}
              placeholder="Название цели, например, 'Читать больше книг'"
              className="w-full p-2 border border-slate-300 rounded-md"
            />
            <textarea
              value={newGoalDescription}
              onChange={e => setNewGoalDescription(e.target.value)}
              placeholder="Краткое описание цели (необязательно)"
              className="w-full p-2 border border-slate-300 rounded-md"
              rows={2}
            />
            <button
              type="button"
              onClick={handleAddGoal}
              className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-md hover:bg-primary/90 disabled:bg-slate-300"
              disabled={!newGoalTitle.trim()}
            >
              Добавить цель
            </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Текущие цели</h3>
        <div className="space-y-4">
          {goals.map(goal => {
            return (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{goal.title}</h4>
                    {goal.description && <p className="text-sm text-slate-500">{goal.description}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-4 ml-4">
                  {goal.isCustom && (
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-sm text-red-500 hover:text-red-700 font-semibold"
                        aria-label={`Удалить цель ${goal.title}`}
                      >
                        Удалить
                      </button>
                    )}
                  <label htmlFor={`toggle-${goal.id}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`toggle-${goal.id}`}
                        className="sr-only peer"
                        checked={goal.active}
                        onChange={() => toggleGoalActive(goal.id)}
                      />
                      <div className="block w-14 h-8 rounded-full bg-slate-200 peer-checked:bg-primary"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-full"></div>
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Goals;