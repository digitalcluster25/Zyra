# Быстрый старт с Preline в Zyra Admin

## ✅ Что сделано

1. **Установлена библиотека Preline** (`npm install preline`)
2. **Настроен Tailwind CSS** (добавлен путь к Preline и плагин)
3. **Добавлен импорт в main.tsx** (`import 'preline/preline'`)
4. **Создана страница витрины** (`/showcase`) с примерами всех компонентов
5. **Удалены конфликтующие стили shadcn/ui**
6. **Добавлены TypeScript типы** для Preline

## 🎯 Доступ к витрине

Откройте: **http://localhost:5173/showcase**

Или через навигацию: **Zyra Admin → 🎨 Preline**

## 📦 Доступные компоненты

### Базовые элементы
- ✅ **Buttons** - все типы кнопок (primary, secondary, ghost, danger)
- ✅ **Dropdowns** - выпадающие меню с автоматическим позиционированием
- ✅ **Modals** - модальные окна с анимациями
- ✅ **Alerts** - уведомления (info, success, warning, error)
- ✅ **Badges** - цветные метки и значки
- ✅ **Progress** - индикаторы прогресса

### Формы
- ✅ **Input** - текстовые поля
- ✅ **Textarea** - многострочные поля
- ✅ **Select** - выпадающие списки
- ✅ **Checkbox** - чекбоксы
- ✅ **Radio** - радио-кнопки
- ✅ **Toggle** - переключатели
- ✅ **File Input** - загрузка файлов
- ✅ **Advanced Select** - селект с поиском
- ✅ **Input Number** - числовое поле
- ✅ **Pin Input** - ввод PIN-кода

### Навигация
- ✅ **Tabs** - вкладки
- ✅ **Navbar** - навигационная панель
- ✅ **Sidebar** - боковое меню
- ✅ **Breadcrumbs** - хлебные крошки
- ✅ **Pagination** - пагинация
- ✅ **Stepper** - степпер для многошаговых форм

### Таблицы и данные
- ✅ **Basic Tables** - стандартные таблицы
- ✅ **Advanced Tables** - с сортировкой, фильтрами
- ✅ **Data Tables** - с пагинацией

### Дополнительно
- ✅ **Accordion** - аккордеон
- ✅ **Timeline** - таймлайн событий
- ✅ **Tooltips** - всплывающие подсказки
- ✅ **Popovers** - всплывающие окна
- ✅ **Cards** - карточки контента

## 🔧 Как использовать

### 1. Базовый пример - Кнопка
```tsx
<button 
  type="button" 
  className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
>
  Нажми меня
</button>
```

### 2. Dropdown (с инициализацией)
```tsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Инициализация после рендера
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

  return (
    <div className="hs-dropdown relative inline-flex">
      <button
        type="button"
        className="hs-dropdown-toggle py-3 px-4 bg-blue-600 text-white"
        data-hs-dropdown-toggle
      >
        Действия
      </button>
      <div className="hs-dropdown-menu hidden">
        <a href="#" className="block py-2 px-3">Пункт 1</a>
      </div>
    </div>
  );
}
```

### 3. Modal
```tsx
// Триггер модалки
<button data-hs-overlay="#my-modal">
  Открыть
</button>

// Сама модалка
<div id="my-modal" className="hs-overlay hidden ...">
  <div className="hs-overlay-open:opacity-100 ...">
    <div className="bg-white rounded-xl">
      {/* Контент */}
    </div>
  </div>
</div>
```

### 4. Tabs
```tsx
<nav className="flex gap-x-1" role="tablist">
  <button
    data-hs-tab="#tab-1"
    className="hs-tab-active:border-blue-600 active"
  >
    Вкладка 1
  </button>
  <button data-hs-tab="#tab-2">
    Вкладка 2
  </button>
</nav>

<div id="tab-1" role="tabpanel">Контент 1</div>
<div id="tab-2" className="hidden" role="tabpanel">Контент 2</div>
```

## 💡 Важные моменты

### Инициализация компонентов
Preline работает через JavaScript инициализацию. После динамического добавления элементов вызывайте:

```tsx
useEffect(() => {
  if (window.HSStaticMethods) {
    window.HSStaticMethods.autoInit();
  }
}, [/* зависимости */]);
```

### Data-атрибуты
Preline использует специальные атрибуты для связывания элементов:
- `data-hs-overlay="#id"` - открытие оверлея/модалки
- `data-hs-dropdown-toggle` - триггер дропдауна
- `data-hs-tab="#id"` - переключение табов
- `data-hs-collapse="#id"` - коллапс

### Классы состояний
- `hs-dropdown-open:...` - стили для открытого дропдауна
- `hs-tab-active:...` - стили для активной вкладки
- `hs-overlay-open:...` - стили для открытого оверлея

## 🎨 Кастомизация

Все компоненты используют стандартные Tailwind CSS классы, поэтому легко кастомизируются:

```tsx
// Изменение цветов
<button className="bg-purple-600 hover:bg-purple-700">
  Custom Color
</button>

// Изменение размеров
<button className="py-2 px-3 text-xs">
  Small Button
</button>

// Изменение скруглений
<button className="rounded-full">
  Rounded Button
</button>
```

## 📚 Полезные ссылки

- **Официальная документация**: https://preline.co/docs/
- **Все компоненты**: https://preline.co/examples.html
- **GitHub**: https://github.com/htmlstreamofficial/preline

## 🚀 Следующие шаги

1. Изучите витрину (`/showcase`)
2. Выберите нужные компоненты
3. Скопируйте примеры из витрины
4. Адаптируйте под свои нужды
5. Не забывайте вызывать `HSStaticMethods.autoInit()` для динамических элементов

---

**Готово! Теперь у вас есть полный набор профессиональных UI компонентов для админки.**

