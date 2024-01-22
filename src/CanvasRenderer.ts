import Ball from './Ball.js';
import {Cloud} from './Cloud.js';
import {DebugSettings} from './Settings.js';
import TerrainManager from './TerrainManager.js';

class CanvasRenderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d', {alpha: false});
  }

  drawFps(fps: number): void {
    this.context.font = '16px serif';
    this.context.strokeText(`${fps} fps`, 10, 20);
  }

  drawBall(ball: Ball) {
    const x = ball.attributes.startingPosition.x;
    const y = ball.attributes.startingPosition.y;
    const radius = ball.attributes.radius;
    const scale = 0.8 * radius;

    // Draw the gray background
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = 'gray';
    this.context.fill();
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.stroke();

    //Draw the lines from the center to the edge
    const angleStep = (2 * Math.PI) / 8;
    for (let i = 0; i < 8; i++) {
      const angle = i * angleStep + (ball.attributes.rotation * Math.PI) / 180;
      const lineEndX = x + radius * Math.cos(angle);
      const lineEndY = y + radius * Math.sin(angle);

      // Draw the line
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(lineEndX, lineEndY);
      this.context.stroke();
    }

    // Draw the yellow ball
    this.context.beginPath();
    this.context.arc(x, y, scale, 0, 2 * Math.PI);
    this.context.fillStyle = ball.attributes.colour;
    this.context.fill();
    this.context.stroke();

    // Calculate common values for the mouth and eye
    const mouthOffsetX = 0.7 * scale;
    const mouthRadius = scale / 2;
    const eyeOffsetX = 0.7 * scale;
    const eyeOffsetY = 0.2 * scale;
    const eyeRadius = scale / 6;
    const pupilOffsetX = 0.1 * scale;
    const pupilRadius = scale / 20;

    // Draw the mouth
    this.context.beginPath();
    this.context.arc(x + mouthOffsetX, y, mouthRadius, 1.3, Math.PI - 0.8);
    this.context.lineWidth = 2;
    this.context.stroke();

    // Draw the eye white
    this.context.beginPath();
    this.context.arc(x + eyeOffsetX, y - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
    this.context.fillStyle = 'white';
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();

    // Draw the pupil
    this.context.beginPath();
    this.context.arc(
      x + eyeOffsetX + pupilOffsetX,
      y - eyeOffsetY,
      pupilRadius,
      0,
      2 * Math.PI
    );
    this.context.fillStyle = 'black';
    this.context.fill();
  }

  drawCurvedWalls(terrainManager: TerrainManager, ball: Ball): void {
    const canvasMapLeft =
      ball.attributes.position.x - ball.attributes.startingPosition.x;
    const canvasMapRight = canvasMapLeft + this.canvas.width;
    const visibleTerrain = terrainManager.terrain.filter(
      floor =>
        floor.x >=
          canvasMapLeft - terrainManager.terrainSettings.segmentWidth * 3 &&
        floor.x <=
          canvasMapRight + terrainManager.terrainSettings.segmentWidth * 3
    );
    this.context.beginPath();
    this.context.lineWidth = 21;
    this.context.strokeStyle = terrainManager.terrainSettings.surfaceColour;
    this.context.fillStyle = terrainManager.terrainSettings.subsurfaceColour;
    this.context.moveTo(0, this.canvas.height);
    this.context.lineTo(
      visibleTerrain[0].x -
        ball.attributes.position.x +
        ball.attributes.startingPosition.x,
      visibleTerrain[0].y -
        ball.attributes.position.y +
        ball.attributes.startingPosition.y +
        10
    );

    for (let i = 1; i < visibleTerrain.length - 1; i++) {
      const cpx =
        visibleTerrain[i].x -
        ball.attributes.position.x +
        ball.attributes.startingPosition.x;
      const cpy =
        visibleTerrain[i].y -
        ball.attributes.position.y +
        ball.attributes.startingPosition.y +
        10;
      const x =
        (visibleTerrain[i].x + visibleTerrain[i + 1].x) / 2 -
        ball.attributes.position.x +
        ball.attributes.startingPosition.x;
      const y =
        (visibleTerrain[i].y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y +
          10 +
          visibleTerrain[i + 1].y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y +
          10) /
        2;

      this.context.quadraticCurveTo(cpx, cpy, x, y);
    }
    this.context.lineTo(this.canvas.width, this.canvas.height);
    this.context.stroke();
    this.context.fill();
  }

  drawCloud(x: number, y: number, size: number, density: number, seed: number) {
    // Set cloud color
    this.context.fillStyle = '#ffffff'; // Set the color to white (change it as desired)

    // Calculate the maximum and minimum circle radii
    const maxRadius = size / 2;
    const minRadius = maxRadius / 3;

    // Calculate the maximum and minimum circle positions
    const maxX = x + size;
    const minX = x - size;
    const maxY = y + size / 2;
    const minY = y - size / 2;

    const random = seededRandom(seed);

    // Draw random circles to create a fluffy cloud effect
    for (let i = 0; i < density; i++) {
      const radius = random() * (maxRadius - minRadius) + minRadius;
      const posX = random() * (maxX - minX) + minX;
      const posY = random() * (maxY - minY) + minY;

      // Draw the circle
      this.context.beginPath();
      this.context.arc(posX, posY, radius, 0, 2 * Math.PI);
      this.context.closePath();
      this.context.fill();
    }
  }

  drawClouds(clouds: Array<Cloud>, ball: Ball, segmentWidth: number) {
    const canvasMapLeft =
      ball.attributes.position.x - ball.attributes.startingPosition.x;
    const canvasMapRight = canvasMapLeft + this.canvas.width;

    const visibleClouds = clouds.filter(
      cloud =>
        cloud.x >= canvasMapLeft - segmentWidth * 3 &&
        cloud.x <= canvasMapRight + segmentWidth
    );

    for (let i = 0; i < visibleClouds.length; i++) {
      const cloud = visibleClouds[i];
      this.drawCloud(
        cloud.x -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x,
        cloud.y -
          (ball.attributes.position.y + ball.attributes.startingPosition.y) / 3,
        cloud.size,
        cloud.density,
        cloud.seed
      );
    }
  }

  clearCanvas() {
    this.context.fillStyle = 'rgb(150, 210, 255)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawDebugInformation(ball: Ball) {
    this.drawClosestPositionOnFloor(ball);
    this.drawNormalisedDisplacementVector(ball);
    this.drawBallVelocity(ball);
    this.drawReflectionVector(ball);
    this.drawCollisionFloors(ball);
    this.drawMovementLines(ball);
  }

  drawMovementLines(ball: Ball) {
    if (DebugSettings.drawMovementLines) {
      for (
        let i =
          ball.attributes.startingPosition.x -
          (ball.attributes.position.x - ball.attributes.startingPosition.x);
        i <=
        ball.attributes.startingPosition.x -
          (ball.attributes.position.x - ball.attributes.startingPosition.x) +
          1000;
        i += (2 * Math.PI * ball.attributes.radius) / 8
      ) {
        this.context.beginPath();
        this.context.moveTo(i, this.canvas.height);
        this.context.lineTo(i, 0);
        this.context.lineWidth = 1;
        this.context.stroke();
        this.context.closePath();
      }
    }
  }

  drawClosestPositionOnFloor(ball: Ball) {
    if (DebugSettings.closestPoint) {
      const position = DebugSettings.closestPoint;

      this.context.beginPath();
      this.context.arc(
        position.x -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x,
        position.y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y,
        10,
        0,
        2 * Math.PI
      );
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.stroke();
      this.context.closePath();
    }
  }

  drawNormalisedDisplacementVector(ball: Ball) {
    if (
      DebugSettings.closestPoint &&
      DebugSettings.normalisedDisplacementVector
    ) {
      const startPosition = DebugSettings.closestPoint;
      const vector = DebugSettings.normalisedDisplacementVector;
      const endPosition = startPosition.add(vector);
      this.context.beginPath();
      this.context.strokeStyle = 'red';
      this.context.moveTo(
        startPosition.x -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x,
        startPosition.y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y
      );
      this.context.lineTo(
        endPosition.x -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x,
        endPosition.y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y
      );
      this.context.stroke();
      this.context.closePath();
    }
  }

  drawBallVelocity(ball: Ball) {
    const startPosition = ball.attributes.position;
    const endPosition = ball.attributes.position.add(
      ball.attributes.velocity.multiply(0.2)
    );

    this.context.beginPath();
    this.context.strokeStyle = 'green';
    this.context.moveTo(
      startPosition.x -
        ball.attributes.position.x +
        ball.attributes.startingPosition.x,
      startPosition.y -
        ball.attributes.position.y +
        ball.attributes.startingPosition.y
    );
    this.context.lineTo(
      endPosition.x -
        ball.attributes.position.x +
        ball.attributes.startingPosition.x,
      endPosition.y -
        ball.attributes.position.y +
        ball.attributes.startingPosition.y
    );
    this.context.stroke();
    this.context.closePath();
  }

  drawReflectionVector(ball: Ball) {
    if (DebugSettings.closestPoint && DebugSettings.reflectionVector) {
      const startPosition = DebugSettings.closestPoint;
      const vector = DebugSettings.reflectionVector;
      const endPosition = DebugSettings.closestPoint.add(vector.multiply(2));

      this.context.beginPath();
      this.context.strokeStyle = 'purple';
      this.context.moveTo(
        startPosition.x -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x,
        startPosition.y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y
      );
      this.context.lineTo(
        endPosition.x -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x,
        endPosition.y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y
      );
      this.context.stroke();
      this.context.closePath();
    }
  }

  drawCollisionFloors(ball: Ball) {
    if (DebugSettings.collisionFloors) {
      this.context.beginPath();
      this.context.lineWidth = 3;
      this.context.strokeStyle = 'yellow';
      this.context.moveTo(
        DebugSettings.collisionFloors[0].x -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x,
        DebugSettings.collisionFloors[0].y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y
      );

      for (let i = 1; i < DebugSettings.collisionFloors.length - 1; i++) {
        const cpx =
          DebugSettings.collisionFloors[i].x -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x;
        const cpy =
          DebugSettings.collisionFloors[i].y -
          ball.attributes.position.y +
          ball.attributes.startingPosition.y;
        const x =
          (DebugSettings.collisionFloors[i].x +
            DebugSettings.collisionFloors[i + 1].x) /
            2 -
          ball.attributes.position.x +
          ball.attributes.startingPosition.x;
        const y =
          (DebugSettings.collisionFloors[i].y -
            ball.attributes.position.y +
            ball.attributes.startingPosition.y +
            DebugSettings.collisionFloors[i + 1].y -
            ball.attributes.position.y +
            ball.attributes.startingPosition.y) /
          2;

        this.context.quadraticCurveTo(cpx, cpy, x, y);
      }

      this.context.stroke();
      this.context.closePath();
    }
  }
}

export default CanvasRenderer;

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  const multiplier = 16807;
  const modulus = 2147483647;

  return function () {
    value = (value * multiplier) % modulus;
    return value / modulus;
  };
}
