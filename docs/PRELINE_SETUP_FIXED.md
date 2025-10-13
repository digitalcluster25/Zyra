# ✅ Preline успешно интегрирована (ИСПРАВЛЕНО)

## 🔧 Что было исправлено

### Проблема:
Стили Preline не применялись из-за использования **Tailwind CSS v4**, которая несовместима с плагином Preline.

### Решение:
1. ✅ **Откат на Tailwind CSS v3.4.17** (стабильная версия)
2. ✅ **Обновление PostCSS конфигурации**
3. ✅ **Правильная настройка импорта Preline**
4. ✅ **Динамическая инициализация компонентов**

---

## 📦 Текущая конфигурация

### package.json
```json
{
  "dependencies": {
    "preline": "^2.x"
  },
  "devDependencies": {
    "tailwindcss": "3.4.17",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

### tailwind.config.js
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/preline/dist/*.js", // Путь к Preline компонентам
  ],
  plugins: [
    require("tailwindcss-animate"),
    require("preline/plugin"), // Плагин Preline
  ],
}
```

### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},    // v3 синтаксис
    autoprefixer: {},
  },
}
```

### index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### main.tsx
```typescript
// Динамический импорт с автоинициализацией
function AppWithPreline() {
  useEffect(() => {
    import('preline/preline').then(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    });
  }, []);

  return <App />;
}
```

---

## 🎯 Как проверить

1. **Откройте:** `http://localhost:5173/showcase`
2. **Проверьте стили:**
   - ✅ Кнопки должны быть цветными (синие, белые)
   - ✅ Dropdown должен раскрываться при клике
   - ✅ Modal должна открываться
   - ✅ Tabs должны переключаться
   - ✅ Таблица должна быть оформленной

3. **Если не работает:**
   ```bash
   # 1. Очистить кэш
   rm -rf node_modules/.vite
   
   # 2. Перезапустить dev-сервер
   npm run dev
   ```

---

## 🎨 Примеры использования

### 1. Простая кнопка (работает сразу)
```tsx
<button className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Кликни меня
</button>
```

### 2. Dropdown (требует инициализации)
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
    <div className="hs-dropdown relative">
      <button 
        type="button"
        className="hs-dropdown-toggle py-3 px-4 bg-blue-600 text-white"
      >
        Меню
      </button>
      <div className="hs-dropdown-menu hidden">
        <a href="#" className="block py-2 px-3">Пункт 1</a>
      </div>
    </div>
  );
}
```

### 3. Modal (работает через data-атрибуты)
```tsx
{/* Кнопка открытия */}
<button data-hs-overlay="#my-modal" className="py-3 px-4 bg-blue-600 text-white">
  Открыть модалку
</button>

{/* Модальное окно */}
<div id="my-modal" className="hs-overlay hidden">
  <div className="bg-white rounded-xl p-6">
    <h3>Заголовок</h3>
    <p>Контент модалки</p>
    <button data-hs-overlay="#my-modal">Закрыть</button>
  </div>
</div>
```

---

## 🚀 Доступные компоненты

✅ **Базовые элементы:**
- Buttons, Dropdowns, Modals, Alerts
- Badges, Progress, Tooltips

✅ **Формы:**
- Input, Textarea, Select
- Checkbox, Radio, Toggle
- File Upload, Pin Input

✅ **Навигация:**
- Tabs, Navbar, Sidebar
- Breadcrumbs, Pagination

✅ **Таблицы:**
- Basic Tables, Advanced Tables
- Data Tables с пагинацией

✅ **Дополнительно:**
- Accordion, Timeline, Cards

---

## 📚 Полная документация

- **Витрина компонентов:** `/showcase`
- **Официальная документация:** https://preline.co/docs/
- **Все примеры:** https://preline.co/examples.html
- **GitHub:** https://github.com/htmlstreamofficial/preline

---

## ⚠️ Важно

1. **Tailwind v3 обязателен** - v4 несовместима с Preline
2. **Инициализация обязательна** для интерактивных компонентов (dropdown, modal, tabs)
3. **Data-атрибуты** - основной способ управления компонентами
4. **Перезагрузка при роутинге** - автоинициализация настроена в `main.tsx`

---

## 🎉 Готово!

Теперь Preline полностью работает. Откройте `/showcase` и наслаждайтесь готовыми компонентами!

