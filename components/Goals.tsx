import React, { useState } from 'react';
import { Goal } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
      
      <Card>
        <CardHeader>
          <CardTitle>Добавить новую цель</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
              <div>
                <Label htmlFor="goal-title">Название цели</Label>
                <Input
                  id="goal-title"
                  type="text"
                  value={newGoalTitle}
                  onChange={e => setNewGoalTitle(e.target.value)}
                  placeholder="Например, 'Читать больше книг'"
                />
              </div>
              <div>
                <Label htmlFor="goal-description">Описание (необязательно)</Label>
                <Textarea
                  id="goal-description"
                  value={newGoalDescription}
                  onChange={e => setNewGoalDescription(e.target.value)}
                  placeholder="Краткое описание цели"
                  rows={2}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddGoal}
                disabled={!newGoalTitle.trim()}
              >
                Добавить цель
              </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Текущие цели</CardTitle>
        </CardHeader>
        <CardContent>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-destructive hover:text-destructive"
                          aria-label={`Удалить цель ${goal.title}`}
                        >
                          Удалить
                        </Button>
                      )}
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`toggle-${goal.id}`}
                        checked={goal.active}
                        onCheckedChange={() => toggleGoalActive(goal.id)}
                      />
                      <Label htmlFor={`toggle-${goal.id}`} className="cursor-pointer sr-only">
                        {goal.active ? 'Деактивировать' : 'Активировать'}
                      </Label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;