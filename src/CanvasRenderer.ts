import Ball from './ball/Ball.js';
import {Camera} from './Camera.js';
import { Position2D } from './utils/Position2D.js';
import { BackgroundObject } from './background/BackgroundObject.js';
import { DebugSettings } from './Settings.js';
import { Segment, Terrain } from './terrain/Terrain.js';
import { CollectablePoint } from './level/Level.js';

class CanvasRenderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  camera: Camera;

  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.camera = camera;
  }

  drawFps(fps: number): void {
    this.context.font = '50px arial';
    this.context.strokeText(`${fps} fps`, 25, 60);
  }

  drawBall(ball: Ball) {
    ball.draw(this.context, this.canvas.width, this.canvas.height);
  }

  drawSky(skyColour: string): void {
    this.context.fillStyle = skyColour;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawQuadraticFloor(terrain: Terrain): void {
    const cameraPosition: Position2D = this.camera.getPosition();
    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;
    const canvasMapLeft: number = cameraPosition.x - canvasWidth / 2;
    const canvasMapRight: number = canvasMapLeft + canvasWidth;
    const cameraCanvasOffsetX: number = this.camera.getPosition().x - canvasWidth / 2;
    const cameraCanvasOffsetY: number = this.camera.getPosition().y - canvasHeight / 2;
    
    const visibleTerrain = terrain.segments.filter(
      floor => {
        const previousMidPoint: number = floor.previousMidPoint.x;
        const nextMidPoint: number = floor.nextMidPoint.x;
        return nextMidPoint >= canvasMapLeft && previousMidPoint <= canvasMapRight;
      }
    );
    
    this.context.lineWidth = 21;
    this.context.strokeStyle = terrain.settings.surfaceColour;
    this.context.fillStyle = terrain.settings.subsurfaceColour;

    for (let i = 0; i < visibleTerrain.length; i++) {
      const currentSegment: Segment = visibleTerrain[i];

      const visualX1: number = currentSegment.previousMidPoint.x - cameraCanvasOffsetX;
      const visualY1: number = currentSegment.previousMidPoint.y - cameraCanvasOffsetY;
      const cpx = currentSegment.position.x - cameraCanvasOffsetX;
      const cpy = currentSegment.position.y - cameraCanvasOffsetY;
      const visualX2: number = currentSegment.nextMidPoint.x - cameraCanvasOffsetX;
      const visualY2: number = currentSegment.nextMidPoint.y - cameraCanvasOffsetY;

      let lowestY: number = Math.max(visualY1, visualY2, cpy);

      this.context.beginPath();
      this.context.moveTo(visualX1, lowestY);
      this.context.lineTo(visualX1, visualY1);
      this.context.quadraticCurveTo(cpx, cpy, visualX2 + 1, visualY2);
      this.context.lineTo(visualX2, lowestY);
      this.context.fill();

      this.context.fillRect(visualX1 - 1, lowestY - 1, (visualX2 - visualX1) + 2, (canvasHeight - lowestY) + 2);
    }

    this.context.beginPath();

    for (let i = 0; i < visibleTerrain.length; i++) {
      const currentSegment: Segment = visibleTerrain[i];

      const visualX1: number = currentSegment.previousMidPoint.x - cameraCanvasOffsetX;
      const visualY1: number = currentSegment.previousMidPoint.y - cameraCanvasOffsetY;
      const cpx = currentSegment.position.x - cameraCanvasOffsetX;
      const cpy = currentSegment.position.y - cameraCanvasOffsetY;
      const visualX2: number = currentSegment.nextMidPoint.x - cameraCanvasOffsetX;
      const visualY2: number = currentSegment.nextMidPoint.y - cameraCanvasOffsetY;

      this.context.moveTo(visualX1, visualY1 - 10);
      this.context.quadraticCurveTo(cpx, cpy - 10, visualX2, visualY2 - 10);
    }

    this.context.stroke();
  }

  drawBackgroundObjects(backgroundObjects: Array<BackgroundObject>) {
    const cameraPosition = this.camera.getPosition();
    const cameraPositionX = cameraPosition.x;
    const cameraPositionY = cameraPosition.y;

    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;

    const canvasMapLeft = cameraPositionX - canvasWidth / 2;
    const canvasMapRight = canvasMapLeft + canvasWidth;
    const canvasMapTop = cameraPositionY - canvasHeight / 2;
    const canvasMapBottom = canvasMapTop + canvasHeight;

    const cameraCanvasOffsetX: number = cameraPositionX - canvasWidth / 2;
    const cameraCanvasOffsetY: number = cameraPositionY - canvasHeight / 2;
    
    const visibleBackgroundObjects = backgroundObjects.filter(
      backgroundObject => {
        const objectLeft: number = backgroundObject.position.x - backgroundObject.width / 2;
        const objectUp: number = backgroundObject.position.y - backgroundObject.height / 2 + cameraCanvasOffsetY / 2;
        const objectRight: number = objectLeft + backgroundObject.width;
        const objectDown: number = objectUp + backgroundObject.height;

        const isNotOffscreenToTheLeft = objectRight >= canvasMapLeft;
        const isNotOffscreenToTheRight = objectLeft <= canvasMapRight;
        const isNotOffscreenAbove = objectDown >= canvasMapTop;
        const isNotOffscreenBelow = objectUp <= canvasMapBottom;

        return isNotOffscreenToTheLeft && isNotOffscreenToTheRight && isNotOffscreenAbove && isNotOffscreenBelow;
      }
    );

    for (let i = 0; i < visibleBackgroundObjects.length; i++) {
      const backgroundObject = visibleBackgroundObjects[i];
      backgroundObject.draw(this.context, cameraCanvasOffsetX, cameraCanvasOffsetY);
    }
  }

  drawCollectables(collectables: Array<CollectablePoint>) {
    const cameraPosition = this.camera.getPosition();
    const cameraPositionX = cameraPosition.x;
    const cameraPositionY = cameraPosition.y;

    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;

    const canvasMapLeft = cameraPositionX - canvasWidth / 2;
    const canvasMapRight = canvasMapLeft + canvasWidth;
    const canvasMapTop = cameraPositionY - canvasHeight / 2;
    const canvasMapBottom = canvasMapTop + canvasHeight;

    const cameraCanvasOffsetX: number = cameraPositionX - canvasWidth / 2;
    const cameraCanvasOffsetY: number = cameraPositionY - canvasHeight / 2;
    
    const visibleCollectables = collectables.filter(
      collectable => {
        const objectLeft: number = collectable.position.x - CollectablePoint.size / 2;
        const objectUp: number = collectable.position.y - CollectablePoint.size / 2;
        const objectRight: number = objectLeft + CollectablePoint.size;
        const objectDown: number = objectUp + CollectablePoint.size;

        const isNotOffscreenToTheLeft = objectRight >= canvasMapLeft;
        const isNotOffscreenToTheRight = objectLeft <= canvasMapRight;
        const isNotOffscreenAbove = objectDown >= canvasMapTop;
        const isNotOffscreenBelow = objectUp <= canvasMapBottom;

        return isNotOffscreenToTheLeft && isNotOffscreenToTheRight && isNotOffscreenAbove && isNotOffscreenBelow;
      }
    );

    for (let i = 0; i < visibleCollectables.length; i++) {
      const collectable = visibleCollectables[i];
      collectable.draw(this.context, cameraCanvasOffsetX, cameraCanvasOffsetY);
    }
  }

  clearCanvas(backgroundColour: string) {
    this.context.fillStyle = backgroundColour;
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
    const canvasWidth: number = this.canvas.width;
    const multiplier: number = 2 * Math.PI * ball.attributes.radius / 8

    if (DebugSettings.drawMovementLines) {
      for (let i = -3; i <= 3; i++) {
        const x: number = (i * multiplier);

        this.context.beginPath();
        this.context.moveTo(x + canvasWidth / 2 - (ball.position.x % multiplier), this.canvas.height);
        this.context.lineTo(x + canvasWidth / 2 - (ball.position.x % multiplier), 0);
        this.context.lineWidth = 1;
        this.context.stroke();
      }
    }
  }

  drawClosestPositionOnFloor(ball: Ball) {
    const ballPosition = ball.position;
    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;
    const cameraCanvasOffsetX: number = ballPosition.x - canvasWidth / 2;
    const cameraCanvasOffsetY: number = ballPosition.y - canvasHeight / 2;

    if (DebugSettings.closestPoint) {
      const position = DebugSettings.closestPoint;

      this.context.strokeStyle = 'black';
      this.context.fillStyle = 'purple';
      this.context.lineWidth = 3;
      this.context.beginPath();
      this.context.arc(position.x - cameraCanvasOffsetX, position.y - cameraCanvasOffsetY, 5, 0, 2 * Math.PI);
      this.context.stroke();
      this.context.fill();
    }
  }

  drawNormalisedDisplacementVector(ball: Ball) {
    const ballPosition = ball.position;
    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;
    const cameraCanvasOffsetX: number = ballPosition.x - canvasWidth / 2;
    const cameraCanvasOffsetY: number = ballPosition.y - canvasHeight / 2;

    if (DebugSettings.closestPoint && DebugSettings.normalisedDisplacementVector) {
      const startPosition = DebugSettings.closestPoint;
      const vector = DebugSettings.normalisedDisplacementVector.multiply(50);
      const endPosition = startPosition.add(vector);
      this.context.beginPath();
      this.context.strokeStyle = 'red';
      this.context.moveTo(startPosition.x - cameraCanvasOffsetX, startPosition.y - cameraCanvasOffsetY);
      this.context.lineTo(endPosition.x - cameraCanvasOffsetX, endPosition.y - cameraCanvasOffsetY
      );
      this.context.stroke();
    }
  }

  drawBallVelocity(ball: Ball) {
    const startPosition = ball.position;
    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;
    const cameraCanvasOffsetX: number = startPosition.x - canvasWidth / 2;
    const cameraCanvasOffsetY: number = startPosition.y - canvasHeight / 2;

    const endPosition = ball.position.add(ball.attributes.velocity.multiply(0.2));

    this.context.beginPath();
    this.context.strokeStyle = 'green';
    this.context.moveTo(startPosition.x - cameraCanvasOffsetX, startPosition.y - cameraCanvasOffsetY);
    this.context.lineTo(endPosition.x - cameraCanvasOffsetX, endPosition.y - cameraCanvasOffsetY);
    this.context.stroke();
  }

  drawReflectionVector(ball: Ball) {
    const ballPosition = ball.position;
    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;
    const cameraCanvasOffsetX: number = ballPosition.x - canvasWidth / 2;
    const cameraCanvasOffsetY: number = ballPosition.y - canvasHeight / 2;

    if (DebugSettings.closestPoint && DebugSettings.reflectionVector) {
      const startPosition = DebugSettings.closestPoint;
      const vector = DebugSettings.reflectionVector;
      const endPosition = DebugSettings.closestPoint.add(vector.multiply(2));

      this.context.beginPath();
      this.context.strokeStyle = 'purple';
      this.context.moveTo(startPosition.x - cameraCanvasOffsetX, startPosition.y - cameraCanvasOffsetY);
      this.context.lineTo(endPosition.x - cameraCanvasOffsetX, endPosition.y - cameraCanvasOffsetY);
      this.context.stroke();
      this.context.closePath();
    }
  }

  drawCollisionFloors(ball: Ball) {
    const ballPosition = ball.position;
    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;
    const cameraCanvasOffsetX: number = ballPosition.x - canvasWidth / 2;
    const cameraCanvasOffsetY: number = ballPosition.y - canvasHeight / 2;

    if (DebugSettings.collisionFloors) {
      this.context.beginPath();
      this.context.lineWidth = 3;
      this.context.strokeStyle = 'yellow';
      this.context.moveTo(DebugSettings.collisionFloors[0].x - cameraCanvasOffsetX, DebugSettings.collisionFloors[0].y - cameraCanvasOffsetY);

      for (let i = 1; i < DebugSettings.collisionFloors.length - 1; i++) {
        const currentVisible: Position2D = DebugSettings.collisionFloors[i];
        const nextVisible: Position2D = DebugSettings.collisionFloors[i + 1];
  
        const cpx = currentVisible.x - cameraCanvasOffsetX;
        const cpy = currentVisible.y - cameraCanvasOffsetY;
        const x = (currentVisible.x + nextVisible.x) / 2 - cameraCanvasOffsetX;
        const y = (currentVisible.y - cameraCanvasOffsetY + nextVisible.y - cameraCanvasOffsetY) / 2;

        this.context.quadraticCurveTo(cpx, cpy, x, y);
      }

      this.context.stroke();
    }
  }
}

export default CanvasRenderer;
