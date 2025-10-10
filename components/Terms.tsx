import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Публичная оферта</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Общие положения</h2>
            <p className="leading-relaxed">
              Настоящая публичная оферта (далее — «Оферта») является официальным предложением 
              ZYRA (далее — «Сервис») заключить договор на оказание услуг по предоставлению 
              доступа к системе мониторинга и прогнозирования восстановления.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Предмет договора</h2>
            <p className="leading-relaxed">
              Сервис предоставляет пользователю доступ к веб-приложению для отслеживания 
              физического и ментального состояния, расчёта балла восстановления и получения 
              рекомендаций по тренировкам.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Хранение данных</h2>
            <p className="leading-relaxed">
              Все данные пользователя хранятся локально в браузере (localStorage) и не 
              передаются на сервер. Пользователь несёт полную ответственность за сохранность 
              своих данных.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Ограничение ответственности</h2>
            <p className="leading-relaxed">
              Сервис предоставляется «как есть». Рекомендации носят информационный характер 
              и не являются медицинскими назначениями. Перед началом тренировок рекомендуется 
              проконсультироваться с врачом.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Интеллектуальная собственность</h2>
            <p className="leading-relaxed">
              Все права на дизайн, код и алгоритмы принадлежат разработчикам ZYRA. 
              Использование материалов сервиса без разрешения запрещено.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Заключительные положения</h2>
            <p className="leading-relaxed">
              Используя сервис, пользователь подтверждает, что ознакомился с настоящей офертой 
              и принимает её условия в полном объёме.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Дата последнего обновления: 10 октября 2025 г.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;

