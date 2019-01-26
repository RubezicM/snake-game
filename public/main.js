var canvas = document.getElementById("canvas");
canvasWidth = 340;
canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const UI_CONFIG = {
  borderCanvas : 20,
  fieldHeight: canvasHeight + 5,
  fieldWidth: canvasWidth + 5,
  fieldColor: "#F7D800",
  fieldBorderColor: "#171717",
  snakeColor: "#3BD80D"
}
const GAME_CONFIG = {
  snakeSpeed: 65,
  snakePartSize:10,
  snakeLength: 5
}


let ctx = canvas.getContext("2d");
let snakeHead;
let currentDirection = "right";
let prayOnBoard = false;
let gameStarted = true;
let blinkInterval = 0;
let isPaused = false;
let hitTheObstacle = false;
let points = 0;
// Game interval 
document.getElementById("score").innerHTML = points;
let game;
let snake;
let pray = {
  x: 0,
  y: 0
};



let clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = UI_CONFIG.fieldColor;
  ctx.shadowColor = "#222";
  ctx.shadowBlur = 5;
  ctx.fillRect(0, 0, UI_CONFIG.fieldWidth, UI_CONFIG.fieldHeight);
};
let snakeBody = (x, y) => {
  ctx.fillStyle = UI_CONFIG.snakeColor;
  ctx.fillRect(x, y, GAME_CONFIG.snakePartSize, GAME_CONFIG.snakePartSize);
};

let drawSnake = arr => {
  for (var i = 0; i < arr.length; i++) {
    if (i == 0) {
      ctx.fillStyle = blinkInterval % 2 === 0 ? "black" : "green";
      ctx.fillRect(snake[0].x, snake[0].y, GAME_CONFIG.snakePartSize, GAME_CONFIG.snakePartSize);
    } else {
      snakeBody(arr[i].x, arr[i].y);
    }
  }
};

let prayBody = (x, y) => {
  ctx.fillStyle = "red";
  ctx.fillRect(x, y, GAME_CONFIG.snakePartSize, GAME_CONFIG.snakePartSize);
};


let drawGame = () => {
  collisionCheck(snakeHead)
  
  if(!hitTheObstacle){
    clearCanvas();
    prayBody(pray.x, pray.y);
    moveSnake();
    drawSnake(snake);
    
  } else {
    drawSnake(snake);
    clearInterval(game);
    setTimeout(()=>{
      gameInit()
    },1000)
  }
};


let createPray = arr => {
  _x = Math.round(randomNum(0, canvasHeight) / GAME_CONFIG.snakePartSize) * GAME_CONFIG.snakePartSize;
  _y = Math.round(randomNum(0, canvasHeight) / GAME_CONFIG.snakePartSize) * GAME_CONFIG.snakePartSize;
  snake.forEach(part => {
    const foodIsOnSnake = part.x == _x && part.y == _y;
    const outOfBonds = (_x >= canvasWidth || _y >= canvasHeight) || (_x == 0 || _y == 0)
    if (foodIsOnSnake || outOfBonds) createPray();
    else prayBody(_x, _y);
    pray.x = _x;
    pray.y = _y;
  });
};
let collisionCheck = (head) => {
  
    if((head.x < 0 || head.y < 0) || (head.x >= UI_CONFIG.fieldWidth - 10 || head.y >= UI_CONFIG.fieldHeight - 10)){
      console.log('udarac...','\n','snake',snake,'x',head.x,'y',head.y);
      hitTheObstacle = true;
    }
    
};

let selfCollisionCheck = (head) => {
  for(var i=0;i < snake.length;i++){
    if(i!=0){
      if(snake[i].x === head.x && snake[i].y === head.y){
        hitTheObstacle = true;
        
      }
    }
  }
  
}
let moveSnake = () => {
  var leftRightMax = UI_CONFIG.fieldWidth - 10;
  if (currentDirection == "right") {
      snakeHead = { x: snake[0].x + GAME_CONFIG.snakePartSize, y: snake[0].y };

  } else if (currentDirection == "up") {
      snakeHead = { x: snake[0].x, y: snake[0].y - GAME_CONFIG.snakePartSize };
    
  } else if (currentDirection == "down") {
    snakeHead = { x: snake[0].x, y: snake[0].y + GAME_CONFIG.snakePartSize };
  } else if (currentDirection == "left") {
    snakeHead = { x: snake[0].x - GAME_CONFIG.snakePartSize, y: snake[0].y };
  }
  snake.unshift(snakeHead);
  if (!eatingPray()) {
    snake.pop();
    
  } else {
    points += 10;
    document.getElementById("score").innerHTML = points;
    createPray(snake);
  }
  selfCollisionCheck(snakeHead);
};
let eatingPray = () => {
  let snakeHeadX = snake[0].x;
  let snakeHeadY = snake[0].y;
  if (snakeHeadX == pray.x && snakeHeadY == pray.y) {
    return true;
  }
};


let directSnake = event => {
  const leftKey = 37;
  const rightKey = 39;
  const upKey = 38;
  const downKey = 40;
  const space = 32;
  const keyPressed = event.keyCode;

  if (keyPressed == leftKey && currentDirection != "right") {
    currentDirection = "left";
  } else if (keyPressed == rightKey && currentDirection != "left") {
    currentDirection = "right";
  } else if (keyPressed == upKey && currentDirection != "down") {
    currentDirection = "up";
  } else if (keyPressed == downKey && currentDirection != "up") {
    currentDirection = "down";
  } else if (keyPressed == space){
    pauseGame();
  }
};

let pauseGame = ()=>{
  isPaused === true ? isPaused = false: isPaused = true;  
  if(isPaused){
    clearInterval(game);
  } else {
    game = setInterval(gameMech, GAME_CONFIG.snakeSpeed);
   
  }
}


// Getting directions for the snake
document.body.addEventListener("keydown", directSnake);


let gameInit = () => {
  time = 0;
  points = 0;
  document.getElementById("score").innerHTML = points;

  currentDirection = 'right'
  hitTheObstacle = false;
  gameStarted = true;
  snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 }
  ];
  snakeHead = {x:0,y:0}
  clearCanvas();
  drawSnake(snake);
  createPray(snake);
  moveSnake();
  game = setInterval(gameMech, GAME_CONFIG.snakeSpeed);
};


gameInit();



function gameMech(){
  if (gameStarted) {
    blinkInterval++;
    drawGame();
  }
}


function randomNum(min, max) {
  let number = Math.floor(Math.random() * (max - min + 1) + min);
  return number;
}