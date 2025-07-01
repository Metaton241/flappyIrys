# Автоматизированный скрипт развертывания Flappy Irys на GitHub Pages
Write-Host "Развертывание Flappy Irys на GitHub Pages" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Проверяем статус git
Write-Host "Проверяю статус git..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Есть незакоммиченные изменения!" -ForegroundColor Red
    git status
    Write-Host ""
}

# Получаем username от пользователя
Write-Host "Для продолжения нужен ваш GitHub username" -ForegroundColor Cyan
$username = Read-Host "Введите ваш GitHub username"

if (!$username) {
    Write-Host "Username не может быть пустым!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Используемый username: $username" -ForegroundColor Green
Write-Host "URL репозитория: https://github.com/$username/irys-flappybird" -ForegroundColor Green
Write-Host ""

# Подтверждение
$confirm = Read-Host "Продолжить развертывание? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Развертывание отменено" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Настройка git remote..." -ForegroundColor Yellow

# Удаляем существующий remote если есть
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Удаляю существующий remote..." -ForegroundColor Yellow
    git remote remove origin
}

# Добавляем новый remote
$repoUrl = "https://github.com/$username/irys-flappybird.git"
git remote add origin $repoUrl

Write-Host "Remote добавлен: $repoUrl" -ForegroundColor Green

# Переименовываем ветку в main
Write-Host ""
Write-Host "Переименовываю ветку в main..." -ForegroundColor Yellow
git branch -M main

# Пушим код
Write-Host ""
Write-Host "Загружаю код на GitHub..." -ForegroundColor Yellow
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Код успешно загружен на GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Следующие шаги:" -ForegroundColor Cyan
    Write-Host "1. Перейдите в настройки репозитория: https://github.com/$username/irys-flappybird/settings/pages" -ForegroundColor White
    Write-Host "2. В разделе 'Source' выберите 'Deploy from a branch'" -ForegroundColor White
    Write-Host "3. Выберите ветку 'main' и папку '/ (root)'" -ForegroundColor White
    Write-Host "4. Нажмите 'Save'" -ForegroundColor White
    Write-Host ""
    Write-Host "Ваша игра будет доступна по адресу:" -ForegroundColor Green
    Write-Host "https://$username.github.io/irys-flappybird" -ForegroundColor White
    Write-Host ""
    Write-Host "Обычно развертывание занимает 5-10 минут" -ForegroundColor Yellow
    
    # Открываем страницу настроек
    $openSettings = Read-Host "Открыть настройки GitHub Pages? (Y/n)"
    if ($openSettings -ne "n" -and $openSettings -ne "N") {
        Start-Process "https://github.com/$username/irys-flappybird/settings/pages"
    }
    
} else {
    Write-Host "Ошибка при загрузке кода:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Возможные причины:" -ForegroundColor Yellow
    Write-Host "- Репозиторий не создан на GitHub" -ForegroundColor White
    Write-Host "- Неправильный username" -ForegroundColor White
    Write-Host "- Нет прав доступа к репозиторию" -ForegroundColor White
    Write-Host ""
    Write-Host "Убедитесь что:" -ForegroundColor Cyan
    Write-Host "1. Репозиторий создан на https://github.com/$username/irys-flappybird" -ForegroundColor White
    Write-Host "2. Вы вошли в GitHub в браузере" -ForegroundColor White
    Write-Host "3. Username введен правильно" -ForegroundColor White
}

Write-Host ""
Write-Host "Очистка временных файлов..." -ForegroundColor Yellow
Remove-Item "create-github-repo.html" -ErrorAction SilentlyContinue

Write-Host "Готово!" -ForegroundColor Green 