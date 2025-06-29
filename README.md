# Flappy Irys 🎮

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/irys-flappybird)

Браузерная игра Flappy Bird с персонажем Irys, глобальным лидербордом и современным дизайном в бирюзовых тонах.

## 🎮 [Играть онлайн](https://your-username.github.io/irys-flappybird)

## ✨ Особенности

- 🎯 **Персонаж Irys** с анимацией полета
- 🏆 **Глобальный лидерборд** - соревнуйтесь с игроками со всего мира  
- 🎚️ **3 уровня сложности** с разными множителями очков
- 📱 **Мобильная поддержка** - играйте на телефоне и планшете
- 🌐 **Мультиязычность** - поддержка английского и русского языков
- 🎨 **Современный дизайн** - glassmorphism эффекты и анимации
- 💾 **Offline поддержка** - работает даже без интернета

## 🚀 Быстрый старт

### Локальная разработка

1. **Установите зависимости:**
```bash
npm install
```

2. **Запустите сервер:**
```bash
npm start
```

3. **Откройте игру:**
Перейдите по адресу http://localhost:3000

Для разработки с автоперезагрузкой:
```bash
npm run dev
```

## 🌐 Развертывание на хостинге

### На Heroku

1. **Подготовка:**
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Создание приложения:**
```bash
heroku create your-flappy-irys-app
git push heroku main
```

3. **Открытие приложения:**
```bash
heroku open
```

### На Vercel

1. **Установите Vercel CLI:**
```bash
npm i -g vercel
```

2. **Развертывание:**
```bash
vercel
```

3. **Следуйте инструкциям в терминале**

### На Railway

1. **Подключите GitHub репозиторий к Railway**
2. **Выберите проект и он автоматически развернется**

### На обычном VPS/хостинге

1. **Загрузите файлы на сервер**
2. **Установите Node.js и npm**
3. **Установите зависимости:**
```bash
npm install --production
```

4. **Запустите с PM2 (рекомендуется):**
```bash
npm install -g pm2
pm2 start server.js --name "flappy-irys"
pm2 startup
pm2 save
```

## 📋 Требования к системе

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- **Свободный порт** (по умолчанию 3000)

## 🗃️ База данных

Игра использует SQLite базу данных (`leaderboard.db`), которая создается автоматически при первом запуске.

### Структура таблицы лидеров:
```sql
CREATE TABLE leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 API Endpoints

### Получить топ-10 лидеров
```
GET /api/leaderboard
```

### Добавить новый рекорд
```
POST /api/leaderboard
{
    "player_name": "ИГРОК",
    "score": 100,
    "difficulty": "normal"
}
```

### Получить статистику игрока
```
GET /api/player/:name
```

### Очистка старых записей
```
DELETE /api/cleanup
```

## 🎮 Особенности игры

- **3 уровня сложности** с разными множителями очков
- **Глобальный лидерборд** - все игроки видят общие рекорды
- **Адаптивный дизайн** - работает на мобильных устройствах
- **Glassmorphism UI** - современный дизайн с эффектами стекла
- **Fallback в localStorage** - работает даже при проблемах с сервером

## 🛠️ Технологии

- **Frontend:** Vanilla JavaScript, HTML5 Canvas, CSS3
- **Backend:** Node.js, Express.js
- **База данных:** SQLite3
- **Стили:** CSS Variables, Glassmorphism, Animations

## 🔧 Переменные окружения

Создайте файл `.env` для настройки:

```env
PORT=3000
NODE_ENV=production
DATABASE_PATH=./leaderboard.db
```

## 📊 Мониторинг

Для production рекомендуется настроить мониторинг:

```bash
# Логи PM2
pm2 logs flappy-irys

# Статус процесса
pm2 status

# Перезапуск
pm2 restart flappy-irys
```

## 🚨 Устранение неполадок

### База данных заблокирована
```bash
# Остановите приложение
pm2 stop flappy-irys
# Удалите файл блокировки
rm leaderboard.db-wal leaderboard.db-shm
# Перезапустите
pm2 start flappy-irys
```

### Ошибки подключения к API
- Проверьте, что сервер запущен на правильном порту
- Убедитесь, что файрволл не блокирует порт
- Проверьте логи сервера

### Производительность
- База данных автоматически очищается от старых записей
- Используйте `GET /api/cleanup` для ручной очистки

## 📝 Лицензия

MIT License - используйте как хотите! 🎉

## 🎨 Кастомизация

Основные цвета настраиваются в CSS переменных в `style.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #51FFD6 0%, #00C9A7 100%);
    --secondary-gradient: linear-gradient(45deg, #51FFD6 0%, #48E5C2 100%);
}
```

---

**Удачной игры! 🚁✨** 