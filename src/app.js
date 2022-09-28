const { body } = document;

const canvasWrapper = document.createElement('div');
const canvasPlayers = document.createElement('canvas');
const canvasMaze = document.createElement('canvas');

canvasWrapper.setAttribute('id', 'wrapper');
body.appendChild(canvasWrapper);
canvasWrapper.appendChild(canvasMaze);
canvasWrapper.appendChild(canvasPlayers);

let squarePositionX = 0;
let squarePositionY = 0;
const MyGame = {};

let moveUp = false;
let moveRight = false;
let moveDown = false;
let moveLeft = false;

canvasMaze.setAttribute('width', '800px');
canvasMaze.setAttribute('height', '800px');
const ctxMaze = canvasMaze.getContext('2d');

canvasPlayers.setAttribute('width', '800px');
canvasPlayers.setAttribute('height', '800px');
const ctxPlayers = canvasPlayers.getContext('2d');

const lineWidth = 1;
const playerSize = 10 - lineWidth * 2;
const gridWidth = 20;
const mazeSize = 30;
const increment = 1;

ctxPlayers.fillStyle = 'rgb(216,71,83)';
// ctxPlayers.fillRect(squarePositionX, squarePositionY, playerSize, playerSize);

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

const maze = [];

function createMaze() {
  for (let i = 0; i < mazeSize; i += 1) {
    maze[i] = [];
    for (let j = 0; j < mazeSize; j += 1) {
      maze[i][j] = {
        visited: false,
        // true means wall
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
    // false removes wall
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

function drawMap(canvasContext) {
  // eslint-disable-next-line no-param-reassign
  canvasContext.lineWidth = lineWidth;
  for (let x = 0; x < mazeSize; x += 1) {
    for (let y = 0; y < mazeSize; y += 1) {
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
//     const max = mazeSize - 1;
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

drawMap(ctxMaze);

// center player on initial cell
squarePositionX = (gridWidth - playerSize) / 2;
squarePositionY = (gridWidth - playerSize) / 2;

(() => {
  function main() {
    MyGame.stopMain = window.requestAnimationFrame(main);
    // Your main loop contents
    ctxPlayers.clearRect(
      squarePositionX,
      squarePositionY,
      playerSize,
      playerSize
    );

    // ---------------------------

    const playerCenterPositionX = squarePositionX + playerSize / 2;
    const playerCenterPositionY = squarePositionY + playerSize / 2;
    const currentCellXBasedOnPlayer = Math.floor(
      playerCenterPositionX / gridWidth
    );
    const currentCellYBasedOnPlayer = Math.floor(
      playerCenterPositionY / gridWidth
    );
    const currentCell =
      maze[currentCellXBasedOnPlayer][currentCellYBasedOnPlayer];

    const currentCellCenterPositionX =
      currentCellXBasedOnPlayer * gridWidth + gridWidth / 2;
    const currentCellCenterPositionY =
      currentCellYBasedOnPlayer * gridWidth + gridWidth / 2;

    if (moveLeft) {
      // ---------------------------
      let minPositionX = gridWidth / 2;
      const isThereAWall = currentCell.west;

      if (isThereAWall) {
        minPositionX = currentCellCenterPositionX;
      }
      if (playerCenterPositionX > minPositionX) {
        squarePositionX -= increment;
      }
    }

    if (moveRight) {
      // ---------------------------
      // can move right/east?
      let maxPositionX = Infinity;

      const isThereAWall = currentCell.east;

      if (isThereAWall) {
        maxPositionX = currentCellCenterPositionX;
      }

      if (playerCenterPositionX < maxPositionX) {
        squarePositionX += increment;
      }
    }

    if (moveUp) {
      // ---------------------------
      let minPositionY = gridWidth / 2;

      const isThereAWall = currentCell.north;

      if (isThereAWall) {
        minPositionY = currentCellCenterPositionY;
      }

      if (playerCenterPositionY > minPositionY) {
        squarePositionY -= increment;
      }
    }

    if (moveDown) {
      // ---------------------------
      // can move down/south?
      let maxPositionY = Infinity;

      const isThereAWall = currentCell.south;

      if (isThereAWall) {
        maxPositionY = currentCellCenterPositionY;
      }

      // console.log({
      //   playerCenterPositionX,
      //   playerCenterPositionY,
      //   currentCellXBasedOnPlayer,
      //   currentCellYBasedOnPlayer,
      //   isThereAWall,
      //   maxPositionY,
      //   currentCellCenterPositionY,
      // });

      if (playerCenterPositionY < maxPositionY) {
        squarePositionY += increment;
      }
    }

    ctxPlayers.fillRect(
      squarePositionX,
      squarePositionY,
      playerSize,
      playerSize
    );
  }

  main(); // Start the cycle
})();
