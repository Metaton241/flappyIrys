const Localization = {
    currentLang: 'en',
    translations: {
        'en': {
            'game_title': 'FLAPPY IRYS',
            'play_btn': 'PLAY',
            'settings_btn': 'SETTINGS',
            'leaderboard_title': 'TOP PLAYERS',
            'no_records': 'NO RECORDS YET',
            'difficulty_easy': 'EASY',
            'difficulty_normal': 'NORMAL', 
            'difficulty_hard': 'HARD',
            'score_multiplier': 'SCORE MULTIPLIER',
            'back_btn': 'BACK',
            'sound_label': 'SOUND',
            'pause_btn': 'PAUSE',
            'resume_btn': 'RESUME',
            'restart_btn': 'RESTART',
            'back_to_menu_btn': 'MENU',
            'final_score': 'FINAL SCORE',
            'best_score': 'BEST SCORE',
            'play_again_btn': 'PLAY AGAIN',
            'new_record_text': 'NEW RECORD! YOU SCORED {score} POINTS!',
            'enter_name': 'ENTER YOUR NAME:',
            'save_record_btn': 'SAVE RECORD',
            'skip_record_btn': 'SKIP',
            'click_to_jump': 'CLICK TO JUMP',
            'space_or_click': 'SPACE OR MOUSE CLICK',
            'score_prefix': 'SCORE: ',
            'best_score_prefix': 'BEST SCORE: ',
            'saving_record': 'SAVING...',
            'anonymous': 'ANONYMOUS',
            'language_btn': 'EN'
        },
        'ru': {
            'game_title': 'FLAPPY IRYS',
            'play_btn': 'ИГРАТЬ',
            'settings_btn': 'НАСТРОЙКИ',
            'leaderboard_title': 'ЛУЧШИЕ ИГРОКИ',
            'no_records': 'ПОКА НЕТ ЗАПИСЕЙ',
            'difficulty_easy': 'ЛЕГКО',
            'difficulty_normal': 'НОРМАЛЬНО',
            'difficulty_hard': 'СЛОЖНО',
            'score_multiplier': 'МНОЖИТЕЛЬ ОЧКОВ',
            'back_btn': 'НАЗАД',
            'sound_label': 'ЗВУК',
            'pause_btn': 'ПАУЗА',
            'resume_btn': 'ПРОДОЛЖИТЬ',
            'restart_btn': 'ЗАНОВО',
            'back_to_menu_btn': 'МЕНЮ',
            'final_score': 'ФИНАЛЬНЫЙ СЧЕТ',
            'best_score': 'ЛУЧШИЙ СЧЕТ',
            'play_again_btn': 'ИГРАТЬ СНОВА',
            'new_record_text': 'НОВЫЙ РЕКОРД! ВЫ НАБРАЛИ {score} ОЧКОВ!',
            'enter_name': 'ВВЕДИТЕ ВАШЕ ИМЯ:',
            'save_record_btn': 'СОХРАНИТЬ',
            'skip_record_btn': 'ПРОПУСТИТЬ',
            'click_to_jump': 'КЛИКНИТЕ ДЛЯ ПРЫЖКА',
            'space_or_click': 'ПРОБЕЛ ИЛИ КЛИК МЫШЬЮ',
            'score_prefix': 'СЧЕТ: ',
            'best_score_prefix': 'ЛУЧШИЙ СЧЕТ: ',
            'saving_record': 'СОХРАНЕНИЕ...',
            'anonymous': 'АНОНИМ',
            'language_btn': 'RU'
        }
    },
    
    init() {
        const savedLang = localStorage.getItem('flappyIrys_language') || 'en';
        this.setLanguage(savedLang);
    },
    
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('flappyIrys_language', lang);
        this.updateUI();
    },
    
    get(key, params = {}, fallback = '') {
        try {
            let text = this.translations[this.currentLang] && this.translations[this.currentLang][key];
            if (!text) {
                text = this.translations['en'][key] || fallback || key;
            }
            
            if (params && typeof params === 'object') {
                Object.keys(params).forEach(param => {
                    const placeholder = `{${param}}`;
                    text = text.replace(new RegExp(placeholder, 'g'), params[param]);
                });
            }
            
            return text;
        } catch (error) {
            console.error('Localization error:', error);
            return fallback || key;
        }
    },
    
    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                element.textContent = this.get(key);
            }
        });
        
        const langBtn = document.getElementById('langBtn');
        if (langBtn) {
            langBtn.textContent = `🌐 ${this.get('language_btn')}`;
        }
    }
};

