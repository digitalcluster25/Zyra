import React from 'react';

export const Formulas: React.FC = () => {
  return (
    <div className="w-full max-w-[85rem] px-2 sm:px-5 lg:px-8 mx-auto py-5 space-y-5">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">Формулы и алгоритмы</h1>
        <p className="text-sm text-gray-500">Все математические формулы, используемые в системе Zyra</p>
      </div>

      {/* Impulse Response Model */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex justify-center items-center size-12 bg-purple-100 rounded-lg">
              <svg className="size-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Модель Банистера (Impulse Response Model)</h2>
              <p className="text-sm text-gray-600">Научное обоснование: Fitness-Fatigue модель (1975, 1991)</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Formula 1 */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Остаточный эффект импульса</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                Effect(t) = k · magnitude · e<sup>-(t-s)/τ</sup>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>где:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>k</strong> — коэффициент усиления эффекта</li>
                  <li><strong>magnitude</strong> — величина импульса (sRPE, количество, продолжительность)</li>
                  <li><strong>t-s</strong> — время, прошедшее с момента импульса (в днях)</li>
                  <li><strong>τ</strong> (tau) — временная константа затухания (в днях)</li>
                </ul>
              </div>
            </div>

            {/* Formula 2 */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Динамический Wellness Score</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                Wellness(t) = Baseline + Σ PositiveEffects(t) - Σ NegativeEffects(t)
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>где:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Baseline</strong> — базовый уровень wellness (по умолчанию 100)</li>
                  <li><strong>PositiveEffects</strong> — сумма положительных остаточных эффектов всех импульсов</li>
                  <li><strong>NegativeEffects</strong> — сумма отрицательных остаточных эффектов всех импульсов</li>
                  <li><strong>Результат</strong> — ограничивается диапазоном [0, 100]</li>
                </ul>
              </div>
            </div>

            {/* Parameters */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-medium text-gray-800 mb-3">Параметры импульсов</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-2">Положительные эффекты (Фитнес):</p>
                  <ul className="list-disc list-inside ml-2 text-gray-600 space-y-1">
                    <li><strong>k_positive</strong>: коэффициент генерации адаптации</li>
                    <li><strong>τ_positive</strong>: ~42 дня (медленное затухание, ~6 недель)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Отрицательные эффекты (Усталость):</p>
                  <ul className="list-disc list-inside ml-2 text-gray-600 space-y-1">
                    <li><strong>k_negative</strong>: коэффициент генерации усталости</li>
                    <li><strong>τ_negative</strong>: ~7 дней (быстрое затухание, ~1 неделя)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Athlete Monitoring */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex justify-center items-center size-12 bg-blue-100 rounded-lg">
              <svg className="size-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Мониторинг атлетов</h2>
              <p className="text-sm text-gray-600">Метрики Хупера и модель Банистера для тренировочной нагрузки</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Hooper Index */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Индекс Хупера (Hooper Index)</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                HI = sleepQuality + fatigue + muscleSoreness + stress + mood
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Диапазон:</strong> 5 (идеально) - 35 (критично)</p>
                <p className="mt-2">Простая сумма 5 субъективных метрик без весов. Используется для быстрой оценки текущего состояния спортсмена.</p>
              </div>
            </div>

            {/* sRPE */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Тренировочная нагрузка (sRPE)</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                TrainingLoad = duration (мин) × RPE
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>где:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>duration</strong> — длительность тренировки в минутах</li>
                  <li><strong>RPE</strong> — субъективная оценка интенсивности (0-10)</li>
                </ul>
                <p className="mt-2">Метод session Rating of Perceived Exertion — научно валидированный способ оценки нагрузки.</p>
              </div>
            </div>

            {/* CTL */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Chronic Training Load (CTL) — "Фитнес"</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                CTL = previousCTL × e<sup>-1/τ</sup> + dailyLoad × (1 - e<sup>-1/τ</sup>)
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>где:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>τ</strong> = 42 дня (константа времени для долгосрочной адаптации)</li>
                  <li><strong>previousCTL</strong> — CTL предыдущего дня</li>
                  <li><strong>dailyLoad</strong> — нагрузка текущего дня</li>
                </ul>
                <p className="mt-2">Экспоненциально взвешенное скользящее среднее с периодом 42 дня.</p>
              </div>
            </div>

            {/* ATL */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Acute Training Load (ATL) — "Усталость"</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                ATL = previousATL × e<sup>-1/τ</sup> + dailyLoad × (1 - e<sup>-1/τ</sup>)
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>где:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>τ</strong> = 7 дней (константа времени для краткосрочной усталости)</li>
                  <li><strong>previousATL</strong> — ATL предыдущего дня</li>
                  <li><strong>dailyLoad</strong> — нагрузка текущего дня</li>
                </ul>
                <p className="mt-2">Экспоненциально взвешенное скользящее среднее с периодом 7 дней.</p>
              </div>
            </div>

            {/* TSB */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Training Stress Balance (TSB) — "Форма"</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                TSB = CTL - ATL
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Баланс между долгосрочным фитнесом и краткосрочной усталостью.</p>
                <div className="mt-3 space-y-1">
                  <p><strong>Интерпретация:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    <li>TSB {'>'} 0: хорошая форма, готовность к нагрузкам</li>
                    <li>TSB ≈ 0: баланс нагрузки и восстановления</li>
                    <li>TSB {'<'} 0: накопленная усталость, нужно восстановление</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Score */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex justify-center items-center size-12 bg-green-100 rounded-lg">
              <svg className="size-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Recovery Score (Балл восстановления)</h2>
              <p className="text-sm text-gray-600">Комплексная оценка готовности к нагрузкам</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Current Recovery Score */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Текущий балл восстановления</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                <div>R<sub>frac</sub> = 0.75 × S + 0.25 × L<sub>norm</sub> + F<sub>frac</sub></div>
                <div className="mt-2">R<sub>1-7</sub> = 1 + 6 × clamp(R<sub>frac</sub>, 0, 1)</div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>где:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>S</strong> — субъективная компонента (среднее метрик)</li>
                  <li><strong>L<sub>norm</sub></strong> — компонента нагрузки (штраф за тренировку)</li>
                  <li><strong>F<sub>frac</sub></strong> — корректировка от факторов</li>
                </ul>
              </div>
            </div>

            {/* Subjective Component */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Субъективная компонента (S)</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                <div>S = (sleep<sub>n</sub> + energy<sub>n</sub> + soreness<sub>n</sub> + stress<sub>n</sub> + mood<sub>n</sub> + focus<sub>n</sub> + motivation<sub>n</sub>) / 7</div>
                <div className="mt-2">normalize(val) = (val - 1) / 6</div>
                <div className="mt-2">soreness<sub>n</sub> = 1 - normalize(muscleSoreness) <span className="text-gray-500">// инвертирована</span></div>
                <div>stress<sub>n</sub> = 1 - normalize(stressLevel) <span className="text-gray-500">// инвертирована</span></div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Среднее нормализованных (0-1) субъективных метрик. Боль в мышцах и стресс инвертированы.</p>
              </div>
            </div>

            {/* Load Component */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Компонента нагрузки (L<sub>norm</sub>)</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                <div>tss<sub>n</sub> = normalize(tss)</div>
                <div className="mt-2">L<sub>norm</sub> = clamp(1 - 0.6 × tss<sub>n</sub>, 0, 1)</div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Штраф за тренировочную нагрузку. Высокий TSS снижает текущий балл восстановления.</p>
              </div>
            </div>

            {/* Factor Correction */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Корректировка факторов (F<sub>frac</sub>)</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                F<sub>frac</sub> = Σ weight<sub>j</sub>
              </div>
              <div className="text-sm text-gray-600">
                <p>Сумма весов выбранных факторов. Положительные факторы повышают балл, отрицательные — снижают.</p>
              </div>
            </div>

            {/* Predicted Score */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-gray-800 mb-3">Прогноз на завтра</h3>
              <div className="font-mono text-sm bg-white p-4 rounded border border-gray-300 mb-3">
                <div>R<sub>recov</sub> = R<sub>frac</sub> + k × (1 - R<sub>frac</sub>)</div>
                <div className="mt-2">P = λ × tss<sub>n</sub></div>
                <div className="mt-2">F<sub>t+1</sub> = Σ (w<sub>j</sub> × e<sup>-24/τ<sub>j</sub></sup>)</div>
                <div className="mt-2">R<sub>predicted</sub> = 1 + 6 × clamp(R<sub>recov</sub> - P + F<sub>t+1</sub>, 0, 1)</div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Константы:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>k</strong> = 0.20 (коэффициент естественного восстановления)</li>
                  <li><strong>λ</strong> = 0.12 (штраф за нагрузку на следующий день)</li>
                  <li><strong>τ<sub>j</sub></strong> — период полураспада фактора j (в часах)</li>
                </ul>
              </div>
            </div>

            {/* Interpretation */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3">Интерпретация балла (1-7)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-200 rounded">
                  <span className="font-semibold text-emerald-700">{'>'} 6.0</span>
                  <span className="text-gray-700">Отлично — можно тренироваться интенсивно</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded">
                  <span className="font-semibold text-green-700">5.0-6.0</span>
                  <span className="text-gray-700">Хорошее — легкая или средняя активность</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <span className="font-semibold text-yellow-700">4.0-5.0</span>
                  <span className="text-gray-700">Умеренное — лучше восстановиться</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-red-50 border border-red-200 rounded">
                  <span className="font-semibold text-red-700">{'<'} 4.0</span>
                  <span className="text-gray-700">Переутомление — отдых, сон, релаксация</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex justify-center items-center size-12 bg-amber-100 rounded-lg">
              <svg className="size-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Примечания к реализации</h2>
              <p className="text-sm text-gray-600">Технические детали и источники</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Научное обоснование</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Модель Банистера (Fitness-Fatigue): Banister et al., 1975, 1991</li>
                <li>Индекс Хупера: Hooper & Mackinnon, 1995</li>
                <li>sRPE метод: Foster et al., 2001</li>
                <li>CTL/ATL/TSB: Coggan & Allen, TrainingPeaks модель</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Файлы реализации</h3>
              <ul className="list-disc list-inside space-y-1 font-mono text-xs">
                <li>backend/src/services/impulseResponseModel.ts</li>
                <li>backend/src/services/athleteMonitoring.ts</li>
                <li>utils/athleteMonitoring.ts</li>
                <li>components/CheckInFlow.tsx</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Типы импульсов</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Тренировочный импульс:</strong> magnitude = duration × RPE (sRPE)</li>
                <li><strong>Количественные факторы:</strong> magnitude рассчитывается по duration, intensity, quantity</li>
                <li><strong>Бинарные факторы:</strong> magnitude = 1.0 (присутствие/отсутствие)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

