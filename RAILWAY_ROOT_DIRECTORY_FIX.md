# ⚠️ КРИТИЧЕСКАЯ НАСТРОЙКА RAILWAY

## Проблема

Railway пытается запустить проект из **корневой директории** `/`, где нет `package.json` с админкой.

Скрипт `start` существует в `/adminko/package.json`, но Railway его не видит!

## ✅ Решение

### В веб-интерфейсе Railway:

1. **Откройте ваш проект adminko** в Railway Dashboard
2. Перейдите в **Settings**
3. Найдите секцию **"Root Directory"** или **"Watch Paths"**
4. Установите: **`adminko`**
5. Нажмите **"Save"** или **"Update"**
6. Railway автоматически запустит новый деплой

## Проверка

После настройки Root Directory, в логах сборки вы должны увидеть:

```
✓ Found package.json at adminko/package.json
✓ Installing dependencies...
✓ Running npm run build
✓ Running npm run start
```

Вместо:

```
✗ Missing script: "start"
```

## Альтернатива (если Root Directory недоступен)

Если в интерфейсе нет опции Root Directory, укажите **кастомную команду сборки** в настройках деплоя:

**Build Command:**
```bash
cd adminko && npm ci && npm run build
```

**Start Command:**
```bash
cd adminko && npm run start
```

## Итого

После правильной настройки Railway:
- ✅ Найдет `adminko/package.json`
- ✅ Установит зависимости
- ✅ Соберет проект (`npm run build`)
- ✅ Запустит сервер (`npm run start`)
- ✅ Админка будет доступна по адресу `/adminko`

---

**Текущий статус:** Все файлы конфигурации созданы и готовы. Осталось только указать Root Directory в Railway!