const ScreenManager = {
    currentScreen: 'mainMenu',
    
    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const screen = document.getElementById(screenName);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenName;
        }
    }
};

const GameSettings = {
    difficulty: 'normal',
    sound: true,
    
    load() {
        const saved = localStorage.getItem('flappyIrys_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.difficulty = settings.difficulty || 'normal';
            this.sound = settings.sound !== undefined ? settings.sound : true;
        }
        this.updateUI();
    },
    
    save() {
        localStorage.setItem('flappyIrys_settings', JSON.stringify({
            difficulty: this.difficulty,
            sound: this.sound
        }));
    },
    
    updateUI() {
        const difficultySelect = document.getElementById('mainDifficultySelect');
        const soundToggle = document.getElementById('soundToggle');
        
        if (difficultySelect) difficultySelect.value = this.difficulty;
        if (soundToggle) soundToggle.checked = this.sound;
    },
    
    getScoreMultiplier() {
        switch(this.difficulty) {
            case 'easy': return 1;
            case 'normal': return 2;
            case 'hard': return 3;
            default: return 2;
        }
    }
};

const ScoreManager = {
    leaderboard: [],
    
    async load() {
        this.loadFromLocalStorage();
        this.updateUI();
    },
    
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('flappyIrys_leaderboard');
            if (saved) {
                this.leaderboard = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            this.leaderboard = [];
        }
    },
    
    saveToLocalStorage() {
        localStorage.setItem('flappyIrys_leaderboard', JSON.stringify(this.leaderboard));
    },
    
    isNewRecord(score) {
        if (this.leaderboard.length < 10) return true;
        return score > this.leaderboard[this.leaderboard.length - 1].score;
    },
    
    async addScore(name, score) {
        const record = {
            name: name.trim() || 'ANONYMOUS',
            score: score,
            difficulty: GameSettings.difficulty,
            created_at: new Date().toISOString()
        };
        
        this.leaderboard.push(record);
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 10);
        
        this.saveToLocalStorage();
        this.updateUI();
    },
    
    updateUI() {
        const leaderboardList = document.getElementById('leaderboardList');
        if (!leaderboardList) return;
        
        leaderboardList.innerHTML = '';
        
        if (this.leaderboard.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'leaderboard-item';
            emptyItem.innerHTML = `<span class="no-records">${Localization.get('no_records')}</span>`;
            leaderboardList.appendChild(emptyItem);
        } else {
            this.leaderboard.forEach((record, index) => {
                const item = document.createElement('div');
                item.className = `leaderboard-item ${index < 3 ? 'top-' + (index + 1) : ''}`;
                
                const difficultyEmoji = {
                    'easy': '😊',
                    'normal': '😐', 
                    'hard': '😤'
                };
                
                const difficultyIcon = record.difficulty ? difficultyEmoji[record.difficulty] || '😐' : '';
                
                item.innerHTML = `
                    <span class="rank-col">${index + 1}</span>
                    <span class="name-col" title="${record.name} (${record.difficulty || 'normal'})">${record.name} ${difficultyIcon}</span>
                    <span class="score-col">${record.score}</span>
                `;
                leaderboardList.appendChild(item);
            });
        }
    },
    
    getBestScore() {
        if (!this.leaderboard || this.leaderboard.length === 0) {
            return 0;
        }
        const firstRecord = this.leaderboard[0];
        return firstRecord && typeof firstRecord.score === 'number' ? firstRecord.score : 0;
    }
};

