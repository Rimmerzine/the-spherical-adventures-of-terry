import CanvasRenderer from './CanvasRenderer.js';
import CollisionDetection from './CollisionDetection.js';
import {DebugSettings, GameSettings, Gravity} from './Settings.js';
import Ball from './ball/Ball.js';
import {Position2D} from './utils/Position2D.js';
import InputManager from './InputManager.js';
import TerrainSettings from './terrain/TerrainSettings.js';
import {Cloud} from './background/Cloud.js';
import {Camera} from './Camera.js';
import { playerStats } from './player/PlayerStats.js';
import { Eye } from './background/Eye.js';
import { Star } from './background/Star.js';
import { CollectablePoint, Level } from './level/Level.js';
import { LevelGenerator } from './level/LevelGenerator.js';
import { LevelSettings } from './level/LevelSettings.js';
import { Snow } from './background/Snow.js';
import { Player } from './player/Player.js';

class GameManager {
  renderer: CanvasRenderer;
  inputManager: InputManager;
  levelGenerator: LevelGenerator;
  collisionDetection: CollisionDetection;
  distanceReached: number;
  totalPoints: number;
  requiredDelay: number;
  lastTime: number;
  camera: Camera;
  levelSettings: Map<string, LevelSettings>;
  currentLevel: Level;
  player: Player;

  constructor(canvas: HTMLCanvasElement) {
    this.player = new Player();
    this.camera = new Camera(this.player.ball);
    this.renderer = new CanvasRenderer(canvas, this.camera);
    this.inputManager = new InputManager(this);
    this.levelGenerator = new LevelGenerator();
    this.collisionDetection = new CollisionDetection();
    this.distanceReached = 0;
    this.totalPoints = 0;
    this.requiredDelay = 0;
    this.lastTime = Date.now();

    const grasslandsLevelSettings: LevelSettings = new LevelSettings(
      "grasslands",
      new TerrainSettings(400, 5, 1000, 1000, -2000, 0, -20000, 150, 800, 0.4, 0.6, 'rgb(0, 130, 0)', 'rgb(100, 50, 0)'),
      10,
      "rgb(150, 210, 255)",
      Gravity,
      (position: Position2D) => new Cloud(position)
    );

    const tarmacLevelSettings: LevelSettings = new LevelSettings(
      "tarmac",
      new TerrainSettings(300, 10, 1000, 100, -100, 1000, -1000, 200, 500, 1.0, 0.6, 'rgb(50, 50, 50)', 'rgb(20, 20, 20)'),
      10,
      "rgb(150, 210, 255)",
      Gravity,
      (position: Position2D) => new Cloud(position)
    );

    const iceLevelSettings: LevelSettings = new LevelSettings(
      "ice",
      new TerrainSettings(300, 10, 1000, 100, -100, 1000, -1000, 200, 500, 0.02, 0.6, 'rgb(30, 130, 200)', 'rgb(50, 180, 255)'),
      100,
      "rgb(180, 225, 255)",
      Gravity,
      (position: Position2D) => new Snow(position)
    );

    const hellLevelSettings: LevelSettings = new LevelSettings(
      "hell",
      new TerrainSettings(300, 10, 1000, 1000, -2000, 0, -20000, 250, 1000, 1, 0, "rgb(75, 25, 25)", "rgb(100, 0, 0)"),
      10,
      "rgb(45, 0, 0)",
      Gravity,
      (position: Position2D) => new Eye(position)
    );

    const moonLevelSettings: LevelSettings = new LevelSettings(
      "moon",
      new TerrainSettings(400, 10, 1000, 1000, -2000, 0, -20000, 250, 1000, 0.2, 0.6, "rgb(75, 75, 75)", "rgb(50, 50, 50)"),
      100,
      "rgb(5, 5, 5)",
      Gravity.multiply(0.2),
      (position: Position2D) => new Star(position)
    );

    const holyMolyLevelSettings: LevelSettings = new LevelSettings(
      "holymoly",
      new TerrainSettings(400, 5, 1000, 1000, -2000, 0, -20000, 150, 800, 0.4, 0.6, 'rgb(0, 130, 0)', 'rgb(100, 50, 0)', true),
      10,
      "rgb(150, 210, 255)",
      Gravity,
      (position: Position2D) => new Cloud(position)
    );

    this.levelSettings = new Map<string, LevelSettings>(
      [
        ["grasslands", grasslandsLevelSettings],
        ["tarmac", tarmacLevelSettings],
        ["ice", iceLevelSettings],
        ["hell", hellLevelSettings],
        ["moon", moonLevelSettings],
        ["holymoly", holyMolyLevelSettings]
      ]
    );

    this.currentLevel = this.levelGenerator.generateLevel(this.player, this.levelSettings.get("grasslands"));
  }

