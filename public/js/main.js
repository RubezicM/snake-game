class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.mainPage = document.getElementById('game-panel');
    this.pausedPage = document.getElementById('paused-page');
    this.highscorePage = document.getElementById('highscores-page');

    this.canvasWidth = 340;
    this.canvasHeight = 400;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    this.UI_CONFIG = {
      fieldHeight: this.canvasHeight + 5,
      fieldWidth: this.canvasWidth + 5,
      fieldColor: '#222',
      fieldBorderColor: '#171717',
      snakeColor: 'white'
    };

    this.GAME_CONFIG = {
      snakeSpeed: 65,
      snakePartSize: 10,
      snakeLength: 5
    };

    this.reset();
    this.setupEventListeners();
    this.initializeLocalStorage();
  }

  reset() {
    this.currentDirection = 'right';
    this.gameStarted = false;
    this.blinkInterval = 0;
    this.isPaused = false;
    this.hitTheObstacle = false;
    this.points = 0;
    this.gameInterval = null;

    this.snake = [
      { x: 150, y: 150 },
      { x: 140, y: 150 },
      { x: 130, y: 150 },
      { x: 120, y: 150 },
      { x: 110, y: 150 }
    ];

    this.snakeHead = { x: 150, y: 150 };
    this.food = { x: 0, y: 0 };

    document.getElementById('score').innerHTML = this.points;
  }

  setupEventListeners() {
    document.body.addEventListener('keydown', (e) => {
      this.handleKeyPress(e);
    });
  }

  initializeLocalStorage() {
    if (typeof storeInLS === 'function') {
      storeInLS();
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.UI_CONFIG.fieldColor;
    this.ctx.shadowColor = '#222';
    this.ctx.shadowBlur = 5;
    this.ctx.fillRect(2.5, 0, this.UI_CONFIG.fieldWidth, this.UI_CONFIG.fieldHeight);
  }

  drawSnakeBody(x, y, isHead = false) {
    if (isHead) {
      this.ctx.fillStyle = this.blinkInterval % 3 === 0 ? 'red' : this.UI_CONFIG.snakeColor;
    } else {
      this.ctx.fillStyle = this.UI_CONFIG.snakeColor;
    }
    this.ctx.fillRect(x, y, this.GAME_CONFIG.snakePartSize, this.GAME_CONFIG.snakePartSize);
  }

  drawSnake() {
    for (let i = 0; i < this.snake.length; i++) {
      this.drawSnakeBody(this.snake[i].x, this.snake[i].y, i === 0);
    }
  }

  drawFood() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.food.x, this.food.y, this.GAME_CONFIG.snakePartSize, this.GAME_CONFIG.snakePartSize);
  }

  createFood() {
    let validPosition = false;
    let attempts = 0;

    while (!validPosition && attempts < 100) {
      let x = Math.floor(Math.random() * (this.canvasWidth / this.GAME_CONFIG.snakePartSize)) * this.GAME_CONFIG.snakePartSize;
      let y = Math.floor(Math.random() * (this.canvasHeight / this.GAME_CONFIG.snakePartSize)) * this.GAME_CONFIG.snakePartSize;

      if (x >= 0 && x < this.canvasWidth && y >= 0 && y < this.canvasHeight) {
        validPosition = true;

        for (let part of this.snake) {
          if (part.x === x && part.y === y) {
            validPosition = false;
            break;
          }
        }

        if (validPosition) {
          this.food.x = x;
          this.food.y = y;
        }
      }

      attempts++;
    }

    if (attempts >= 100) {
      this.food.x = 200;
      this.food.y = 200;
    }
  }

  checkWallCollision(head) {
    return head.x < 0 ||
      head.y < 0 ||
      head.x >= this.canvasWidth ||
      head.y >= this.canvasHeight;
  }

  checkSelfCollision(head) {
    for (let i = 1; i < this.snake.length; i++) {
      if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
        return true;
      }
    }
    return false;
  }

  moveSnake() {
    let newHead = { ...this.snake[0] };

    switch (this.currentDirection) {
      case 'right':
        newHead.x += this.GAME_CONFIG.snakePartSize;
        break;
      case 'left':
        newHead.x -= this.GAME_CONFIG.snakePartSize;
        break;
      case 'up':
        newHead.y -= this.GAME_CONFIG.snakePartSize;
        break;
      case 'down':
        newHead.y += this.GAME_CONFIG.snakePartSize;
        break;
    }

    this.snakeHead = newHead;

    if (this.checkWallCollision(newHead) || this.checkSelfCollision(newHead)) {
      this.hitTheObstacle = true;
      return;
    }

    this.snake.unshift(newHead);

    if (this.isEatingFood()) {
      this.points += 10;
      document.getElementById('score').innerHTML = this.points;
      this.createFood();
    } else {
      this.snake.pop();
    }
  }

  isEatingFood() {
    return this.snake[0].x === this.food.x && this.snake[0].y === this.food.y;
  }

  gameLoop() {
    if (!this.gameStarted || this.isPaused) return;

    this.blinkInterval++;
    this.moveSnake();

    if (this.hitTheObstacle) {
      this.endGame();
      return;
    }

    this.clearCanvas();
    this.drawFood();
    this.drawSnake();
  }

  endGame() {
    clearInterval(this.gameInterval);
    this.gameInterval = null;

    if (typeof storeInLS === 'function') {
      storeInLS(this.points);
    }

    setTimeout(() => {
      if (typeof displayScores === 'function') {
        displayScores();
      }
      if (this.highscorePage) {
        this.highscorePage.style.display = 'block';
        setTimeout(() => {
          this.highscorePage.style.display = 'none';
          this.startGame();
        }, 3000);
      } else {
        setTimeout(() => {
          this.startGame();
        }, 2000);
      }
    }, 1000);
  }

  handleKeyPress(event) {
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;
    const space = 32;
    const keyPressed = event.keyCode;

    if (keyPressed === space) {
      event.preventDefault();
      if (!this.gameStarted) {
        this.mainPage.style.display = 'none';
        this.startGame();
      } else {
        this.pauseGame();
      }
      return;
    }

    if (!this.gameStarted || this.isPaused || this.hitTheObstacle) return;

    if (keyPressed === leftKey && this.currentDirection !== 'right') {
      this.currentDirection = 'left';
    } else if (keyPressed === rightKey && this.currentDirection !== 'left') {
      this.currentDirection = 'right';
    } else if (keyPressed === upKey && this.currentDirection !== 'down') {
      this.currentDirection = 'up';
    } else if (keyPressed === downKey && this.currentDirection !== 'up') {
      this.currentDirection = 'down';
    }
  }

  pauseGame() {
    if (this.hitTheObstacle) return;

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
      this.pausedPage.style.display = 'flex';
    } else {
      this.pausedPage.style.display = 'none';
      this.gameInterval = setInterval(() => this.gameLoop(), this.GAME_CONFIG.snakeSpeed);
    }
  }

  startGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }

    this.reset();
    this.gameStarted = true;
    this.createFood();
    this.clearCanvas();
    this.drawFood();
    this.drawSnake();

    this.gameInterval = setInterval(() => this.gameLoop(), this.GAME_CONFIG.snakeSpeed);
  }
}

const game = new SnakeGame();