const NameInputModal = {
    modal: null,
    currentScore: 0,
    
    init() {
        this.modal = document.getElementById('nameInputModal');
        if (!this.modal) {
            console.error('NameInputModal: Modal element not found!');
        }
    },
    
    show(score) {
        this.currentScore = score;
        
        const newRecordScoreElement = document.getElementById('newRecordScore');
        if (newRecordScoreElement) {
            newRecordScoreElement.textContent = score;
        } else {
            console.error('Element newRecordScore not found!');
        }
        
        const playerNameInput = document.getElementById('playerNameInput');
        if (playerNameInput) {
            playerNameInput.value = '';
            playerNameInput.focus();
        } else {
            console.error('Element playerNameInput not found!');
        }
        
        const recordText = document.querySelector('[data-i18n="new_record_text"]');
        if (recordText) {
            recordText.innerHTML = Localization.get('new_record_text', { score: score }, `You scored ${score} points!`);
        }
        
        if (this.modal) {
            this.modal.classList.add('active');
        } else {
            console.error('Modal element not found!');
        }
    },
    
    hide() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    },
    
    async saveRecord() {
        const playerNameInput = document.getElementById('playerNameInput');
        const name = playerNameInput ? playerNameInput.value : '';
        this.hide();
        
        const scorePrefix = Localization.get('score_prefix', {}, 'Score: ');
        const savingText = Localization.get('saving_record', {}, 'Saving record...');
        
        const finalScoreElement = document.getElementById('finalScore');
        const bestScoreElement = document.getElementById('bestScore');
        
        if (finalScoreElement) {
            finalScoreElement.textContent = `${scorePrefix}${this.currentScore}`;
        }
        
        if (bestScoreElement) {
            bestScoreElement.textContent = savingText;
        }
        
        ScreenManager.showScreen('gameOverScreen');
        
        await ScoreManager.addScore(name, this.currentScore);
        
        const bestScorePrefix = Localization.get('best_score_prefix', {}, 'Best Score: ');
        const bestScore = ScoreManager.getBestScore() || 0;
        
        if (bestScoreElement) {
            bestScoreElement.textContent = `${bestScorePrefix}${bestScore}`;
        }
    },
    
    async skipRecord() {
        this.hide();
        
        const scorePrefix = Localization.get('score_prefix', {}, 'Score: ');
        const savingText = Localization.get('saving_record', {}, 'Saving record...');
        
        const finalScoreElement = document.getElementById('finalScore');
        const bestScoreElement = document.getElementById('bestScore');
        
        if (finalScoreElement) {
            finalScoreElement.textContent = `${scorePrefix}${this.currentScore}`;
        }
        
        if (bestScoreElement) {
            bestScoreElement.textContent = savingText;
        }
        
        ScreenManager.showScreen('gameOverScreen');
        
        const anonymous = Localization.get('anonymous', {}, 'ANONYMOUS');
        await ScoreManager.addScore(anonymous, this.currentScore);
        
        const bestScorePrefix = Localization.get('best_score_prefix', {}, 'Best Score: ');
        const bestScore = ScoreManager.getBestScore() || 0;
        
        if (bestScoreElement) {
            bestScoreElement.textContent = `${bestScorePrefix}${bestScore}`;
        }
    }
};

