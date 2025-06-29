# 🚀 Настройка GitHub Pages для Flappy Irys

## ✅ Что уже готово:
- ✅ Git репозиторий инициализирован
- ✅ Файлы подготовлены для GitHub Pages
- ✅ Первый коммит создан
- ✅ Ветка переименована в `main`

## 📋 Следующие шаги:

### 1. Создайте репозиторий на GitHub
1. Перейдите на https://github.com
2. Войдите в свой аккаунт (или создайте новый)
3. Нажмите **"New repository"** (зеленая кнопка)
4. Введите название: `irys-flappybird`
5. Описание: `Flappy Bird game with Irys character`
6. Выберите **Public** (для GitHub Pages)
7. **НЕ ДОБАВЛЯЙТЕ** README, .gitignore или лицензию
8. Нажмите **"Create repository"**

### 2. Загрузите код на GitHub
Скопируйте и выполните эти команды в PowerShell:

```bash
# Добавьте ваш репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/irys-flappybird.git

# Загрузите код
git push -u origin main
```

**Пример:** Если ваш GitHub username `john123`, то команда будет:
```bash
git remote add origin https://github.com/john123/irys-flappybird.git
```

### 3. Настройте GitHub Pages
1. Перейдите в настройки репозитория: **Settings**
2. Прокрутите до раздела **"Pages"** в левом меню
3. В разделе **"Source"** выберите:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Нажмите **"Save"**

### 4. Ваша игра будет доступна по адресу:
```
https://YOUR_USERNAME.github.io/irys-flappybird
```

## ⚡ Дополнительные настройки:

### Обновление настроек Git (если нужно):
```bash
# Измените имя пользователя
git config --global user.name "Ваше Имя"

# Измените email
git config --global user.email "your.email@example.com"
```

### Добавление изображения Irys:
1. Добавьте файл `irys.png` в папку `images/`
2. Выполните команды:
```bash
git add images/irys.png
git commit -m "Add Irys character image"
git push
```

### Обновление игры:
После любых изменений в коде:
```bash
git add .
git commit -m "Update game"
git push
```

## 🎮 Особенности GitHub Pages версии:
- 🏆 **Локальные рекорды** - сохраняются в браузере игрока
- 🌐 **Без сервера** - работает полностью в браузере
- 📱 **Мобильная поддержка** - касание экрана для прыжка
- 🔄 **Мгновенные обновления** - изменения видны сразу после push

## 🛠️ Полезные команды Git:

```bash
# Проверить статус
git status

# Посмотреть историю коммитов
git log --oneline

# Посмотреть удаленные репозитории
git remote -v

# Загрузить изменения
git pull origin main
```

## 🎯 Готовые ссылки после настройки:
- **Игра:** https://YOUR_USERNAME.github.io/irys-flappybird
- **Репозиторий:** https://github.com/YOUR_USERNAME/irys-flappybird
- **Настройки Pages:** https://github.com/YOUR_USERNAME/irys-flappybird/settings/pages

## 🆘 Помощь:
Если что-то не работает:
1. Проверьте, что все команды выполнены правильно
2. Убедитесь, что репозиторий Public
3. Подождите 5-10 минут после настройки Pages
4. Проверьте раздел Actions в GitHub на наличие ошибок

**Удачи с хостингом! 🚀** 