const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const audio = document.getElementById('backgroundMusic');
const keyboard = document.getElementById('keyboard');
const upBtn = document.getElementById('upBtn');
const leftBtn = document.getElementById('leftBtn');
const downBtn = document.getElementById('downBtn');
const rightBtn = document.getElementById('rightBtn');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const nigiriSize = 40;
const snakeHeadSize = 40;

// Snake
let snake = [{ x: 10, y: 10 }];
let dx = 0;
let dy = 0;

// Nigiri food
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
};
const nigiriImg = new Image();
nigiriImg.src = 'flappy_caribbean.png.png';

// Snake head image
const snakeHeadImg = new Image();
snakeHeadImg.src = 'myface.png.png';

// Game state
let speed = 7;
let score = 0;
let gameStarted = false;
let lastScore = 0; // Store last score

// Touch controls
let touchStartX = 0;
let touchStartY = 0;

// Event listeners
document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
upBtn.addEventListener('click', () => changeDirection({ keyCode: 38 }));
leftBtn.addEventListener('click', () => changeDirection({ keyCode: 37 }));
downBtn.addEventListener('click', () => changeDirection({ keyCode: 40 }));
rightBtn.addEventListener('click', () => changeDirection({ keyCode: 39 }));

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        canvas.style.display = 'block';
        keyboard.style.display = 'block'; // Show keyboard
        startButton.style.display = 'none';

        // Play music if not already playing
        if (audio.paused) {
            audio.play();
        }

        // Reset game variables
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
        speed = 7;
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
        };

        gameLoop();
    }
}

function gameLoop() {
    if (!gameStarted) return;
    setTimeout(() => {
        update();
        draw();
        gameLoop();
    }, 1000 / speed);
}

// Update game state
function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        speed += 0.5;
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
        };
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
        return;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }
}

// Draw everything
function draw() {
    ctx.fillStyle = '#2a9d8f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.drawImage(snakeHeadImg, segment.x * gridSize - (snakeHeadSize - gridSize) / 2, segment.y * gridSize - (snakeHeadSize - gridSize) / 2, snakeHeadSize, snakeHeadSize);
        } else {
            ctx.fillStyle = '#f4a261';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
    });

    ctx.drawImage(nigiriImg, food.x * gridSize - nigiriSize / 4, food.y * gridSize - nigiriSize / 4, nigiriSize, nigiriSize);

    ctx.fillStyle = '#d90429';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Keyboard and button controls
function changeDirection(event) {
    if (!gameStarted) return;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    switch (event.keyCode) {
        case LEFT: if (dx !== 1) { dx = -1; dy = 0; } break;
        case UP: if (dy !== 1) { dx = 0; dy = -1; } break;
        case RIGHT: if (dx !== -1) { dx = 1; dy = 0; } break;
        case DOWN: if (dy !== -1) { dx = 0; dy = 1; } break;
    }
}

// Touch controls
function handleTouchStart(event) {
    if (!gameStarted) return;
    event.preventDefault();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(event) {
    if (!gameStarted) return;
    event.preventDefault();
    const touch = event.touches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 20 && dx !== -1) { dx = 1; dy = 0; }
        else if (deltaX < -20 && dx !== 1) { dx = -1; dy = 0; }
    } else {
        if (deltaY > 20 && dy !== -1) { dx = 0; dy = 1; }
        else if (deltaY < -20 && dy !== 1) { dx = 0; dy = -1; }
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
}

// Reset game (without stopping music)
function resetGame() {
    lastScore = score; // Store last score before reset

    // Reset snake and game variables
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    speed = 7;
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
    };

    gameStarted = false;
    canvas.style.display = 'none';
    keyboard.style.display = 'none';
    startButton.style.display = 'block';

    // Show last score in the start button
    startButton.innerText = `Start Game (Last Score: ${lastScore})`;
}

const toggleMusicButton = document.getElementById('toggleMusicButton');

// Toggle Music Function
toggleMusicButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        toggleMusicButton.innerText = "Pause Music";
    } else {
        audio.pause();
        toggleMusicButton.innerText = "Play Music";
    }
});


// Wait for images to load
let imagesLoaded = 0;
const totalImages = 2;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // Images ready, waits for Start button
    }
}

nigiriImg.onload = checkImagesLoaded;
snakeHeadImg.onload = checkImagesLoaded;