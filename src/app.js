const { body } = document;

const canvas = document.createElement('canvas');

body.appendChild(canvas);

let squarePositionX = 0;
let squarePositionY = 0;
const MyGame = {};

let moveUp = false;
let moveRight = false;
let moveDown = false;
let moveLeft = false;

canvas.setAttribute('width', '600px');
canvas.setAttribute('height', '600px');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(216,71,83)';
ctx.fillRect(squarePositionX, squarePositionY, 30, 30);

function handleKeyDown(key) {
  // console.log(key);

  switch (key) {
    case 'ArrowLeft':
      // squarePositionX -= increment;
      moveLeft = true;
      break;
    case 'ArrowRight':
      // squarePositionX += increment;
      moveRight = true;
      break;
    case 'ArrowUp':
      // squarePositionY -= increment;
      moveUp = true;
      break;
    case 'ArrowDown':
      // squarePositionY += increment;
      moveDown = true;
      break;
    case 'Escape':
      window.cancelAnimationFrame(MyGame.stopMain);
      break;
    default:
      break;
  }
}

function handleKeyUp(key) {
  switch (key) {
    case 'ArrowLeft':
      // squarePositionX -= increment;
      moveLeft = false;
      break;
    case 'ArrowRight':
      // squarePositionX += increment;
      moveRight = false;
      break;
    case 'ArrowUp':
      // squarePositionY -= increment;
      moveUp = false;
      break;
    case 'ArrowDown':
      // squarePositionY += increment;
      moveDown = false;
      break;
    default:
      break;
  }
}

document.addEventListener('keydown', (event) => handleKeyDown(event.key));
document.addEventListener('keyup', (event) => handleKeyUp(event.key));
const increment = 2;

const maze = [];
const size = 10;

function createMaze() {
  for (let i = 0; i < size; i++) {
    maze[i] = [];
    for (let j = 0; j < size; j++) {
      maze[i][j] = {
        visited: false,
        north: false,
        east: false,
        south: false,
        west: false,
      };
    }
  }
  // console.log(maze);
}

createMaze();

function getUnvisitedNeighbor(currentPosition) {
  const [currentX, currentY] = currentPosition;
  const max = 4;
  const min = 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  switch (randomNumber) {
    case 1:
      break;
  }
}

function createPath(position) {
  const [x, y] = position;
  maze[x][y].visited = true;
}

createPath([0, 0]);

(() => {
  function main() {
    MyGame.stopMain = window.requestAnimationFrame(main);
    // Your main loop contents
    ctx.clearRect(squarePositionX, squarePositionY, 30, 30);
    if (moveLeft) squarePositionX -= increment;
    if (moveRight) squarePositionX += increment;
    if (moveUp) squarePositionY -= increment;
    if (moveDown) squarePositionY += increment;

    ctx.fillRect(squarePositionX, squarePositionY, 30, 30);
  }

  main(); // Start the cycle
})();
