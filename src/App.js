import { useEffect, useState } from 'react';
import './app.css';
import Canvas from './canvas';

const gridWidth = 26;

const mazeSize = 15;

function generateMaze(size = 5) {
  const maze = [];
  for (let x = 0; x < size; x++) {
    maze[x] = [];
    for (let y = 0; y < size; y++) {
      maze[x][y] = {
        north: Math.round(Math.random()),
        east: Math.round(Math.random()),
        south: Math.round(Math.random()),
        west: Math.round(Math.random()),
      };
    }
  }
  return maze;
}

const maze = generateMaze(mazeSize);

// for (let x = 0; x < mazeSize; x++) {
//   for (let y = 0; y < mazeSize; y++) {
//     console.log(
//       `${x} ${y} north`,
//       x * gridWidth,
//       y * gridWidth,
//       gridWidth + x * gridWidth,
//       y * gridWidth
//     );

//     console.log(
//       `${x} ${y} east`,
//       gridWidth + x * gridWidth,
//       gridWidth + y * gridWidth,
//       gridWidth + x * gridWidth,
//       y * gridWidth
//     );

//     console.log(
//       `${x} ${y} south`,
//       gridWidth + x * gridWidth,
//       gridWidth + y * gridWidth,
//       x * gridWidth,
//       gridWidth + y * gridWidth
//     );

//     console.log(
//       `${x} ${y} west`,
//       x * gridWidth,
//       y * gridWidth,
//       x * gridWidth,
//       gridWidth + y * gridWidth
//     );
//   }
// }

const player1 = {
  position: [0, 0],
};

// document.addEventListener('keydown', logKey);

// function logKey(e) {
//   switch (e.code) {
//     case 'ArrowRight':
//       if (player1.position[0] < mazeSize - 1) {
//         player1.position[0]++;
//       }
//       break;
//     case 'ArrowLeft':
//       if (player1.position[0] > 0) {
//         player1.position[0]--;
//       }
//       break;
//     case 'ArrowUp':
//       if (player1.position[1] > 0) {
//         player1.position[1]--;
//       }
//       break;
//     case 'ArrowDown':
//       if (player1.position[1] < mazeSize - 1) {
//         player1.position[1]++;
//       }
//       break;
//     default:
//       break;
//   }
//   // console.log(player1.position);
// }

// function getPlayerPosition() {
//   return [
//     player1.position[0] * gridWidth + 5,
//     player1.position[1] * gridWidth + 5,
//     gridWidth - 10,
//     gridWidth - 10,
//   ];
// }

// This whole classes logic is from:
// https://stackoverflow.com/a/56785149/785985
// https://codepen.io/anon/pen/LKzwpX
class MapRegion {
  constructor() {
    // this.img = img;
    this.w = gridWidth * mazeSize;
    this.h = gridWidth * mazeSize;
  }

  draw(ctx) {
    // Draw the borders around the maze
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(gridWidth * mazeSize, 0);
    // ctx.stroke();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(0, gridWidth * mazeSize);
    // ctx.stroke();
    // ctx.moveTo(gridWidth * mazeSize, gridWidth * mazeSize);
    // ctx.lineTo(0, gridWidth * mazeSize);
    // ctx.stroke();
    // ctx.moveTo(gridWidth * mazeSize, gridWidth * mazeSize);
    // ctx.lineTo(gridWidth * mazeSize, 0);
    // ctx.stroke();

    for (let x = 0; x < mazeSize; x++) {
      for (let y = 0; y < mazeSize; y++) {
        const { north, east, south, west } = maze[x][y];
        if (north) {
          ctx.beginPath();
          ctx.moveTo(x * gridWidth, y * gridWidth);
          ctx.lineTo(gridWidth + x * gridWidth, y * gridWidth);
          ctx.stroke();
        }
        if (east) {
          ctx.beginPath();
          ctx.moveTo(gridWidth + x * gridWidth, y * gridWidth);
          ctx.lineTo(gridWidth + x * gridWidth, gridWidth + y * gridWidth);
          ctx.stroke();
        }
        if (south) {
          ctx.beginPath();
          ctx.moveTo(gridWidth + x * gridWidth, gridWidth + y * gridWidth);
          ctx.lineTo(x * gridWidth, gridWidth + y * gridWidth);
          ctx.stroke();
        }
        if (west) {
          ctx.beginPath();
          ctx.moveTo(x * gridWidth, gridWidth + y * gridWidth);
          ctx.lineTo(x * gridWidth, y * gridWidth);
          ctx.stroke();
        }
      }
    }
  }
}

class Player {
  topKey = false;
  rightKey = false;
  bottomKey = false;
  leftKey = false;
  speed = 2;

