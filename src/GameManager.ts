import CanvasRenderer from './CanvasRenderer.js';
import CollisionDetection from './CollisionDetection.js';
import {DebugSettings, GameSettings} from './Settings.js';
import Ball from './ball/Ball.js';
import {Position2D} from './utils/Position2D.js';
import InputManager from './InputManager.js';
import TerrainManager from './terrain/TerrainManager.js';
import TerrainSettings from './terrain/TerrainSettings.js';
import {BallAttributes} from './ball/BallAttributes.js';
import {BallStat, BallStats} from './ball/BallStats.js';
import {Vector2D} from './utils/Vector2D.js';
import {Cloud, CloudParticle} from './cloud/Cloud.js';
import {Camera} from './Camera.js';
import { playerStats } from './PlayerStats.js';
import { BackgroundObject } from './utils/BackgroundObject.js';

class GameManager {
  tarmacTerrainSettings: TerrainSettings;
  iceTerrainSettings: TerrainSettings;
  grasslandsTerrainSettings: TerrainSettings;
  renderer: CanvasRenderer;
  inputManager: InputManager;
  terrainManager: TerrainManager;
  collisionDetection: CollisionDetection;
  backgroundObjects: Array<BackgroundObject>;
  distanceReached: number;
  totalPoints: number;
  requiredDelay: number;
  lastTime: number;
  ball: Ball;
  camera: Camera;

  constructor(canvas: HTMLCanvasElement) {

    this.tarmacTerrainSettings = new TerrainSettings(
      300,
      10,
      1000,
      100,
      -100,
      1000,
      -1000,
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
      100,
      -100,
      1000,
      -1000,
      200,
      500,
      0.02,
      0.8,
      'rgb(30, 130, 200)',
      'rgb(50, 180, 255)'
    );

    this.grasslandsTerrainSettings = new TerrainSettings(
      400,
      5,
      1000,
      0,
      -2000,
      0,
      -20000,
      150,
      800,
      0.4,
      0.8,
      'rgb(0, 130, 0)',
      'rgb(100, 50, 0)'
    );

    this.camera = new Camera();

    this.renderer = new CanvasRenderer(canvas, this.camera);
    this.inputManager = new InputManager(this);
    this.terrainManager = new TerrainManager(this.grasslandsTerrainSettings);
    this.collisionDetection = new CollisionDetection();
    this.backgroundObjects = [];
    this.distanceReached = 0;
    this.totalPoints = 200;
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

    const newDistance = Math.max(0, this.ball.position.x - this.distanceReached);
    const pointsGained = Math.floor(newDistance / 5000);

    this.distanceReached = this.ball.position.x;
    this.totalPoints += pointsGained;

    playerStats.addDistanceTravelled(this.distanceReached);
    playerStats.addPointsEarned(pointsGained);

    document.getElementById('total-points-attribute').innerText =
      this.totalPoints.toString();

    this.ball.resetPosition();

    this.terrainManager.generateTerrain();
    this.generateClouds();

    playerStats.addNumberOfResets();
  }

  createBall() {
    const ballRadius: number = 100;
    const ballAttributes = new BallAttributes(
      new Position2D(
       0, -ballRadius
      ),
      ballRadius,
      'yellow',
      new Vector2D(0, -800)
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
    this.backgroundObjects = [];
    const curveCount = this.terrainManager.terrainSettings.curveCount;
    const segmentWidth = this.terrainManager.terrainSettings.segmentWidth;

    for (let i = -20; i <= curveCount + 20; i++) {
      const cloudPosition = new Position2D(
        i * segmentWidth + Math.random() * 500,
        Math.random() * 1500 - 750
      )
      const cloud = new Cloud(
        cloudPosition
      );

      this.backgroundObjects.push(cloud);
    }
  }

  initialise(): void {
    this.createBall();
    this.terrainManager.generateTerrain();
    this.generateClouds();
  }

  draw(): void {
    this.renderer.clearCanvas();
    this.renderer.drawBackgroundObjects(
      this.backgroundObjects
    );
    this.renderer.drawQuadraticFloor(this.terrainManager);

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

    playerStats.trackRelevantStats(this.ball);
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

export {GameManager};
