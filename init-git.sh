#!/bin/bash

echo "🚀 Инициализация Git репозитория для Flappy Irys..."

# Инициализация git репозитория
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "🎮 Initial commit: Flappy Irys game with global leaderboard

Features:
- Flappy Bird game with Irys character
- Global leaderboard with SQLite database
- Modern glassmorphism UI design
- Multi-language support (EN/RU)
- Mobile responsive controls
- Docker support
- Multiple deployment options

Ready for hosting on GitHub, Heroku, Vercel, Railway, and other platforms."

echo "✅ Git репозиторий инициализирован!"
echo ""
echo "Следующие шаги:"
echo "1. Создайте репозиторий на GitHub"
echo "2. Добавьте remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/irys-flappybird.git"
echo "3. Загрузите код:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Для автоматического деплоя на GitHub Pages:"
echo "   - Включите GitHub Pages в настройках репозитория"
echo "   - Выберите 'GitHub Actions' как источник"
echo ""
echo "5. Для быстрого деплоя используйте кнопки в README:"
echo "   - Heroku Deploy Button"
echo "   - Vercel Deploy Button"
echo ""
echo "🎉 Удачи с хостингом вашей игры!" 