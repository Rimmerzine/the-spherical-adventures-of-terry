import CanvasRenderer from "./CanvasRenderer.js";
import { gameSettings, mapSettings, ballSettings } from "./Settings.js";
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
  }

  createBall() {
    this.ball = new Ball(
      new Position2D(ballSettings.ballDisplayXPosition, 450),
      50
    );
  }

  createAndAddWall(startPos, endPos) {
    this.walls.push(new Wall(startPos, endPos));
  }

  initialise() {
    this.createBall();

    // Add the starting floor segments which are all flat
    for (let i = 0; i < mapSettings.flatFloorCount; i++) {
      const startPos = new Position2D(
        i * mapSettings.floorSegmentWidth,
        mapSettings.floorStartingHeight
      );
      const endPos = startPos.add(
        new Vector2D(mapSettings.floorSegmentWidth, 0)
      );
      this.createAndAddWall(startPos, endPos);
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

    // Add the rest of the floor segments which adjust on height
    let lastHeight = 0;
    for (let i = 0; i <= 1000; i++) {
      const newHeight = Math.random() * (100 * (i / 200) + 50);
      const floor = new Wall(
        new Position2D(
          mapSettings.floorSegmentWidth * i +
            mapSettings.floorSegmentWidth * mapSettings.flatFloorCount,
          mapSettings.floorStartingHeight - (i - 1) - lastHeight
        ),
        new Position2D(
          mapSettings.floorSegmentWidth * (i + 1) +
            mapSettings.floorSegmentWidth * mapSettings.flatFloorCount,
          mapSettings.floorStartingHeight - i - newHeight
        )
      );
      lastHeight = newHeight;
      this.walls.push(floor);
    }
  }

  draw() {
    this.renderer.clearCanvas();
    this.renderer.drawBall(this.ball);
    this.renderer.drawWalls(this.walls, this.ball.position.x);
  }

  update() {}

  handleInputs() {
    if (this.inputManager.isLeftPressed()) this.ball.pushLeft();
    if (this.inputManager.isRightPressed()) this.ball.pushRight();
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

    this.ball.update(this.walls);
  }

  start() {
    this.gameLoop();
  }
}

export default Game;
