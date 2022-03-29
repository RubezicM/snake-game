const game = (function () {
  const startGameBtn = document.getElementById('startGameBtn');
  const mainPage = document.getElementById('game-panel');
  const pausedPage = document.getElementById('paused-page');

  let canvas = document.getElementById('canvas');
  let canvasWidth = 340;
  let canvasHeight = 400;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const UI_CONFIG = {
    fieldHeight: canvasHeight + 5,
    fieldWidth: canvasWidth + 5,
    fieldColor: '#222',
    fieldBorderColor: '#171717',
    snakeColor: 'white'
  }

  const GAME_CONFIG = {
    snakeSpeed: 65,
    snakePartSize: 10,
    snakeLength: 5
  }

  let ctx = canvas.getContext('2d');
  let snakeHead;
  let currentDirection = 'right';
  let gameStarted = false;
  let blinkInterval = 0;
  let isPaused = false;
  let hitTheObstacle = false;
  let points = 0;

  // Game interval
  document.getElementById('score').innerHTML = points
  let game
  let snake
  let pray = {
    x: 0,
    y: 0
  }

  let clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = UI_CONFIG.fieldColor
    ctx.shadowColor = '#222'
    ctx.shadowBlur = 5
    ctx.fillRect(2.5, 0, UI_CONFIG.fieldWidth, UI_CONFIG.fieldHeight)
    // ctx.fillStroke(ctx.strokeRect(20, 20, 150, 100));
  };
  let snakeBody = (x, y) => {
    ctx.fillStyle = UI_CONFIG.snakeColor
    ctx.fillRect(x, y, GAME_CONFIG.snakePartSize, GAME_CONFIG.snakePartSize)
  };

  let drawSnake = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (i == 0) {
        ctx.fillStyle = blinkInterval % 3 === 0 ? 'red' : UI_CONFIG.snakeColor
        ctx.fillRect(
          snake[0].x,
          snake[0].y,
          GAME_CONFIG.snakePartSize,
          GAME_CONFIG.snakePartSize
        );
      } else {
        snakeBody(arr[i].x, arr[i].y)
      }
    }
  };

  let prayBody = (x, y) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, GAME_CONFIG.snakePartSize, GAME_CONFIG.snakePartSize)
  };

  let drawGame = () => {
    collisionCheck(snakeHead)
    if (!hitTheObstacle) {
      clearCanvas()
      prayBody(pray.x, pray.y)
      moveSnake()
      drawSnake(snake)
    } else {
      drawSnake(snake)
      clearInterval(game)

      //// Storing points to local storage
      storeInLS(points)
      setTimeout(() => {
        displayScores()
        highscorePage.style.display = 'block'
        setTimeout(() => {
          highscorePage.style.display = 'none'
          gameInit()
        }, 3000)
      }, 1000)
    }
  };

  let createPray = () => {
    let _x =
      Math.round(randomNum(0, canvasHeight) / GAME_CONFIG.snakePartSize) *
      GAME_CONFIG.snakePartSize;
    let _y =
      Math.round(randomNum(0, canvasHeight) / GAME_CONFIG.snakePartSize) *
      GAME_CONFIG.snakePartSize;
    snake.forEach(part => {
      const foodIsOnSnake = part.x == _x && part.y == _y;
      const outOfBonds =
        _x >= canvasWidth || _y >= canvasHeight || (_x == 0 || _y == 0);
      if (foodIsOnSnake || outOfBonds) createPray();
      else prayBody(_x, _y);
      pray.x = _x;
      pray.y = _y;
    });
  };


  let collisionCheck = head => {
    if (
      head.x < 0 ||
      head.y < 0 ||
      (head.x >= UI_CONFIG.fieldWidth - 10 ||
        head.y >= UI_CONFIG.fieldHeight - 10)
    ) {

      hitTheObstacle = true;
    }
  };

  let selfCollisionCheck = head => {
    for (let i = 0; i < snake.length; i++) {
      if (i !== 0) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          hitTheObstacle = true;
        }
      }
    }
  }

  let moveSnake = () => {
    if (currentDirection == 'right') {
      snakeHead = { x: snake[0].x + GAME_CONFIG.snakePartSize, y: snake[0].y }
    } else if (currentDirection === 'up') {
      snakeHead = { x: snake[0].x, y: snake[0].y - GAME_CONFIG.snakePartSize }
    } else if (currentDirection === 'down') {
      snakeHead = { x: snake[0].x, y: snake[0].y + GAME_CONFIG.snakePartSize }
    } else if (currentDirection === 'left') {
      snakeHead = { x: snake[0].x - GAME_CONFIG.snakePartSize, y: snake[0].y }
    }
    snake.unshift(snakeHead)
    if (!eatingPray()) {
      snake.pop()
    } else {
      points += 10
      document.getElementById('score').innerHTML = points
      createPray(snake)
    }
    selfCollisionCheck(snakeHead)
  }
  let eatingPray = () => {
    let snakeHeadX = snake[0].x
    let snakeHeadY = snake[0].y
    if (snakeHeadX === pray.x && snakeHeadY === pray.y) {
      return true
    }
  };

  let directSnake = event => {
    const leftKey = 37
    const rightKey = 39
    const upKey = 38
    const downKey = 40
    const space = 32
    const keyPressed = event.keyCode

    if (keyPressed == leftKey && currentDirection != 'right') {
      currentDirection = 'left'
    } else if (keyPressed == rightKey && currentDirection != 'left') {
      currentDirection = 'right'
    } else if (keyPressed == upKey && currentDirection != 'down') {
      currentDirection = 'up'
    } else if (keyPressed == downKey && currentDirection != 'up') {
      currentDirection = 'down'
    } else if (keyPressed == space) {
      if (!gameStarted) {
        mainPage.style.display = 'none'
        gameInit()
      } else {
        pauseGame()
      }

    }
  };

  let pauseGame = () => {
    if (hitTheObstacle) {
      return false
    }
    isPaused === true ? (isPaused = false) : (isPaused = true)
    if (isPaused) {
      clearInterval(game)
      pausedPage.style.display = 'flex'
    } else {
      pausedPage.style.display = 'none'
      game = setInterval(gameMech, GAME_CONFIG.snakeSpeed)
    }
  };


  // Getting directions for the snake

  document.body.addEventListener('keydown', (e) => {
    directSnake(e)
  });

  /***
   * STORING EMPTY 5 PLACES IN LS
   *
   */
  // Initial storing in a LS
  storeInLS()


  let gameInit = () => {
    clearInterval(game)
    gameStarted = true
    isPaused = false
    points = 0
    document.getElementById('score').innerHTML = points
    currentDirection = 'right'
    hitTheObstacle = false
    snake = [
      { x: 150, y: 150 },
      { x: 140, y: 150 },
      { x: 130, y: 150 },
      { x: 120, y: 150 },
      { x: 110, y: 150 }
    ];

    snakeHead = { x: 0, y: 0 }
    clearCanvas()
    drawSnake(snake)
    createPray(snake)
    moveSnake()
    game = setInterval(gameMech, GAME_CONFIG.snakeSpeed)
  };

  function gameMech () {
    if (gameStarted) {
      blinkInterval++;
      drawGame();
    }
  }

  function randomNum (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return {
    gameInit,
    mainPage,
    points,
    directSnake,
    startGameBtn
  }
})();
