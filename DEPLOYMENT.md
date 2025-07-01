# 🚀 Инструкции по развертыванию Flappy Irys

## GitHub Pages (Статическая версия)

### Автоматическое развертывание
1. Загрузите код в GitHub репозиторий
2. Включите GitHub Pages в настройках репозитория
3. GitHub Actions автоматически развернет игру

### Ручное развертывание
```bash
# Создайте ветку gh-pages
git checkout -b gh-pages

# Скопируйте статические файлы
mkdir static
cp index.html style.css script.js static/
cp -r images static/

# Загрузите в GitHub
git add static/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

## Heroku

### Одним кликом
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Вручную
```bash
# Установите Heroku CLI
# Войдите в аккаунт
heroku login

# Создайте приложение
heroku create your-flappy-irys-app

# Развертывание
git push heroku main

# Откройте приложение
heroku open
```

## Vercel

### Одним кликом
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/irys-flappybird)

### Через CLI
```bash
# Установите Vercel CLI
npm i -g vercel

# Развертывание
vercel

# Следуйте инструкциям
```

## Railway

1. Подключите GitHub репозиторий к Railway
2. Выберите проект
3. Railway автоматически развернет приложение

## DigitalOcean App Platform

1. Подключите GitHub репозиторий
2. Выберите Node.js как среду выполнения
3. Настройте переменные окружения:
   - `NODE_ENV=production`
   - `PORT=3000`

## Docker

### Локально
```bash
# Сборка образа
npm run docker:build

# Запуск контейнера
npm run docker:run

# Или через docker-compose
npm run docker:compose
```

### Docker Hub
```bash
# Тегирование
docker tag flappy-irys your-username/flappy-irys:latest

# Загрузка
docker push your-username/flappy-irys:latest
```

## VPS/Ubuntu сервер

### Установка Node.js
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js через NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версий
node --version
npm --version
```

### Развертывание приложения
```bash
# Клонирование репозитория
git clone https://github.com/your-username/irys-flappybird.git
cd irys-flappybird

# Установка зависимостей
npm install --production

# Установка PM2 для управления процессами
sudo npm install -g pm2

# Запуск приложения
pm2 start server.js --name "flappy-irys"

# Настройка автозапуска
pm2 startup
pm2 save

# Настройка Nginx (опционально)
sudo apt install nginx
```

### Настройка Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Netlify (только фронтенд)

1. Подключите GitHub репозиторий к Netlify
2. Установите команду сборки: `echo "Static files ready"`
3. Установите папку публикации: `./`
4. Для API нужен отдельный бэкенд

## AWS EC2

### Создание инстанса
1. Создайте EC2 инстанс (Ubuntu 20.04 LTS)
2. Настройте Security Groups (открыть порт 80, 443, 22)
3. Подключитесь через SSH

### Установка приложения
```bash
# Подключение к серверу
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Установка Node.js и приложения
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Клонирование и запуск
git clone https://github.com/your-username/irys-flappybird.git
cd irys-flappybird
npm install --production
sudo npm install -g pm2
pm2 start server.js --name "flappy-irys"
pm2 startup
pm2 save
```

## Переменные окружения

Создайте файл `.env` с нужными настройками:

```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=./leaderboard.db
```

## Мониторинг

### PM2 Dashboard
```bash
# Статус процессов
pm2 status

# Логи
pm2 logs flappy-irys

# Перезапуск
pm2 restart flappy-irys
```

### Health Check
Приложение предоставляет endpoint для проверки состояния:
```
GET /api/health
```

## SSL/HTTPS

### С Certbot (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Backup базы данных

```bash
# Создание резервной копии
cp leaderboard.db leaderboard_backup_$(date +%Y%m%d).db

# Восстановление
cp leaderboard_backup_20231225.db leaderboard.db
pm2 restart flappy-irys
```

## Обновление приложения

```bash
# Остановка сервиса
pm2 stop flappy-irys

# Получение обновлений
git pull origin main

# Установка новых зависимостей
npm install --production

# Перезапуск
pm2 start flappy-irys
```

## Troubleshooting

### Проблемы с портом
```bash
# Проверка занятых портов
sudo netstat -tulpn | grep :3000

# Освобождение порта
sudo kill -9 $(sudo lsof -t -i:3000) 
```

### Проблемы с правами
```bash
# Исправление прав на файлы
chmod +x server.js
chown $USER:$USER leaderboard.db
```

### Логи ошибок
```bash
# PM2 логи
pm2 logs flappy-irys --lines 100

# Системные логи
journalctl -u nginx -f
``` 