import React, { useState } from 'react';
import { CheckInData, CheckInRecord, Factor, QuantifiedFactorValue } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AthleteMonitoringService } from '../utils/athleteMonitoring';
import QuantifiedFactorCard from './QuantifiedFactorCard';

interface CheckInFlowProps {
  onCheckInComplete: (record: CheckInRecord) => void;
  factors: Factor[];
  previousRecord?: CheckInRecord;
}

const initialCheckInData: CheckInData = {
  // Индекс Хупера (1=отлично, 7=ужасно)
  sleepQuality: 4,
  fatigue: 4,
  muscleSoreness: 4,
  stress: 4,
  mood: 4,
  // Дополнительные метрики
  focus: 4,
  motivation: 4,
  // sRPE
  hadTraining: false,
  trainingDuration: undefined,
  rpe: undefined,
  trainingLoad: 0,
  // Факторы
  factors: [],
  // Количественные факторы (Zyra 3.0 - Фаза 5)
  quantifiedFactors: {},
};

// ВАЖНО: Шкалы теперь инвертированы под Индекс Хупера
// 1 = отлично/нет проблем, 7 = ужасно/максимальная проблема
const sleepQualityLabels = ["Идеально", "Отлично", "Хорошо", "Нормально", "Так себе", "Плохо", "Ужасно"];
const fatigueLabels = ["Нет усталости", "Слегка устал", "Лёгкая усталость", "Средняя усталость", "Устал", "Очень устал", "Истощён"];
const muscleSorenessLabels = ["Нет боли", "Слабая", "Лёгкая", "Средняя", "Ноющая", "Сильная", "Острая боль"];
const stressLabels = ["Расслаблен", "Спокоен", "Лёгкое напряжение", "Умеренный стресс", "Напряжён", "Сильный стресс", "На грани"];
const moodLabels = ["Отличное", "Радостное", "Хорошее", "Нейтральное", "Так себе", "Грустное", "Подавленное"];
const focusLabels = ["Поток", "Сфокусирован", "Хорошо концентрируюсь", "Нормально", "Отвлекаюсь", "Рассеян", "Не могу сосредоточиться"];
const motivationLabels = ["Заряжен", "Мотивирован", "Есть желание", "Нейтрально", "С трудом", "Неохотно", "Нет желания"];

// RPE шкала Борга (0-10)
const rpeLabels = [
  "0 - Отдых",
  "1 - Очень легко",
  "2 - Легко",
  "3 - Умеренно",
  "4 - Несколько тяжело",
  "5 - Тяжело",
  "6",
  "7 - Очень тяжело",
  "8",
  "9 - Крайне тяжело",
  "10 - Максимум"
];

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

