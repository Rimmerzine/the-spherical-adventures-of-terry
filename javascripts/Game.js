import CanvasRenderer from "./CanvasRenderer.js";
import {
  gameSettings,
  mapSettings,
  ballSettings,
  featureSwitches,
} from "./Settings.js";
import Ball from "./Ball.js";
import Wall from "./Wall.js";
import Position2D from "./Position2D.js";
import Vector2D from "./Vector2D.js";
import InputManager from "./InputManager.js";

class Game {
  constructor(canvas) {
    this.renderer = new CanvasRenderer(canvas);
    this.inputManager = new InputManager();
    this.ball = null;
    this.walls = [];
    this.floor = [];
  }

  createBall() {
    this.ball = new Ball(
      new Position2D(
        ballSettings.displayXPosition,
        ballSettings.startingYPosition
      ),
      ballSettings.startingRadius
    );
  }

  createAndAddWall(startPos, endPos) {
    this.walls.push(new Wall(startPos, endPos));
  }

  generateTerrain() {
    // this.createAndAddWall(new Position2D(500, 750), new Position2D(700, 550));

    // Create a section of floor which is all flat for the starting point
    for (let i = 0; i < mapSettings.flatFloorCount; i++) {
      const startPosition = new Position2D(
        mapSettings.floorSegmentWidth * i,
        mapSettings.floorStartingHeight
      );
      const endPosition = startPosition.add(
        new Vector2D(mapSettings.floorSegmentWidth, 0)
      );
      this.createAndAddWall(startPosition, endPosition);
      if (featureSwitches.curvedFlooringSwitch) {
        this.floor.push(startPosition);
      }
    }

    let lastHeight = mapSettings.floorStartingHeight;
    for (let i = 0; i <= mapSettings.floorSegmentCount; i++) {
      const nextHeight = calculateNextHeight(i, lastHeight);
      const startPosition = calculateStartPosition(i, lastHeight);
      const endPosition = calculateEndPosition(i, nextHeight);
      this.createAndAddWall(startPosition, endPosition);
      this.floor.push(endPosition);
      lastHeight = endPosition.y;
    }
  }

  initialise() {
    this.createBall();
    this.generateTerrain();
  }

  draw() {
    this.renderer.clearCanvas();
    this.renderer.drawBall(this.ball);
    this.renderer.drawWalls(this.walls, this.ball.position.x);
    if (featureSwitches.curvedFlooringSwitch) {
      this.renderer.drawCurvedWalls(this.floor, this.ball.position.x);
      this.renderer.drawClosestPositionOnFloor(this.floor, this.ball);
    }
  }

  update() {}

  handleInputs() {
    if (this.inputManager.isLeftPressed()) this.ball.pushLeft();
    if (this.inputManager.isRightPressed()) this.ball.pushRight();
    if (this.inputManager.isJumpPressed()) this.ball.jump();
  }

  gameLoop() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (
        gameSettings.times.length > 0 &&
        gameSettings.times[0] <= now - 1000
      ) {
        gameSettings.times.shift();
      }
      gameSettings.times.push(now);
      gameSettings.fps = gameSettings.times.length;

      this.gameLoop();
    });

    this.draw();
    this.handleInputs();
    this.update();

    this.ball.update(this.walls, this.floor);
  }

  start() {
    this.gameLoop();
  }
}

export default Game;

// Add the rest of the floor segments which adjust on height
function calculateNextHeight(index, lastHeight) {
  const { floorStartingHeight } = mapSettings;
  const maxPossibleHeight = floorStartingHeight - 50 - index / 2;
  const maxAllowedDifference = index / 10;

  const allowedMinimum =
    lastHeight + maxAllowedDifference > floorStartingHeight
      ? lastHeight + maxAllowedDifference
      : floorStartingHeight;
  const allowedMaximum =
    lastHeight - maxAllowedDifference < maxPossibleHeight
      ? lastHeight - maxAllowedDifference
      : maxPossibleHeight;

  return Math.ceil(
    Math.random() * (allowedMinimum - allowedMaximum + 1) + allowedMaximum
  );
}

function calculateStartPosition(index, height) {
  const x =
    mapSettings.floorSegmentWidth * index +
    mapSettings.floorSegmentWidth * mapSettings.flatFloorCount;
  const y = height;
  return new Position2D(x, y);
}

function calculateEndPosition(index, height) {
  const x =
    mapSettings.floorSegmentWidth * (index + 1) +
    mapSettings.floorSegmentWidth * mapSettings.flatFloorCount;
  const y = height;
  return new Position2D(x, y);
}

// ATTEMPT AT GRADUAL CURVES

// let previousX = mapSettings.floorSegmentWidth * mapSettings.flatFloorCount;
// let previousY = mapSettings.floorStartingHeight;

// for (let i = 0; i < mapSettings.floorSegmentCount; i++) {
//   const startPos = new Position2D(previousX, previousY);
//   const endPos = new Position2D(
//     previousX + mapSettings.floorSegmentWidth,
//     mapSettings.floorStartingHeight +
//       Math.sin(
//         i *
//           (mapSettings.floorSegmentWidth /
//             (Math.random() * (1000 + i / mapSettings.floorSegmentWidth)))
//       ) *
//         (Math.random() * (50 + i / mapSettings.floorSegmentWidth))
//   );
//   this.createAndAddWall(startPos, endPos);
//   previousX = endPos.x;
//   previousY = endPos.y;
// }
