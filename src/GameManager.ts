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
import { Level } from './Level.js';
import { Terrain } from './terrain/Terrain.js';

class GameManager {
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
  currentLevel: Level;
  terrainSettings: Map<string, TerrainSettings>;

  constructor(canvas: HTMLCanvasElement) {

    const grasslandsSettings: TerrainSettings = new TerrainSettings(400, 5, 1000, 0, -2000, 0, -20000, 150, 800, 0.4, 0.8, 'rgb(0, 130, 0)', 'rgb(100, 50, 0)');

    this.camera = new Camera();
    this.renderer = new CanvasRenderer(canvas, this.camera);
    this.inputManager = new InputManager(this);
    this.terrainManager = new TerrainManager();
    this.collisionDetection = new CollisionDetection();
    this.backgroundObjects = [];
    this.distanceReached = 0;
    this.totalPoints = 200;
    this.requiredDelay = 0;
    this.lastTime = Date.now();

    const tarmacSettings: TerrainSettings = new TerrainSettings(300, 10, 1000, 100, -100, 1000, -1000, 200, 500, 1.0, 0.8, 'rgb(50, 50, 50)', 'rgb(20, 20, 20)');
    const iceSettings: TerrainSettings = new TerrainSettings(300, 10, 1000, 100, -100, 1000, -1000, 200, 500, 0.02, 0.8, 'rgb(30, 130, 200)', 'rgb(50, 180, 255)');

    this.terrainSettings = new Map<string, TerrainSettings>(
      [
        ["grass", grasslandsSettings],
        ["tarmac", tarmacSettings],
        ["ice", iceSettings]
      ]
    )
  }

  resetLevel(level: string) {
    const terrainSettings: TerrainSettings = this.terrainSettings.get(level);

    const newDistance = Math.max(0, this.ball.position.x - this.distanceReached);
    const pointsGained = Math.floor(newDistance / 5000);

    this.distanceReached = this.ball.position.x;
    this.totalPoints += pointsGained;

    playerStats.addDistanceTravelled(this.distanceReached);
    playerStats.addPointsEarned(pointsGained);

    document.getElementById('total-points-attribute').innerText =
      this.totalPoints.toString();

    this.ball.resetPosition();

    const terrain: Terrain = this.terrainManager.generateTerrain(terrainSettings);
    const backgroundObjects: Array<BackgroundObject> = this.generateClouds(terrainSettings);
    const backgroundColour: string = "rgb(150, 210, 255)";
    this.currentLevel = new Level(terrain, backgroundObjects, backgroundColour)

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

  generateClouds(terrainSettings: TerrainSettings): Array<BackgroundObject> {
    this.backgroundObjects = [];
    const curveCount = terrainSettings.curveCount;
    const segmentWidth = terrainSettings.segmentWidth;

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

    return this.backgroundObjects;
  }

  initialise(): void {
    const terrainSettings: TerrainSettings = this.terrainSettings.get("grass");
    const terrain: Terrain = this.terrainManager.generateTerrain(terrainSettings);
    const backgroundObjects: Array<BackgroundObject> = this.generateClouds(terrainSettings);
    const backgroundColour: string = "rgb(150, 210, 255)";
    this.currentLevel = new Level(terrain, backgroundObjects, backgroundColour)
    this.createBall();
  }

  draw(): void {
    this.renderer.clearCanvas(this.currentLevel.skyColour);
    this.renderer.drawBackgroundObjects(
      this.currentLevel.backgroundObjects
    );
    this.renderer.drawQuadraticFloor(this.currentLevel.terrain);

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
      this.currentLevel.terrain,
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