const CheckInFlow: React.FC<CheckInFlowProps> = ({ onCheckInComplete, factors, previousRecord }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CheckInData>(initialCheckInData);
  const totalSteps = 12; // 5 метрик Хупера + 2 доп метрики + 1 тренировка + длительность/RPE + факторы + итог

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

  // Обработчик для количественных факторов (Zyra 3.0 Фаза 5)
  const handleQuantifiedFactorChange = (factorId: string, value: QuantifiedFactorValue | null) => {
    setData(prev => {
      const newQuantifiedFactors = { ...prev.quantifiedFactors };
      if (value === null) {
        delete newQuantifiedFactors[factorId];
      } else {
        newQuantifiedFactors[factorId] = value;
      }
      return {
        ...prev,
        quantifiedFactors: newQuantifiedFactors,
      };
    });
  };

  const handleSubmit = () => {
    // Рассчитываем Training Load если была тренировка
    if (data.hadTraining && data.trainingDuration && data.rpe !== undefined) {
      data.trainingLoad = AthleteMonitoringService.calculateTrainingLoad(data.trainingDuration, data.rpe);
    }

    // Создаем новый чекин с расчетными показателями
    const newRecord = AthleteMonitoringService.createCheckInRecord(data, previousRecord);
    onCheckInComplete(newRecord);
  };

  const renderStep = () => {
    const options1to7 = Array.from({ length: 7 }, (_, i) => i + 1);
    const options0to10 = Array.from({ length: 11 }, (_, i) => i);

    switch(step) {
      // Метрика 1: Качество сна
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Качество сна</h2>
            <p className="text-slate-500 mb-2">Как вы оцениваете качество своего сна прошлой ночью?</p>
            <p className="text-xs text-slate-400 mb-6">1 = идеально выспался, 7 = ужасный сон</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.sleepQuality} 
              onSelect={(val) => handleDataChange('sleepQuality', val)}
              labels={sleepQualityLabels}
            />
          </div>
        );

      // Метрика 2: Усталость
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Уровень усталости</h2>
            <p className="text-slate-500 mb-2">Насколько вы устали прямо сейчас?</p>
            <p className="text-xs text-slate-400 mb-6">1 = нет усталости, 7 = полностью истощён</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.fatigue} 
              onSelect={(val) => handleDataChange('fatigue', val)}
              labels={fatigueLabels}
            />
          </div>
        );

      // Метрика 3: Боль в мышцах
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Боль в мышцах</h2>
            <p className="text-slate-500 mb-2">Насколько болят ваши мышцы?</p>
            <p className="text-xs text-slate-400 mb-6">1 = нет боли, 7 = острая боль</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.muscleSoreness} 
              onSelect={(val) => handleDataChange('muscleSoreness', val)}
              labels={muscleSorenessLabels}
            />
          </div>
        );

      // Метрика 4: Стресс
      case 4:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Уровень стресса</h2>
            <p className="text-slate-500 mb-2">Какой уровень стресса вы испытываете?</p>
            <p className="text-xs text-slate-400 mb-6">1 = расслаблен, 7 = на грани</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.stress} 
              onSelect={(val) => handleDataChange('stress', val)}
              labels={stressLabels}
            />
          </div>
        );

      // Метрика 5: Настроение
      case 5:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Настроение</h2>
            <p className="text-slate-500 mb-2">Какое у вас настроение?</p>
            <p className="text-xs text-slate-400 mb-6">1 = отличное, 7 = подавленное</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.mood} 
              onSelect={(val) => handleDataChange('mood', val)}
              labels={moodLabels}
            />
          </div>
        );

      // Доп метрика 6: Концентрация
      case 6:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Концентрация</h2>
            <p className="text-slate-500 mb-6">Насколько легко вам концентрироваться?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.focus || 4} 
              onSelect={(val) => handleDataChange('focus', val)}
              labels={focusLabels}
            />
          </div>
        );

      // Доп метрика 7: Мотивация
      case 7:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Мотивация</h2>
            <p className="text-slate-500 mb-6">Насколько вам хочется тренироваться?</p>
            <OptionSelector 
              options={options1to7} 
              selectedValue={data.motivation || 4} 
              onSelect={(val) => handleDataChange('motivation', val)}
              labels={motivationLabels}
            />
          </div>
        );

      // Шаг 8: Была ли тренировка?
      case 8:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Тренировка</h2>
            <p className="text-slate-500 mb-6">У вас была тренировка сегодня или вчера вечером?</p>
            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                onClick={() => {
                  handleDataChange('hadTraining', true);
                  handleNext();
                }}
                variant={data.hadTraining ? "default" : "outline"}
                size="lg"
                className="flex-1 h-24"
              >
                <span className="text-lg">Да, была тренировка</span>
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleDataChange('hadTraining', false);
                  handleDataChange('trainingDuration', undefined);
                  handleDataChange('rpe', undefined);
                  handleDataChange('trainingLoad', 0);
                  setStep(10); // Пропускаем шаги 9-10, идем к факторам
                }}
                variant={!data.hadTraining ? "default" : "outline"}
                size="lg"
                className="flex-1 h-24"
              >
                <span className="text-lg">Нет, не было</span>
              </Button>
            </div>
          </div>
        );

      // Шаг 9: Длительность тренировки (только если была тренировка)
      case 9:
        if (!data.hadTraining) {
          setStep(10);
          return null;
        }
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Длительность тренировки</h2>
            <p className="text-slate-500 mb-6">Сколько минут длилась ваша тренировка?</p>
            <div className="max-w-xs mx-auto">
              <Label htmlFor="duration" className="text-base mb-2 block">Минуты</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="600"
                value={data.trainingDuration || ''}
                onChange={(e) => handleDataChange('trainingDuration', parseInt(e.target.value) || undefined)}
                placeholder="Например: 60"
                className="text-lg h-14 text-center"
              />
              <p className="text-xs text-slate-400 mt-2 text-center">
                Обычно от 30 до 180 минут
              </p>
            </div>
          </div>
        );

      // Шаг 10: RPE (воспринимаемая нагрузка)
      case 10:
        if (!data.hadTraining) {
          setStep(11);
          return null;
        }
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Интенсивность тренировки</h2>
            <p className="text-slate-500 mb-2">Насколько тяжёлой была тренировка? (Шкала Борга RPE)</p>
            <p className="text-xs text-slate-400 mb-6">0 = отдых, 10 = максимальное усилие</p>
            <div className="grid grid-cols-11 gap-1">
              {options0to10.map((option) => (
                <div key={option} className="flex flex-col items-center text-center">
                  <Button
                    type="button"
                    onClick={() => handleDataChange('rpe', option)}
                    variant={data.rpe === option ? "default" : "outline"}
                    size="sm"
                    className="w-full h-12 mb-1"
                  >
                    {option}
                  </Button>
                  <p className="text-[8px] text-slate-400 leading-tight">
                    {rpeLabels[option].replace(`${option} - `, '')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      // Шаг 11: Факторы (Количественный ввод - Zyra 3.0 Фаза 5)
      case 11:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Факторы образа жизни</h2>
            <p className="text-slate-500 mb-6">
              Выберите факторы и укажите детали для более точного анализа
            </p>
            <div className="space-y-3 max-w-2xl mx-auto">
              {factors.filter(f => f.active !== false).map(factor => (
                <QuantifiedFactorCard
                  key={factor.id}
                  factor={factor}
                  isSelected={!!data.quantifiedFactors?.[factor.id]}
                  value={data.quantifiedFactors?.[factor.id]}
                  onChange={(value) => handleQuantifiedFactorChange(factor.id, value)}
                />
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 Zyra 3.0:</span> Количественные данные позволяют 
                импульсно-откликовой модели точнее рассчитать влияние факторов на ваше состояние.
              </p>
            </div>
          </div>
        );

      // Шаг 12: Итог
      case 12:
        const hooperIndex = AthleteMonitoringService.calculateHooperIndex(data);
        const interpretation = AthleteMonitoringService.interpretHooperIndex(hooperIndex);
        const trainingLoad = data.hadTraining && data.trainingDuration && data.rpe !== undefined
          ? AthleteMonitoringService.calculateTrainingLoad(data.trainingDuration, data.rpe)
          : 0;

        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Готовы завершить?</h2>
            <p className="text-slate-500 mb-6">Вот сводка вашего чекина и рассчитанные показатели.</p>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">Индекс Хупера</h3>
                    <p className="text-sm text-slate-500">{interpretation.description}</p>
                  </div>
                  <p className={`text-4xl font-bold ${
                    interpretation.level === 'excellent' || interpretation.level === 'good' ? 'text-primary' :
                    interpretation.level === 'moderate' ? 'text-yellow-600' :
                    interpretation.level === 'high' ? 'text-orange-600' :
                    'text-destructive'
                  }`}>
                    {hooperIndex}
                  </p>
                </div>
                
                {data.hadTraining && (
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">Тренировочная нагрузка</h3>
                      <p className="text-xs text-slate-500">{data.trainingDuration} мин × RPE {data.rpe}</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{trainingLoad.toFixed(0)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
              <p className="font-medium mb-1">Рекомендация:</p>
              <p>{interpretation.recommendation}</p>
            </div>
          </div>
        );

      default: 
        return null;
    }
  };

  return (
    <div className="bg-slate-50 p-4 sm:p-8 rounded-xl border border-slate-200 max-w-2xl mx-auto">
      <div className="mb-6">
        <Progress value={(step / totalSteps) * 100} className="bg-slate-200" />
        <p className="text-xs text-slate-400 mt-2 text-center">Шаг {step} из {totalSteps}</p>
      </div>
      <div className="mb-8 min-h-[280px] flex flex-col justify-center">
        {renderStep()}
      </div>
      <div className="flex justify-between items-center">
        {step > 1 && step !== 8 ? (
          <Button
            onClick={handleBack}
            variant="outline"
          >
            Назад
          </Button>
        ) : <div />}
        
        {step < totalSteps && step !== 8 ? (
          <Button
            onClick={handleNext}
            size="lg"
            disabled={
              (step === 9 && !data.trainingDuration) ||
              (step === 10 && data.rpe === undefined)
            }
          >
            Далее
          </Button>
        ) : step === 12 ? (
          <Button
            onClick={handleSubmit}
            size="lg"
          >
            Завершить чекин
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default CheckInFlow;
