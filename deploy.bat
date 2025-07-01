@echo off
chcp 65001 >nul
echo.
echo ============================================
echo  Развертывание Flappy Irys на GitHub Pages
echo ============================================
echo.

echo Проверяю статус git...
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo Ошибка: Git не инициализирован!
    pause
    exit /b 1
)

echo.
set /p username="Введите ваш GitHub username: "

if "%username%"=="" (
    echo Ошибка: Username не может быть пустым!
    pause
    exit /b 1
)

echo.
echo Используемый username: %username%
echo URL репозитория: https://github.com/%username%/irys-flappybird
echo.

set /p confirm="Продолжить развертывание? (y/N): "
if /i not "%confirm%"=="y" (
    echo Развертывание отменено
    pause
    exit /b 1
)

echo.
echo Добавляю неотслеживаемые файлы...
git add .
git commit -m "Add deployment files" >nul 2>&1

echo Настройка git remote...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%username%/irys-flappybird.git

echo Переименовываю ветку в main...
git branch -M main

echo.
echo Загружаю код на GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo Ошибка при загрузке кода!
    echo.
    echo Возможные причины:
    echo - Репозиторий не создан на GitHub
    echo - Неправильный username
    echo - Нет прав доступа к репозиторию
    echo.
    echo Убедитесь что:
    echo 1. Репозиторий создан на https://github.com/%username%/irys-flappybird
    echo 2. Вы вошли в GitHub в браузере
    echo 3. Username введен правильно
    pause
    exit /b 1
)

echo.
echo Код успешно загружен на GitHub!
echo.
echo Следующие шаги:
echo 1. Перейдите в настройки репозитория
echo 2. В разделе Source выберите Deploy from a branch
echo 3. Выберите ветку main и папку / (root)
echo 4. Нажмите Save
echo.
echo Ваша игра будет доступна по адресу:
echo https://%username%.github.io/irys-flappybird
echo.
echo Обычно развертывание занимает 5-10 минут
echo.

set /p open="Открыть настройки GitHub Pages? (Y/n): "
if /i not "%open%"=="n" (
    start https://github.com/%username%/irys-flappybird/settings/pages
)

echo.
echo Очистка временных файлов...
del create-github-repo.html >nul 2>&1
del deploy-to-github.ps1 >nul 2>&1

echo Готово!
pause 