  resetLevel(level: string) {
    const newDistance = Math.max(0, this.player.ball.position.x - this.distanceReached);
    const pointsGained = Math.floor(newDistance / 5000);

    this.distanceReached = this.player.ball.position.x;
    this.totalPoints += pointsGained;

    playerStats.addDistanceTravelled(this.distanceReached);
    playerStats.addPointsEarned(pointsGained);

    document.getElementById('total-points-attribute').innerText = this.totalPoints.toFixed(1).toString();

    this.player.ball.resetPosition();

    this.currentLevel = this.levelGenerator.generateLevel(this.player, this.levelSettings.get(level));

    playerStats.addNumberOfResets();
  }

  draw(): void {

    this.currentLevel.draw(this.renderer);
    this.renderer.drawBall(this.player.ball);
    this.renderer.drawFps(GameSettings.fps);
    if (DebugSettings.debugMode) {
      this.renderer.drawDebugInformation(this.player.ball);
    }

  }

  update(): void {
    const currentTime: number = Date.now();
    const deltaTime: number = Math.min(1 / 30, (currentTime - this.lastTime) / 1000); // convert to seconds
    this.lastTime = currentTime;

    if (this.inputManager.isLeftPressed()) this.player.ball.pushLeft(deltaTime);
    if (this.inputManager.isRightPressed()) this.player.ball.pushRight(deltaTime);
    if (this.inputManager.isJumpPressed()) this.player.ball.jump();

    this.player.ball.update(this.currentLevel.gravity, deltaTime);
    this.collisionDetection.ballFloorCollision(this.player.ball, this.currentLevel.terrain, deltaTime);
    this.player.ball.move(deltaTime);

    this.currentLevel.collectables.forEach(collectable => {
      const diffXSquared = (this.player.ball.position.x - collectable.position.x) ** 2;
      const diffYSquared = (this.player.ball.position.y - collectable.position.y) ** 2;
      if(diffXSquared + diffYSquared <= (this.player.ball.attributes.radius + CollectablePoint.size / 2) ** 2) {
        this.player.collectPoint(this.currentLevel.name, collectable.position);

        this.currentLevel.collectables = this.currentLevel.collectables.filter(c => c != collectable);

        if(!collectable.collected) {
          this.totalPoints += 1;
        } else {
          this.totalPoints += 0.1;
        }

        document.getElementById('total-points-attribute').innerText = this.totalPoints.toFixed(1).toString();
      }
    });

    playerStats.trackRelevantStats(this.player.ball);
  }

  manageFps(): void {
    const now = performance.now();
    while (
      GameSettings.times.length > 0 &&
      GameSettings.times[0] <= now - 1000
    ) {
      GameSettings.times.shift();
    }
    GameSettings.times.push(now);
    GameSettings.fps = GameSettings.times.length;
  }

  play() {
    window.requestAnimationFrame(() => {
      this.manageFps();
      this.draw();
      this.update();
      this.play();
    });
  }
}

export {GameManager};
