import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Контакты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Свяжитесь с нами</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Мы всегда рады помочь вам с вопросами о сервисе ZYRA. Выберите удобный способ связи:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:border-border/80 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-800">Email</h3>
                  </div>
                  <p className="text-sm text-slate-600">support@zyra.app</p>
                  <p className="text-xs text-slate-500 mt-1">Ответим в течение 24 часов</p>
                </CardContent>
              </Card>

              <Card className="hover:border-border/80 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-800">Telegram</h3>
                  </div>
                  <p className="text-sm text-slate-600">@zyra_support</p>
                  <p className="text-xs text-slate-500 mt-1">Быстрая поддержка в мессенджере</p>
                </CardContent>
              </Card>

              <Card className="hover:border-border/80 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-800">GitHub</h3>
                  </div>
                  <p className="text-sm text-slate-600">github.com/digitalcluster25/Zyra</p>
                  <p className="text-xs text-slate-500 mt-1">Issues и Pull Requests</p>
                </CardContent>
              </Card>

              <Card className="hover:border-border/80 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-800">Документация</h3>
                  </div>
                  <p className="text-sm text-slate-600">docs/pbr.md</p>
                  <p className="text-xs text-slate-500 mt-1">Полная спецификация проекта</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="pt-6 border-t border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Часто задаваемые вопросы</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Как хранятся мои данные?</AccordionTrigger>
                <AccordionContent>
                  Все данные хранятся локально в вашем браузере (localStorage). Мы не передаём 
                  информацию на сервер и не имеем к ней доступа.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Можно ли экспортировать данные?</AccordionTrigger>
                <AccordionContent>
                  Функция экспорта данных находится в разработке и появится в следующих версиях.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Как рассчитывается балл восстановления?</AccordionTrigger>
                <AccordionContent>
                  Балл рассчитывается на основе научных формул с учётом субъективных метрик, 
                  тренировочной нагрузки и внешних факторов. Подробности в документации.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <div className="pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              <strong>Время работы поддержки:</strong> Пн-Пт, 10:00 - 18:00 (UTC+3)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;

