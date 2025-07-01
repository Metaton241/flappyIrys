const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Инициализация базы данных
const db = new sqlite3.Database('./leaderboard.db', (err) => {
    if (err) {
        console.error('Ошибка открытия базы данных:', err);
    } else {
        console.log('Подключение к SQLite базе данных успешно');
    }
});

// Создание таблицы лидеров если не существует
db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.error('Ошибка создания таблицы:', err);
    } else {
        console.log('Таблица лидеров готова');
    }
});

// API Routes

// Получить топ-10 лидеров
app.get('/api/leaderboard', (req, res) => {
    const query = `
        SELECT player_name, score, difficulty, created_at 
        FROM leaderboard 
        ORDER BY score DESC 
        LIMIT 10
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Ошибка получения лидеров:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        } else {
            res.json(rows);
        }
    });
});

// Добавить новый рекорд
app.post('/api/leaderboard', (req, res) => {
    const { player_name, score, difficulty } = req.body;
    
    
    if (!player_name || !score || !difficulty) {
        return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }
    
    if (typeof score !== 'number' || score < 0) {
        return res.status(400).json({ error: 'Некорректный счет' });
    }
    
    if (player_name.length > 15 || player_name.length < 1) {
        return res.status(400).json({ error: 'Имя должно быть от 1 до 15 символов' });
    }
    
    const validDifficulties = ['easy', 'normal', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({ error: 'Некорректная сложность' });
    }
    
    
    const cleanName = player_name.trim();
    
    const query = `
        INSERT INTO leaderboard (player_name, score, difficulty) 
        VALUES (?, ?, ?)
    `;
    
    db.run(query, [cleanName, score, difficulty], function(err) {
        if (err) {
            console.error('Ошибка добавления рекорда:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        } else {
            res.json({ 
                success: true, 
                id: this.lastID,
                message: 'Рекорд добавлен успешно'
            });
        }
    });
});

// Получить статистику игрока
app.get('/api/player/:name', (req, res) => {
    const playerName = req.params.name;
    
    const query = `
        SELECT 
            MAX(score) as best_score,
            COUNT(*) as games_played,
            AVG(score) as avg_score
        FROM leaderboard 
        WHERE player_name = ? COLLATE NOCASE
    `;
    
    db.get(query, [playerName], (err, row) => {
        if (err) {
            console.error('Ошибка получения статистики игрока:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        } else {
            res.json(row || { best_score: 0, games_played: 0, avg_score: 0 });
        }
    });
});

// Очистка старых записей (оставляем только топ-1000)
app.delete('/api/cleanup', (req, res) => {
    const query = `
        DELETE FROM leaderboard 
        WHERE id NOT IN (
            SELECT id FROM leaderboard 
            ORDER BY score DESC 
            LIMIT 1000
        )
    `;
    
    db.run(query, [], function(err) {
        if (err) {
            console.error('Ошибка очистки базы:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        } else {
            res.json({ 
                success: true, 
                deleted: this.changes,
                message: 'База данных очищена'
            });
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Игра доступна по адресу: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nЗакрытие сервера...');
    db.close((err) => {
        if (err) {
            console.error('Ошибка закрытия базы данных:', err);
        } else {
            console.log('База данных закрыта');
        }
        process.exit(0);
    });
}); 