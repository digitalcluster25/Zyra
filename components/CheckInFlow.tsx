import React, { useState } from 'react';
import { CheckInData, CheckInRecord, Factor } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface CheckInFlowProps {
  onCheckInComplete: (record: CheckInRecord) => void;
  factors: Factor[];
}

const initialCheckInData: CheckInData = {
  sleepQuality: 4,
  energyLevel: 4,
  muscleSoreness: 1,
  stressLevel: 4,
  mood: 4,
  focus: 4,
  motivation: 4,
  tss: 4,
  factors: [],
};

const sleepQualityLabels = ["Ужасно", "Плохо", "Так себе", "Нормально", "Хорошо", "Отлично", "Идеально"];
const energyLevelLabels = ["Истощение", "Вялость", "Низкий тонус", "Нормально", "Бодрость", "Энергичность", "На пике"];
const muscleSorenessLabels = ["Нет боли", "Слабая", "Ноющая", "Средняя", "Сильная", "Мешает", "Острая"];
const stressLevelLabels = ["Спокойствие", "Расслаблен", "Небольшой", "Напряжение", "Стресс", "Сильный", "На грани"];
const moodLabels = ["Подавленное", "Грустное", "Так себе", "Нейтрально", "Хорошее", "Радостное", "Отличное"];
const focusLabels = ["Рассеян", "Отвлекаюсь", "Средне", "Нормально", "Собран", "Сфокусирован", "Поток"];
const motivationLabels = ["Нет желания", "Неохотно", "С трудом", "Нейтрально", "Есть желание", "Мотивирован", "Заряжен"];
const tssLabels = ["Отдых", "Очень легко", "Легко", "Средне", "Тяжело", "Очень тяжело", "Максимум"];

