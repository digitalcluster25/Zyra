import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white p-8 rounded-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Контакты</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Свяжитесь с нами</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Мы всегда рады помочь вам с вопросами о сервисе ZYRA. Выберите удобный способ связи:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Email</h3>
                </div>
                <p className="text-sm text-slate-600">support@zyra.app</p>
                <p className="text-xs text-slate-500 mt-1">Ответим в течение 24 часов</p>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💬</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Telegram</h3>
                </div>
                <p className="text-sm text-slate-600">@zyra_support</p>
                <p className="text-xs text-slate-500 mt-1">Быстрая поддержка в мессенджере</p>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🐙</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">GitHub</h3>
                </div>
                <p className="text-sm text-slate-600">github.com/digitalcluster25/Zyra</p>
                <p className="text-xs text-slate-500 mt-1">Issues и Pull Requests</p>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🌐</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">Документация</h3>
                </div>
                <p className="text-sm text-slate-600">docs/pbr.md</p>
                <p className="text-xs text-slate-500 mt-1">Полная спецификация проекта</p>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Часто задаваемые вопросы</h2>
            
            <div className="space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium text-slate-700 hover:text-emerald-600">
                  Как хранятся мои данные?
                </summary>
                <p className="mt-2 text-sm text-slate-600 pl-4">
                  Все данные хранятся локально в вашем браузере (localStorage). Мы не передаём 
                  информацию на сервер и не имеем к ней доступа.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-slate-700 hover:text-emerald-600">
                  Можно ли экспортировать данные?
                </summary>
                <p className="mt-2 text-sm text-slate-600 pl-4">
                  Функция экспорта данных находится в разработке и появится в следующих версиях.
                </p>
              </details>

              <details className="group">
                <summary className="cursor-pointer font-medium text-slate-700 hover:text-emerald-600">
                  Как рассчитывается балл восстановления?
                </summary>
                <p className="mt-2 text-sm text-slate-600 pl-4">
                  Балл рассчитывается на основе научных формул с учётом субъективных метрик, 
                  тренировочной нагрузки и внешних факторов. Подробности в документации.
                </p>
              </details>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              <strong>Время работы поддержки:</strong> Пн-Пт, 10:00 - 18:00 (UTC+3)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