  constructor(x, y, w, h) {
    this.w = w || gridWidth - 10;
    this.h = h || gridWidth - 10;
    // This is where the player will spawn relative to the map
    this.x = x || this.w;
    this.y = y || this.h;
  }

  update(map) {
    this.move();
    // Optional, so they don't walk out of map boundaries
    this.enclose(map);
  }

  move() {
    if (this.topKey) {
      this.y -= this.speed;
    }
    if (this.rightKey) {
      this.x += this.speed;
    }
    if (this.bottomKey) {
      this.y += this.speed;
    }
    if (this.leftKey) {
      this.x -= this.speed;
    }
    // console.log(this.x, this.y);
  }

  enclose(map) {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > map.w - this.w) {
      this.x = map.w - this.w;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > map.h - this.h) {
      this.y = map.h - this.h;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#990000';
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class Camera {
  constructor(x, y) {
    // x and y are top-left coordinates of the camera rectangle relative to the map.
    // This rectangle is exactly canvas.width px wide and canvas.height px tall.
    this.x = x || 0;
    this.y = y || 0;
  }

  focus(canvas, map, player) {
    const { devicePixelRatio: ratio = 1 } = window;
    // Account for half of player w/h to make their rectangle centered
    // console.log(player.x, canvas.width, map.w);
    this.x = this.clamp(
      player.x - canvas.width / 2 + player.w / 2,
      0,
      map.w - canvas.width
    );
    // console.log(player.x, canvas.width, player.w);
    this.y = this.clamp(
      player.y - canvas.height / 2 + player.h / 2,
      0,
      map.h - canvas.height
    );
  }

  clamp(coord, min, max) {
    // console.log(coord, min, max);
    if (coord < min) {
      return min;
    } else if (coord > max) {
      return max;
    } else {
      return coord;
    }
  }
}

class Controls {
  constructor(player) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'w') {
        player.topKey = true;
      } else if (e.key === 'd') {
        player.rightKey = true;
      } else if (e.key === 's') {
        player.bottomKey = true;
      } else if (e.key === 'a') {
        player.leftKey = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'w') {
        player.topKey = false;
      } else if (e.key === 'd') {
        player.rightKey = false;
      } else if (e.key === 's') {
        player.bottomKey = false;
      } else if (e.key === 'a') {
        player.leftKey = false;
      }
    });
  }
}

export default function App() {
  const map = new MapRegion();
  const player = new Player(5, 5);
  const camera = new Camera();
  const controls = new Controls(player);

  function draw(ctx, canvas, frameCount) {
    // ctx.fillStyle = '#990000';
    // ctx.fillRect(...getPlayerPosition());

    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reposition player
    player.update(map);

    // Focus camera
    camera.focus(canvas, map, player);

    // Flip the sign b/c positive shifts the canvas to the right, negative - to the left
    ctx.translate(-camera.x, -camera.y);

    // Draw
    map.draw(ctx);
    player.draw(ctx);

    // make this an image and load it into canvas,
    // instead of redrawing everything
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
    // ctx.drawImage(this.img, 0, 0)
    // https://stackoverflow.com/a/56785149/785985
    // for (let x = 0; x < mazeSize; x++) {
    //   for (let y = 0; y < mazeSize; y++) {
    //     const { north, east, south, west } = maze[x][y];
    //     if (north) {
    //       ctx.beginPath();
    //       ctx.moveTo(x * gridWidth, y * gridWidth);
    //       ctx.lineTo(gridWidth + x * gridWidth, y * gridWidth);
    //       ctx.stroke();
    //     }
    //     if (east) {
    //       ctx.beginPath();
    //       ctx.moveTo(gridWidth + x * gridWidth, y * gridWidth);
    //       ctx.lineTo(gridWidth + x * gridWidth, gridWidth + y * gridWidth);
    //       ctx.stroke();
    //     }
    //     if (south) {
    //       ctx.beginPath();
    //       ctx.moveTo(gridWidth + x * gridWidth, gridWidth + y * gridWidth);
    //       ctx.lineTo(x * gridWidth, gridWidth + y * gridWidth);
    //       ctx.stroke();
    //     }
    //     if (west) {
    //       ctx.beginPath();
    //       ctx.moveTo(x * gridWidth, gridWidth + y * gridWidth);
    //       ctx.lineTo(x * gridWidth, y * gridWidth);
    //       ctx.stroke();
    //     }
    //   }
    // }

    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // ctx.font = '24px serif';
    // ctx.fillText(`frame count : ${frameCount} :)`, 10, 50);
    // ctx.fillStyle = '#000000';
    // ctx.beginPath();
    // ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    // ctx.fill();
  }

  return (
    <>
      <Canvas draw={draw} options={{ context: '2d' }} />
    </>
  );
}