interface OptionSelectorProps {
  options: number[];
  selectedValue: number;
  onSelect: (value: number) => void;
  labels: string[];
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ options, selectedValue, onSelect, labels }) => {
  return (
    <div className="flex justify-between items-start space-x-1">
      {options.map((option, index) => (
        <div key={option} className="flex flex-col items-center flex-1 text-center">
          <Button
            type="button"
            onClick={() => onSelect(option)}
            variant={selectedValue === option ? "default" : "outline"}
            size="sm"
            className="w-10 h-10 mb-2"
          >
            {option}
          </Button>
          <p className="text-xs text-slate-500 leading-tight">
            {labels[index]}
          </p>
        </div>
      ))}
    </div>
  );
};

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const CheckInFlow: React.FC<CheckInFlowProps> = ({ onCheckInComplete, factors }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CheckInData>(initialCheckInData);
  const totalSteps = 10; 

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleDataChange = <K extends keyof CheckInData,>(field: K, value: CheckInData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFactorSelection = (value: string) => {
    const currentValues = data.factors;
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleDataChange('factors', newValues);
  };

  const calculateRecoveryScore = (d: CheckInData, allFactors: Factor[]): number => {
    // 1. Normalize survey data (1-7 scale) to 0-1 range
    const normalize = (val: number) => (val - 1) / 6;
    const sleep_n = normalize(d.sleepQuality);
    const energy_n = normalize(d.energyLevel);
    const soreness_n = 1 - normalize(d.muscleSoreness); // Inverted
    const stress_n = 1 - normalize(d.stressLevel);     // Inverted
    const mood_n = normalize(d.mood);
    const focus_n = normalize(d.focus);
    const motivation_n = normalize(d.motivation);
    const tss_n = normalize(d.tss);

    // 2. Calculate Subjective Component (S)
    const S = (sleep_n + energy_n + soreness_n + stress_n + mood_n + focus_n + motivation_n) / 7;

    // 3. Calculate Factor Correction (F_frac)
    const factorsMap = new Map(allFactors.map(f => [f.name, f]));
    const F_frac = d.factors.reduce((acc, factorName) => {
        const factor = factorsMap.get(factorName);
        // Assuming t_j=0 for a fresh check-in, decay is 1. Weight is w_j = W_j / 100
        return acc + (factor ? factor.weight : 0);
    }, 0);

    // 4. Calculate Load Component (L_norm)
    const L_norm = clamp(1 - 0.6 * tss_n, 0, 1);
    
    // 5. Calculate Final Normalized Score (R_frac)
    const R_frac = clamp(0.75 * S + 0.25 * L_norm + F_frac, 0, 1);

    // 6. Map to 1-7 scale
    const R_1_7 = 1 + 6 * R_frac;

    return clamp(R_1_7, 1, 7);
  };


  const handleSubmit = () => {
    const recoveryScore = calculateRecoveryScore(data, factors);
    const newRecord: CheckInRecord = {
      id: new Date().toISOString(),
      data: data,
      recoveryScore: recoveryScore
    };
    onCheckInComplete(newRecord);
  };


  const renderStep = () => {
    const options1to7 = Array.from({ length: 7 }, (_, i) => i + 1);
    switch(step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Качество сна</h2>
            <p className="text-slate-500 mb-6">Как ты оцениваешь качество своего сна прошлой ночью?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.sleepQuality} 
              onSelect={(val) => handleDataChange('sleepQuality', val)}
              labels={sleepQualityLabels}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Уровень энергии</h2>
            <p className="text-slate-500 mb-6">Насколько у тебя сейчас есть энергия для активностей?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.energyLevel} 
              onSelect={(val) => handleDataChange('energyLevel', val)}
              labels={energyLevelLabels}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Боль в мышцах</h2>
            <p className="text-slate-500 mb-6">Насколько сильно болят мышцы?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.muscleSoreness} 
              onSelect={(val) => handleDataChange('muscleSoreness', val)}
              labels={muscleSorenessLabels}
            />
          </div>
        );
      case 4:
        return (
           <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Уровень стресса</h2>
            <p className="text-slate-500 mb-6">Какой у тебя уровень стресса сегодня?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.stressLevel} 
              onSelect={(val) => handleDataChange('stressLevel', val)}
              labels={stressLevelLabels}
            />
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Настроение</h2>
            <p className="text-slate-500 mb-6">Какое у тебя настроение?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.mood} 
              onSelect={(val) => handleDataChange('mood', val)}
              labels={moodLabels}
            />
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Концентрация</h2>
            <p className="text-slate-500 mb-6">Насколько легко тебе сейчас концентрироваться?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.focus} 
              onSelect={(val) => handleDataChange('focus', val)}
              labels={focusLabels}
            />
          </div>
        );
      case 7:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Мотивация</h2>
            <p className="text-slate-500 mb-6">Насколько тебе хочется тренироваться или быть активным?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.motivation} 
              onSelect={(val) => handleDataChange('motivation', val)}
              labels={motivationLabels}
            />
          </div>
        );
      case 8:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Интенсивность тренировки (TSS)</h2>
            <p className="text-slate-500 mb-6">Как ты оцениваешь интенсивность твоей последней тренировки?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.tss} 
              onSelect={(val) => handleDataChange('tss', val)}
              labels={tssLabels}
            />
          </div>
        );
      case 9:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Внешние факторы</h2>
            <p className="text-slate-500 mb-6">Выберите факторы, которые могли на вас повлиять сегодня.</p>
            <div className="flex flex-wrap gap-3">
              {factors.map(factor => (
                <Button
                  key={factor.id}
                  type="button"
                  onClick={() => toggleFactorSelection(factor.name)}
                  variant={data.factors.includes(factor.name) ? "default" : "outline"}
                  size="sm"
                >
                  {factor.name}
                </Button>
              ))}
            </div>
          </div>
        );
      case 10:
        const score = calculateRecoveryScore(data, factors);
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Готовы завершить?</h2>
            <p className="text-slate-500 mb-6">Вот сводка вашего чекина и рассчитанный балл восстановления.</p>
            <div className="p-6 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-700">Ваш балл (1-7)</h3>
              <p className={`text-4xl font-bold ${score < 4 ? 'text-destructive' : score < 5 ? 'text-muted-foreground' : 'text-primary'}`}>{score.toFixed(1)}</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-slate-50 p-4 sm:p-8 rounded-xl border border-slate-200 max-w-2xl mx-auto">
      <div className="mb-6">
        <Progress value={(step / totalSteps) * 100} className="bg-slate-200" />
      </div>
      <div className="mb-8 min-h-[220px] flex flex-col justify-center">
        {renderStep()}
      </div>
      <div className="flex justify-between items-center">
        {step > 1 ? (
          <Button
            onClick={handleBack}
            variant="outline"
          >
            Назад
          </Button>
        ) : <div />}
        
        {step < totalSteps ? (
          <Button
            onClick={handleNext}
            size="lg"
          >
            Далее
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            size="lg"
          >
            Завершить чекин
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckInFlow;
