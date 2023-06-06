import CanvasRenderer from "./CanvasRenderer.js";
import CollisionDetection from "./CollisionDetection.js";
import { gameSettings, ballSettings, debugSettings } from "./Settings.js";
import Ball from "./Ball.js";
import Position2D from "./Position2D.js";
import InputManager from "./InputManager.js";
import TerrainManager from "./TerrainManager.js";
import TerrainSettings from "./TerrainSettings.js";
import BallAttributes from "./BallAttributes.js";
import { BallStat, BallStats } from "./BallStats.js";
import Vector2D from "./Vector2D.js";

("use strict");

class Game {
  constructor(canvas) {
    const startingHeight = (canvas.offsetHeight * 2) / 3;
    const tarmainTerrainSettings = new TerrainSettings(
      150,
      10,
      1000,
      startingHeight,
      startingHeight + 50,
      startingHeight - 50,
      startingHeight + 500,
      startingHeight - 500,
      100,
      1000,
      1.0,
      "rgb(50, 50, 50)",
      "rgb(20, 20, 20)"
    );

    const iceTerrainSettings = new TerrainSettings(
      150,
      10,
      1000,
      startingHeight,
      startingHeight + 50,
      startingHeight - 50,
      startingHeight + 500,
      startingHeight - 500,
      100,
      1000,
      0.1,
      "rgb(30, 130, 200)",
      "rgb(50, 180, 255)"
    );

    const grasslandsTerrainSettings = new TerrainSettings(
      150,
      10,
      1000,
      startingHeight,
      startingHeight + 50,
      startingHeight - 50,
      startingHeight + 500,
      startingHeight - 500,
      100,
      1000,
      0.8,
      "green",
      "brown"
    );

    this.renderer = new CanvasRenderer(canvas);
    this.inputManager = new InputManager(this);
    this.ball = null;
    this.terrainManager = new TerrainManager(grasslandsTerrainSettings);
    this.clouds = [];
    this.distanceReached = 0;
    this.points = 0;
    this.requiredDelay = 0;
  }

  resetLevel() {
    const newDistance = Math.max(
      0,
      this.ball.attributes.position.x - this.distanceReached
    );
    const pointsGained = Math.floor(newDistance / 5000);

    this.distanceReached =
      this.ball.attributes.position.x - ballSettings.displayXPosition;
    this.points += pointsGained;
    document.getElementById(
      "points-attribute"
    ).innerText = `Total points: ${this.points}`;

    this.initialise();
  }

  createBall() {
    const ballAttributes = new BallAttributes(
      new Position2D(
        document.getElementById("canvas-container").offsetWidth / 2,
        document.getElementById("canvas-container").offsetHeight / (3 / 2) - 100
      ),
      50,
      "yellow",
      new Vector2D(0, -4)
    );

    const ballStats = new BallStats()
      .add("max-rpm", new BallStat(10, 5, [1, 3, 7, 13, 21]))
      .add("acceleration", new BallStat(0.025, 0.025, [1, 3, 7, 13, 21]))
      .add("grip", new BallStat(0.1, 0.1, [2, 5, 11]))
      .add("jumps", new BallStat(0, 1, [5, 20]));

    this.ball = new Ball(ballAttributes, ballStats);
  }

  generateClouds() {
    this.clouds = [];
    for (
      let i = 0;
      i <= this.terrainManager.terrainSettings.curveCount * 2;
      i++
    ) {
      const cloud = {
        x:
          i * this.terrainManager.terrainSettings.segmentWidth * 2 +
          Math.random() * 250,
        y: Math.random() * 750,
        size: 100,
        density: 30,
        seed: i + 1,
      };
      this.clouds.push(cloud);
    }
  }

  initialise() {
    this.createBall();
    this.terrainManager.generateTerrain();
    this.generateClouds();
  }

  draw() {
    this.renderer.clearCanvas();
    this.renderer.drawClouds(this.clouds, this.ball.attributes.position);
    this.renderer.drawCurvedWalls(this.terrainManager, this.ball);
    if (debugSettings.debugMode) {
      this.renderer.drawDebugInformation(this.ball);
    }
    this.renderer.drawBall(this.ball);
    this.renderer.drawFps(gameSettings.fps);
  }

  update() {
    if (this.inputManager.isLeftPressed()) this.ball.pushLeft();
    if (this.inputManager.isRightPressed()) this.ball.pushRight();
    if (this.inputManager.isJumpPressed()) this.ball.jump();

    this.ball.update(this.walls, this.terrainManager.terrain);
    CollisionDetection.ballFloorCollision(this.ball, this.terrainManager);
    this.ball.move();
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

      this.draw();
      this.update();

      this.gameLoop();
    });
  }

  start() {
    this.gameLoop();
  }
}

export default Game;
