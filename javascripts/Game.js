import CanvasRenderer from "./CanvasRenderer.js";
import CollisionDetection from "./CollisionDetection.js";
import {
  gameSettings,
  mapSettings,
  ballSettings,
  debugSettings,
} from "./Settings.js";
import Ball from "./Ball.js";
import Position2D from "./Position2D.js";
import InputManager from "./InputManager.js";

class Game {
  constructor(canvas) {
    this.renderer = new CanvasRenderer(canvas);
    this.inputManager = new InputManager();
    this.ball = null;
    this.floor = [];
    this.clouds = [];
  }

  resetLevel() {
    console.error("reset");
    this.initialise();
    this.inputManager.resetLevelPressed = false;
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

  generateTerrain() {
    this.floor = [];
    // Create a section of floor which is all flat for the starting point
    for (let i = 0; i < mapSettings.flatFloorCount; i++) {
      const position = new Position2D(
        mapSettings.floorSegmentWidth * i,
        mapSettings.floorStartingHeight
      );
      this.floor.push(position);
    }

    let lastHeight = mapSettings.floorStartingHeight;
    for (let i = 0; i <= mapSettings.floorSegmentCount; i++) {
      const nextHeight = calculateNextHeight(i, lastHeight);
      const endPosition = calculateNextPosition(i, nextHeight);
      this.floor.push(endPosition);
      lastHeight = endPosition.y;
    }

    console.debug(this.floor);
  }

  generateClouds() {
    this.clouds = [];
    for (let i = 0; i <= mapSettings.floorSegmentCount; i++) {
      const cloud = {
        x: i * mapSettings.floorSegmentWidth * 2 + Math.random() * 500,
        y: Math.random() * 500,
        size: 100,
        density: 30,
        seed: i + 1,
      };
      this.clouds.push(cloud);
    }
  }

  initialise() {
    this.createBall();
    this.generateTerrain();
    this.generateClouds();
  }

  draw() {
    this.renderer.clearCanvas();
    this.renderer.drawClouds(this.clouds, this.ball.position);
    this.renderer.drawCurvedWalls(this.floor, this.ball.position);
    if (debugSettings.debugMode) {
      this.renderer.drawDebugInformation(this.ball);
    }
    this.renderer.drawBall(this.ball);
    this.renderer.drawFps(gameSettings.fps);
  }

  update() {
    this.ball.update(this.walls, this.floor);
    CollisionDetection.ballFloorCollision(this.ball, this.floor);
    this.ball.move();
  }

  handleInputs() {
    if (this.inputManager.isLeftPressed()) this.ball.pushLeft();
    if (this.inputManager.isRightPressed()) this.ball.pushRight();
    if (this.inputManager.isJumpPressed()) this.ball.jump();
    if (this.inputManager.resetLevelPressed) this.resetLevel();
  }

  gameLoop() {
    window.setTimeout(() => {
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
    }, 1000 / debugSettings.targetFps);
  }

  start() {
    this.gameLoop();
  }
}

export default Game;

// Add the rest of the floor segments which adjust on height
function calculateNextHeight(index, lastHeight) {
  const { floorStartingHeight } = mapSettings;
  const maxPossibleHeight = floorStartingHeight - 125 - index;
  const maxAllowedDifference = index / 4;

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

function calculateNextPosition(index, height) {
  const x =
    mapSettings.floorSegmentWidth * index +
    mapSettings.floorSegmentWidth * mapSettings.flatFloorCount;
  const y = height;
  return new Position2D(x, y);
}
