# Доступные компоненты Preline

## 📋 Основные категории

### 1. **Application UI (Элементы интерфейса приложений)**
- **Buttons** - кнопки всех типов и размеров
- **Button Group** - группы кнопок
- **Dropdowns** - выпадающие меню
- **Input Groups** - группы инпутов с иконками
- **Modals** - модальные окна
- **Overlays** - оверлеи
- **Alerts** - уведомления и алерты
- **Badges** - значки и метки
- **Breadcrumbs** - хлебные крошки
- **Cards** - карточки
- **Progress** - индикаторы прогресса
- **Tooltips** - подсказки
- **Popovers** - всплывающие окна

### 2. **Navigation (Навигация)**
- **Navbar** - навигационная панель
- **Sidebar** - боковая панель
- **Tabs** - вкладки
- **Stepper** - степпер
- **Pagination** - пагинация
- **Mega Menu** - мега-меню

### 3. **Forms (Формы)**
- **Input** - текстовые поля
- **Textarea** - многострочные поля
- **Select** - селекты
- **Checkbox** - чекбоксы
- **Radio** - радио-кнопки
- **Toggle** - переключатели
- **File Input** - загрузка файлов
- **Advanced Select** - продвинутый селект с поиском
- **Input Number** - числовое поле со стрелками
- **Pin Input** - поле для PIN-кода

### 4. **Tables (Таблицы)**
- **Basic Tables** - базовые таблицы
- **Advanced Tables** - таблицы с сортировкой, фильтрацией
- **Data Tables** - таблицы с пагинацией

### 5. **Layouts (Макеты)**
- **Sticky Header** - липкий хедер
- **Sticky Footer** - липкий футер
- **Split Screen** - разделённый экран
- **App Shell** - каркас приложения

### 6. **Content (Контент)**
- **Accordion** - аккордеон
- **Timeline** - таймлайн
- **Statistics** - статистика
- **Pricing** - цены
- **FAQ** - FAQ секции

## 🎨 Особенности Preline

### Преимущества:
- ✅ Готовые UI компоненты на Tailwind CSS
- ✅ Поддержка темной темы из коробки
- ✅ Responsive дизайн
- ✅ Доступность (a11y)
- ✅ Поддержка TypeScript
- ✅ Минимальные зависимости
- ✅ Легкая кастомизация через Tailwind

### Инициализация:
```typescript
import 'preline/preline'
```

### Использование:
Компоненты работают через data-атрибуты:
- `data-hs-overlay` - для модалок
- `data-hs-dropdown` - для дропдаунов
- `data-hs-tab` - для табов
- `data-hs-collapse` - для коллапсов
- `data-hs-accordion` - для аккордеонов
- и т.д.

## 📖 Примеры использования

### Button
```html
<button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">
  Нажми меня
</button>
```

### Modal
```html
<button type="button" data-hs-overlay="#modal-id" class="py-3 px-4 bg-blue-600 text-white">
  Открыть модалку
</button>

<div id="modal-id" class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
  <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
      <!-- Контент модалки -->
    </div>
  </div>
</div>
```

### Dropdown
```html
<div class="hs-dropdown relative inline-flex">
  <button type="button" data-hs-dropdown-toggle class="py-3 px-4 bg-blue-600 text-white">
    Действия
  </button>
  <div class="hs-dropdown-menu hidden">
    <a class="flex items-center gap-x-3.5 py-2 px-3" href="#">
      Пункт 1
    </a>
  </div>
</div>
```

### Table с сортировкой
```html
<table class="min-w-full divide-y divide-gray-200">
  <thead class="bg-gray-50">
    <tr>
      <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
        Имя
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200">
    <tr>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        Данные
      </td>
    </tr>
  </tbody>
</table>
```

## 🔗 Полезные ссылки

- Официальная документация: https://preline.co/docs/
- Примеры компонентов: https://preline.co/examples.html
- GitHub: https://github.com/htmlstreamofficial/preline

