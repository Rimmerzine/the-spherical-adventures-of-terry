import CanvasRenderer from './CanvasRenderer.js';
import CollisionDetection from './CollisionDetection.js';
import {GameSettings, DebugSettings} from './Settings.js';
import Ball from './Ball.js';
import {Position2D} from './Position2D.js';
import InputManager from './InputManager.js';
import TerrainManager from './TerrainManager.js';
import TerrainSettings from './TerrainSettings.js';
import {BallAttributes} from './BallAttributes.js';
import {BallStat, BallStats} from './BallStats.js';
import {Vector2D} from './Vector2D.js';
import {Cloud} from './Cloud.js';
import {Camera} from './Camera.js';

class Game {
  canvas: HTMLCanvasElement;
  tarmacTerrainSettings: TerrainSettings;
  iceTerrainSettings: TerrainSettings;
  grasslandsTerrainSettings: TerrainSettings;
  renderer: CanvasRenderer;
  inputManager: InputManager;
  terrainManager: TerrainManager;
  collisionDetection: CollisionDetection;
  clouds: Array<Cloud>;
  distanceReached: number;
  totalPoints: number;
  requiredDelay: number;
  lastTime: number;
  ball: Ball;
  camera: Camera;

  constructor(canvas: HTMLCanvasElement) {
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
      0.8,
      'rgb(50, 50, 50)',
      'rgb(20, 20, 20)'
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
      0.8,
      'rgb(30, 130, 200)',
      'rgb(50, 180, 255)'
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
      0.4,
      0.8,
      'rgb(0, 130, 0)',
      'rgb(100, 50, 0)'
    );

    this.camera = new Camera(canvas.width, canvas.height);

    this.renderer = new CanvasRenderer(this.canvas, this.camera);
    this.inputManager = new InputManager(this);
    this.terrainManager = new TerrainManager(this.grasslandsTerrainSettings);
    this.collisionDetection = new CollisionDetection();
    this.clouds = [];
    this.distanceReached = 0;
    this.totalPoints = 0;
    this.requiredDelay = 0;

    this.lastTime = Date.now();
  }

  resetLevel(level: string) {
    if (level === 'grass') {
      this.terrainManager.terrainSettings = this.grasslandsTerrainSettings;
    } else if (level === 'tarmac') {
      this.terrainManager.terrainSettings = this.tarmacTerrainSettings;
    } else {
      this.terrainManager.terrainSettings = this.iceTerrainSettings;
    }

    const newDistance = Math.max(
      0,
      this.ball.getPosition().x - this.distanceReached
    );
    const pointsGained = Math.floor(newDistance / 5000);

    this.distanceReached =
      this.ball.getPosition().x - this.ball.attributes.startingPosition.x;
    this.totalPoints += pointsGained;
    document.getElementById('total-points-attribute').innerText =
      this.totalPoints.toString();

    this.initialise();
  }

  createBall() {
    const canvasContainer = document.getElementById('canvas-container');
    const ballAttributes = new BallAttributes(
      new Position2D(
        canvasContainer.offsetWidth / 2,
        canvasContainer.offsetHeight / (3 / 2) - 100
      ),
      100,
      'yellow',
      new Vector2D(0, -400)
    );

    const ballStats = new BallStats()
      .add('max-rps', new BallStat(1, 0.25, [4, 7, 13, 22, 43]))
      .add('acceleration', new BallStat(1, 0.5, [4, 7, 13, 22, 43]))
      .add('grip', new BallStat(0.4, 0.1, [8, 15, 29]))
      .add('jumps', new BallStat(0, 1, [10, 40]));

    this.ball = new Ball(ballAttributes, ballStats);

    this.camera.attach(this.ball);
  }

  generateClouds() {
    this.clouds = [];
    const curveCount = this.terrainManager.terrainSettings.curveCount;
    const segmentWidth = this.terrainManager.terrainSettings.segmentWidth;
    for (let i = 0; i <= curveCount * 50; i++) {
      const cloud = new Cloud(
        i * segmentWidth + Math.random() * 500,
        Math.random() * 1500,
        100,
        25,
        i + 1
      );
      this.clouds.push(cloud);
    }
  }

  initialise(): void {
    this.createBall();
    this.terrainManager.generateTerrain();
    this.generateClouds();
  }

  draw(): void {
    this.renderer.clearCanvas();
    this.renderer.drawClouds(
      this.clouds,
      this.ball,
      this.terrainManager.terrainSettings.segmentWidth
    );
    this.renderer.drawCurvedWalls(this.terrainManager, this.ball);
    this.renderer.drawBall(this.ball);
    this.renderer.drawFps(GameSettings.fps);
    if (DebugSettings.debugMode) {
      this.renderer.drawDebugInformation(this.ball);
    }
  }

  update(): void {
    const currentTime: number = Date.now();
    const deltaTime: number = Math.min(
      1 / 30,
      (currentTime - this.lastTime) / 1000
    ); // convert to seconds
    this.lastTime = currentTime;

    if (this.inputManager.isLeftPressed()) this.ball.pushLeft(deltaTime);
    if (this.inputManager.isRightPressed()) this.ball.pushRight(deltaTime);
    if (this.inputManager.isJumpPressed()) this.ball.jump();

    this.ball.update(deltaTime);
    this.collisionDetection.ballFloorCollision(
      this.ball,
      this.terrainManager,
      deltaTime
    );
    this.ball.move(deltaTime);
  }

  gameLoop() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (
        GameSettings.times.length > 0 &&
        GameSettings.times[0] <= now - 1000
      ) {
        GameSettings.times.shift();
      }
      GameSettings.times.push(now);
      GameSettings.fps = GameSettings.times.length;

      // setTimeout(() => {
      this.draw();
      this.update();

      this.gameLoop();
    });
  }

  start() {
    this.gameLoop();
  }
}

export {Game};