const Bird = {
    x: 80,
    y: 250,
    width: 40,
    height: 40,
    velocity: 0,
    gravity: 0.08,
    jumpPower: -3,
    rotation: 0,
    image: null,
    imageLoaded: false,
    
    init() {
        this.image = new Image();
        this.image.src = 'images/irys.png';
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.onerror = () => {
            console.log('Image not found, using default bird');
            this.imageLoaded = false;
        };
    },
    
    reset() {
        this.x = 80;
        this.y = 250;
        this.velocity = 0;
        this.rotation = 0;
    },
    
    jump() {
        this.velocity = this.jumpPower;
        if (!Game.gameStarted) {
            Game.gameStarted = true;
        }
    },
    
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        if (this.y < 0) {
            console.log('Bird hit ceiling!');
            this.y = 0;
            this.velocity = 0;
            Game.gameOver();
        }
        
        if (this.y > Game.canvas.height - this.height - 100) {
            console.log('Bird hit ground!');
            this.y = Game.canvas.height - this.height - 100;
            this.velocity = 0;
            Game.gameOver();
        }
        
        this.rotation = Math.min(Math.max(this.velocity * 2, -20), 45);
    },
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        if (this.imageLoaded && this.image) {
            ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        } else {
            const gradient = ctx.createLinearGradient(-this.width/2, -this.height/2, this.width/2, this.height/2);
            gradient.addColorStop(0, '#ff6b9d');
            gradient.addColorStop(0.5, '#c44569');
            gradient.addColorStop(1, '#f8b500');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            
            ctx.fillStyle = '#ff9ff3';
            ctx.fillRect(-this.width/2 + 5, -this.height/2 + 3, this.width - 15, this.height/2);
            
            ctx.fillStyle = '#ffa502';
            ctx.fillRect(this.width/2 - 5, -3, 8, 6);
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-this.width/2 + 8, -this.height/2 + 6, 4, 4);
        ctx.fillRect(this.width/2 - 12, -this.height/2 + 6, 4, 4);
        
        ctx.restore();
    }
};

const Pipe = {
    width: 60,
    
    create(x) {
        const gap = Game.getPipeGap();
        const minHeight = 100;
        const maxHeight = Game.canvas.height - gap - minHeight - 100;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        return {
            x: x,
            topHeight: topHeight,
            bottomY: topHeight + gap,
            bottomHeight: Game.canvas.height - topHeight - gap - 100,
            passed: false
        };
    },
    
    draw(ctx, pipe) {
        
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(pipe.x, 0, this.width, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, this.width, pipe.bottomHeight);
        
        ctx.fillStyle = '#1e5f3f';
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, this.width + 10, 30);
        ctx.fillRect(pipe.x - 5, pipe.bottomY, this.width + 10, 30);
    }
};

