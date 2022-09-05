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

canvas.setAttribute('width', '800px');
canvas.setAttribute('height', '800px');
const ctx = canvas.getContext('2d');

const charSize = 15;

ctx.fillStyle = 'rgb(216,71,83)';
// ctx.fillRect(squarePositionX, squarePositionY, charSize, charSize);

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
const size = 30;

function createMaze() {
  for (let i = 0; i < size; i += 1) {
    maze[i] = [];
    for (let j = 0; j < size; j += 1) {
      maze[i][j] = {
        visited: false,
        north: true,
        east: true,
        south: true,
        west: true,
      };
    }
  }
  // console.log(maze);
}

createMaze();

function getUnvisitedNeighbor(currentPosition) {
  const [currentX, currentY] = currentPosition;

  const availableNeighbors = [];

  const isNorthAvailable = maze[currentX]?.[currentY - 1]?.visited === false;
  const isEastAvailable = maze[currentX + 1]?.[currentY]?.visited === false;
  const isSouthAvailable = maze[currentX]?.[currentY + 1]?.visited === false;
  const isWestAvailable = maze[currentX - 1]?.[currentY]?.visited === false;
  // TODO merge these two blocks
  if (isNorthAvailable) availableNeighbors.push('north');
  if (isWestAvailable) availableNeighbors.push('west');
  if (isSouthAvailable) availableNeighbors.push('south');
  if (isEastAvailable) availableNeighbors.push('east');

  // console.log(availableNeighbors);

  if (availableNeighbors.length === 0) {
    return null;
  }

  const min = 0;
  const max = availableNeighbors.length - 1;
  const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;

  return availableNeighbors[randomIndex];
}

function createPath(position) {
  const [x, y] = position;
  // console.log({ position });
  maze[x][y].visited = true;

  let whereToGo = getUnvisitedNeighbor(position);
  // console.log(whereToGo);

  while (whereToGo !== null) {
    maze[x][y][whereToGo] = false;
    switch (whereToGo) {
      case 'north':
        maze[x][y - 1].south = false;
        createPath([x, y - 1]);
        break;
      case 'east':
        maze[x + 1][y].west = false;
        createPath([x + 1, y]);
        break;
      case 'south':
        maze[x][y + 1].north = false;
        createPath([x, y + 1]);
        break;
      case 'west':
        maze[x - 1][y].east = false;
        createPath([x - 1, y]);
        break;
      default:
        break;
    }
    whereToGo = getUnvisitedNeighbor(position);
  }

  // console.log(maze);
}

createPath([0, 0]);

const gridWidth = 20;

function drawMap(canvasContext) {
  for (let x = 0; x < size; x += 1) {
    for (let y = 0; y < size; y += 1) {
      const { north, east, south, west } = maze[x][y];
      if (north) {
        canvasContext.beginPath();
        canvasContext.moveTo(x * gridWidth, y * gridWidth);
        canvasContext.lineTo(gridWidth + x * gridWidth, y * gridWidth);
        canvasContext.stroke();
      }
      if (east) {
        canvasContext.beginPath();
        canvasContext.moveTo(gridWidth + x * gridWidth, y * gridWidth);
        canvasContext.lineTo(
          gridWidth + x * gridWidth,
          gridWidth + y * gridWidth
        );
        canvasContext.stroke();
      }
      if (south) {
        canvasContext.beginPath();
        canvasContext.moveTo(
          gridWidth + x * gridWidth,
          gridWidth + y * gridWidth
        );
        canvasContext.lineTo(x * gridWidth, gridWidth + y * gridWidth);
        canvasContext.stroke();
      }
      if (west) {
        canvasContext.beginPath();
        canvasContext.moveTo(x * gridWidth, gridWidth + y * gridWidth);
        canvasContext.lineTo(x * gridWidth, y * gridWidth);
        canvasContext.stroke();
      }
    }
  }
}

// function removeRandomWalls() {
//   for (let i = 0; i < 150; i += 1) {
//     const min = 0;
//     const max = size - 1;
//     const randomX = Math.floor(Math.random() * (max - min + 1)) + min;
//     const randomY = Math.floor(Math.random() * (max - min + 1)) + min;
//
//     const randomWall = Math.floor(Math.random() * 4) + 1;
//     const walls = ['north', 'east', 'south', 'west'];
//     maze[randomX][randomY][walls[randomWall]] = false;
//   }
// }
//
// removeRandomWalls();

// TODO move the map to another canvas element
drawMap(ctx);

(() => {
  function main() {
    MyGame.stopMain = window.requestAnimationFrame(main);
    // Your main loop contents
    ctx.clearRect(squarePositionX, squarePositionY, charSize, charSize);
    if (moveLeft) squarePositionX -= increment;
    if (moveRight) squarePositionX += increment;
    if (moveUp) squarePositionY -= increment;
    if (moveDown) squarePositionY += increment;

    ctx.fillRect(squarePositionX, squarePositionY, charSize, charSize);
  }

  main(); // Start the cycle
})();
