import CanvasRenderer from "./CanvasRenderer.js";
import CollisionDetection from "./CollisionDetection.js";
import { gameSettings, debugSettings } from "./Settings.js";
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
    this.canvas = canvas;

    const startingHeight = (canvas.offsetHeight * 2) / 3;
    this.tarmacTerrainSettings = new TerrainSettings(
      300,
      10,
      1000,
      startingHeight,
      startingHeight + 100,
      startingHeight - 100,
      startingHeight + 1000,
      startingHeight - 1000,
      200,
      500,
      1.0,
      "rgb(50, 50, 50)",
      "rgb(20, 20, 20)"
    );

    this.iceTerrainSettings = new TerrainSettings(
      300,
      10,
      1000,
      startingHeight,
      startingHeight + 100,
      startingHeight - 100,
      startingHeight + 1000,
      startingHeight - 1000,
      200,
      500,
      0.02,
      "rgb(30, 130, 200)",
      "rgb(50, 180, 255)"
    );

    this.grasslandsTerrainSettings = new TerrainSettings(
      300,
      10,
      1000,
      startingHeight,
      startingHeight + 1000,
      startingHeight - 1000,
      startingHeight + 10000,
      startingHeight - 10000,
      200,
      1000,
      0.5,
      "green",
      "brown"
    );

    this.renderer = new CanvasRenderer(canvas);
    this.inputManager = new InputManager(this);
    this.ball = null;
    this.terrainManager = new TerrainManager(this.grasslandsTerrainSettings);
    this.collisionDetection = new CollisionDetection();
    this.clouds = [];
    this.distanceReached = 0;
    this.points = 0;
    this.requiredDelay = 0;

    this.lastTime = Date.now();
  }

  resize() {
    const canvasContainer = document.getElementById("canvas-container");
    this.ball.attributes.startingPosition.x = canvasContainer.offsetWidth / 2;
    this.ball.attributes.startingPosition.y = canvasContainer.offsetHeight / (3 / 2) - 100;
  }

  resetLevel(level) {
    if (level == "grass") this.terrainManager.terrainSettings = this.grasslandsTerrainSettings;
    else if (level == "tarmac") this.terrainManager.terrainSettings = this.tarmacTerrainSettings;
    else this.terrainManager.terrainSettings = this.iceTerrainSettings;

    const newDistance = Math.max(0, this.ball.attributes.position.x - this.distanceReached);
    const pointsGained = Math.floor(newDistance / 5000);

    this.distanceReached = this.ball.attributes.position.x - this.ball.attributes.startingPosition.x;
    this.points += pointsGained;
    document.getElementById("points-attribute").innerText = `Total points: ${this.points}`;

    this.initialise();
  }

  createBall() {
    const canvasContainer = document.getElementById("canvas-container");
    const ballAttributes = new BallAttributes(
      new Position2D(canvasContainer.offsetWidth / 2, canvasContainer.offsetHeight / (3 / 2) - 100),
      100,
      "yellow",
      new Vector2D(0, -200)
    );

    const ballStats = new BallStats()
      .add("max-rpm", new BallStat(1, 5, [1, 3, 7, 13, 21]))
      .add("acceleration", new BallStat(0.01, 0.01, [1, 3, 7, 13, 21]))
      .add("grip", new BallStat(0.1, 0.1, [2, 5, 11]))
      .add("jumps", new BallStat(0, 1, [5, 20]));

    this.ball = new Ball(ballAttributes, ballStats);
  }

  generateClouds() {
    this.clouds = [];
    const curveCount = this.terrainManager.terrainSettings.curveCount;
    const segmentWidth = this.terrainManager.terrainSettings.segmentWidth;
    for (let i = 0; i <= curveCount * 2; i++) {
      const cloud = {
        x: i * segmentWidth * 2 + Math.random() * 250,
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
    this.renderer.drawClouds(this.clouds, this.ball);
    this.renderer.drawCurvedWalls(this.terrainManager, this.ball);
    this.renderer.drawBall(this.ball);
    this.renderer.drawFps(gameSettings.fps);
    if (debugSettings.debugMode) {
      this.renderer.drawDebugInformation(this.ball);
    }
  }

  update() {
    let currentTime = Date.now();
    let deltaTime = Math.min(1 / 30, (currentTime - this.lastTime) / 1000); // convert to seconds
    this.lastTime = currentTime;

    if (this.inputManager.isLeftPressed()) this.ball.pushLeft();
    if (this.inputManager.isRightPressed()) this.ball.pushRight();
    if (this.inputManager.isJumpPressed()) this.ball.jump();

    this.ball.update(deltaTime);
    this.collisionDetection.ballFloorCollision(this.ball, this.terrainManager, deltaTime);
    this.ball.move(deltaTime);
  }

  gameLoop() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (gameSettings.times.length > 0 && gameSettings.times[0] <= now - 1000) {
        gameSettings.times.shift();
      }
      gameSettings.times.push(now);
      gameSettings.fps = gameSettings.times.length;

      // setTimeout(() => {
      this.draw();
      this.update();

      this.gameLoop();
      // }, 1000 / 60);
    });
  }

  start() {
    this.gameLoop();
  }
}

export default Game;
