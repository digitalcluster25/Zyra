# Исправление ошибки Preline Plugin

## Проблема
```
[postcss] Cannot find module 'preline/plugin'
Require stack:
- /Users/macbookpro/Coding/zyra/adminko/tailwind.config.js
```

## Причина
**Preline v3.x не имеет плагина Tailwind CSS.**

Preline работает только через JavaScript инициализацию:
- Нет файла `plugin.js` в пакете
- В `package.json` нет упоминания о Tailwind плагине
- Preline v3 - это чисто JavaScript библиотека UI компонентов

## Решение

### 1. Удалить несуществующий плагин
**Файл:** `adminko/tailwind.config.js`

**Было:**
```js
plugins: [
  require("tailwindcss-animate"),
  require("preline/plugin"), // ❌ Этого плагина не существует
],
```

**Стало:**
```js
plugins: [
  require("tailwindcss-animate"),
],
```

### 2. Оставить content path (для сканирования классов)
```js
content: [
  "./index.html",
  "./src/**/*.{ts,tsx}",
  "./node_modules/preline/dist/*.js",
  "./node_modules/preline/preline.js",
],
```

### 3. JavaScript инициализация (уже реализована)
Preline работает через JS инициализацию в компонентах:

```tsx
import { useEffect } from 'react';

useEffect(() => {
  // Инициализация Preline после рендера
  if (window.HSStaticMethods) {
    window.HSStaticMethods.autoInit();
  }
}, []);
```

## Как работает Preline v3

1. **HTML классы:** Используются для стилизации (через Tailwind)
2. **JavaScript:** Инициализирует интерактивность (dropdowns, tooltips, etc)
3. **Без плагина:** Не требует Tailwind плагина

## Примеры использования

### Dropdown (уже реализовано в TopHeader.tsx)
```tsx
<div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
  <button 
    id="dropdown-id" 
    type="button" 
    className="..." 
    aria-haspopup="menu"
  >
    Button
  </button>
  
  <div className="hs-dropdown-menu transition-[opacity,margin] duration opacity-0 hidden ...">
    {/* Content */}
  </div>
</div>
```

### Инициализация
```tsx
useEffect(() => {
  if (window.HSStaticMethods) {
    window.HSStaticMethods.autoInit();
  }
}, []);
```

## Результат
✅ Ошибка исправлена  
✅ Сервер запускается без ошибок  
✅ Preline компоненты работают корректно  
✅ Dropdowns, tooltips функционируют  

## Файлы изменены
- `adminko/tailwind.config.js` - удален несуществующий плагин

## Дата исправления
13 октября 2025, 00:45