const Game = {
    score: 0,
    isPlaying: false,
    isPaused: false,
    canvas: null,
    ctx: null,
    pipes: [],
    animationId: null,
    lastTime: 0,
    gameStarted: false,
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.bindEvents();
        Bird.init();
    },
    
    setupCanvas() {
        this.canvas.width = 400;
        this.canvas.height = 600;
    },
    
    bindEvents() {
        this.canvas.addEventListener('click', () => {
            if (this.isPlaying && !this.isPaused) {
                Bird.jump();
            }
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isPlaying && !this.isPaused) {
                Bird.jump();
            }
        });
    },
    
    start() {
        this.score = 0;
        this.isPlaying = true;
        this.isPaused = false;
        this.pipes = [];
        this.lastTime = 0;
        this.gameStarted = false;
        
        Bird.reset();
        
        this.pipes.push(Pipe.create(500));
        this.pipes.push(Pipe.create(750));
        this.pipes.push(Pipe.create(1000));
        
        this.updateScore();
        ScreenManager.showScreen('gameScreen');
        
        this.gameLoop();
    },
    
    gameLoop(currentTime = 0) {
        if (!this.isPlaying || this.isPaused) {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            return;
        }
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update();
        
        if (!this.isPlaying) {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            return;
        }
        
        this.draw();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    },
    
    update() {
        if (!this.isPlaying || this.isPaused) {
            return;
        }
        
        if (this.gameStarted) {
            Bird.update();
            
            if (!this.isPlaying) {
                return;
            }
        }
        
        if (this.gameStarted && this.isPlaying) {
            const speed = this.getGameSpeed();
            for (let i = this.pipes.length - 1; i >= 0; i--) {
                const pipe = this.pipes[i];
                pipe.x -= speed;
                
                if (pipe.x + Pipe.width < 0) {
                    this.pipes.splice(i, 1);
                    continue;
                }
                
                if (!pipe.passed && pipe.x + Pipe.width < Bird.x) {
                    pipe.passed = true;
                    this.addScore(1);
                }
                
                if (this.checkCollision(Bird, pipe)) {
                    console.log('Collision detected with pipe!');
                    this.gameOver();
                    return;
                }
            }
            
            if (this.pipes.length > 0 && this.pipes[this.pipes.length - 1].x < 150) {
                this.pipes.push(Pipe.create(this.pipes[this.pipes.length - 1].x + 250));
            }
        }
    },
    
    checkCollision(bird, pipe) {
        const birdLeft = bird.x;
        const birdRight = bird.x + bird.width;
        const birdTop = bird.y;
        const birdBottom = bird.y + bird.height;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + Pipe.width;
        const topPipeBottom = pipe.topHeight;
        const bottomPipeTop = pipe.bottomY;
        
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
                console.log('Collision detected! Bird:', {x: birdLeft, y: birdTop, width: bird.width, height: bird.height}, 'Pipe:', {x: pipeLeft, topHeight: topPipeBottom, bottomY: bottomPipeTop});
                return true;
            }
        }
        
        return false;
    },
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#98D8E8');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - 100);
        
        const groundGradient = this.ctx.createLinearGradient(0, this.canvas.height - 100, 0, this.canvas.height);
        groundGradient.addColorStop(0, '#32CD32');
        groundGradient.addColorStop(1, '#228B22');
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
        
        this.ctx.fillStyle = '#90EE90';
        for (let x = 0; x < this.canvas.width; x += 20) {
            this.ctx.fillRect(x, this.canvas.height - 100, 10, 15);
        }
        
        this.pipes.forEach(pipe => {
            Pipe.draw(this.ctx, pipe);
        });
        
        Bird.draw(this.ctx);
        
        if (!this.gameStarted) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            
            const clickText = Localization.get('click_to_jump', {}, 'CLICK TO JUMP');
            const spaceText = Localization.get('space_or_click', {}, 'SPACE OR MOUSE CLICK');
            
            this.ctx.fillText(clickText, this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(spaceText, this.canvas.width / 2, this.canvas.height / 2 + 30);
        }
    },
    
    pause() {
        this.isPaused = true;
        ScreenManager.showScreen('pauseScreen');
    },
    
    resume() {
        this.isPaused = false;
        ScreenManager.showScreen('gameScreen');
        this.gameLoop();
    },
    
    gameOver() {
        if (!this.isPlaying) {
            return;
        }
        
        console.log('Game Over! Score:', this.score);
        
        this.isPlaying = false;
        this.isPaused = false;
        this.gameStarted = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        setTimeout(() => {
            if (ScoreManager.isNewRecord(this.score)) {
                NameInputModal.show(this.score);
            } else {
                const scorePrefix = Localization.get('score_prefix', {}, 'Score: ');
                const bestScorePrefix = Localization.get('best_score_prefix', {}, 'Best Score: ');
                const bestScore = ScoreManager.getBestScore() || 0;
                
                const finalScoreElement = document.getElementById('finalScore');
                const bestScoreElement = document.getElementById('bestScore');
                
                if (finalScoreElement) {
                    finalScoreElement.textContent = `${scorePrefix}${this.score}`;
                }
                
                if (bestScoreElement) {
                    bestScoreElement.textContent = `${bestScorePrefix}${bestScore}`;
                }
                
                ScreenManager.showScreen('gameOverScreen');
            }
        }, 100);
    },
    
    updateScore() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    },
    
    addScore(points) {
        const multiplier = GameSettings.getScoreMultiplier();
        this.score += points * multiplier;
        this.updateScore();
    },
    
    getGameSpeed() {
        switch(GameSettings.difficulty) {
            case 'easy': return 0.8;
            case 'normal': return 1.2;
            case 'hard': return 1.6;
            default: return 1.2;
        }
    },
    
    getPipeGap() {
        switch(GameSettings.difficulty) {
            case 'easy': return 200;
            case 'normal': return 170;
            case 'hard': return 150;
            default: return 170;
        }
    },
    
    testGameOver() {
        this.score = Math.floor(Math.random() * 1000) + 50;
        this.updateScore();
        this.gameOver();
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    Localization.init();
    GameSettings.load();
    await ScoreManager.load();
    Game.init();
    NameInputModal.init();
    
    document.getElementById('langBtn').addEventListener('click', () => {
        const newLang = Localization.currentLang === 'en' ? 'ru' : 'en';
        Localization.setLanguage(newLang);
        ScoreManager.updateUI();
    });
    
    document.getElementById('playBtn').addEventListener('click', () => {
        Game.start();
    });
    
    document.getElementById('settingsBtn').addEventListener('click', () => {
        ScreenManager.showScreen('settingsScreen');
    });
    
    document.getElementById('mainDifficultySelect').addEventListener('change', (e) => {
        GameSettings.difficulty = e.target.value;
        GameSettings.save();
    });
    
    document.getElementById('backFromSettings').addEventListener('click', () => {
        ScreenManager.showScreen('mainMenu');
    });
    
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        GameSettings.sound = e.target.checked;
        GameSettings.save();
    });
    
    document.getElementById('pauseBtn').addEventListener('click', () => {
        Game.pause();
    });
    
    document.getElementById('resumeBtn').addEventListener('click', () => {
        Game.resume();
    });
    
    document.getElementById('restartBtn').addEventListener('click', () => {
        Game.start();
    });
    
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        ScreenManager.showScreen('mainMenu');
    });
    
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        Game.start();
    });
    
    document.getElementById('backToMenuFromGameOver').addEventListener('click', () => {
        ScreenManager.showScreen('mainMenu');
    });
    
    const saveRecordBtn = document.getElementById('saveRecordBtn');
    if (saveRecordBtn) {
        saveRecordBtn.addEventListener('click', () => {
            NameInputModal.saveRecord();
        });
    }
    
    const skipRecordBtn = document.getElementById('skipRecordBtn');
    if (skipRecordBtn) {
        skipRecordBtn.addEventListener('click', () => {
            NameInputModal.skipRecord();
        });
    }
    
    const playerNameInput = document.getElementById('playerNameInput');
    if (playerNameInput) {
        playerNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                NameInputModal.saveRecord();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (ScreenManager.currentScreen === 'mainMenu') {
                    Game.start();
                } else if (ScreenManager.currentScreen === 'gameScreen' && Game.isPlaying && !Game.isPaused) {
                    Bird.jump();
                } else if (ScreenManager.currentScreen === 'gameScreen' && Game.isPaused) {
                    Game.resume();
                }
                break;
            case 'Escape':
                if (ScreenManager.currentScreen === 'gameScreen' && Game.isPlaying) {
                    Game.pause();
                } else if (ScreenManager.currentScreen !== 'mainMenu') {
                    ScreenManager.showScreen('mainMenu');
                }
                break;
            case 'KeyG':
                if (ScreenManager.currentScreen === 'gameScreen' && Game.isPlaying) {
                    Game.testGameOver();
                }
                break;
            case 'KeyO':
                if (ScreenManager.currentScreen === 'gameScreen' && Game.isPlaying) {
                    console.log('Manual game over triggered');
                    Game.gameOver();
                }
                break;
        }
    });
    
    console.log('Flappy Irys loaded! Welcome to the game!');
}); 