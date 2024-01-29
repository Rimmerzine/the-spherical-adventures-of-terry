import Ball from './Ball.js';
import {Cloud, CloudParticle} from './Cloud.js';
import {DebugSettings} from './Settings.js';
import TerrainManager from './TerrainManager.js';
import {Camera} from './Camera.js';
import { Position2D } from './Position2D.js';

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
    const drawPositionX: number = (this.canvas.width / 2) + (ball.getPosition().x - this.camera.getPosition().x);
    const drawPositionY: number = (this.canvas.height / 2) + (ball.getPosition().y - this.camera.getPosition().y);
    const ballRadius: number = ball.attributes.radius;
    const scale = 0.8 * ballRadius;

    // Draw the gray background
    this.context.beginPath();
    this.context.arc(drawPositionX, drawPositionY, ballRadius, 0, 2 * Math.PI)
    this.context.fillStyle = 'gray';
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 3;
    this.context.fill();
    this.context.stroke();

    //Draw the lines from the center to the edge
    const angleStep = (2 * Math.PI) / 8;
    const rotationAdjustment = (ball.attributes.rotation * Math.PI) / 180;
    
    for (let i = 0; i < 8; i++) {
      const angle = i * angleStep + rotationAdjustment;
      const lineEndX = drawPositionX + ballRadius * Math.cos(angle);
      const lineEndY = drawPositionY + ballRadius * Math.sin(angle);

      // Draw the line
      this.context.beginPath();
      this.context.moveTo(drawPositionX, drawPositionY);
      this.context.lineTo(lineEndX, lineEndY);
      this.context.stroke();
    }

    // Draw the yellow ball
    this.context.beginPath();
    this.context.arc(drawPositionX, drawPositionY, scale, 0, 2 * Math.PI);
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
    this.context.arc(drawPositionX + mouthOffsetX, drawPositionY, mouthRadius, 1.3, Math.PI - 0.8);
    this.context.lineWidth = 2;
    this.context.stroke();

    // Draw the eye white
    this.context.beginPath();
    this.context.arc(drawPositionX + eyeOffsetX, drawPositionY - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
    this.context.fillStyle = 'white';
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();

    // Draw the pupil
    this.context.beginPath();
    this.context.arc(
      drawPositionX + eyeOffsetX + pupilOffsetX,
      drawPositionY - eyeOffsetY,
      pupilRadius,
      0,
      2 * Math.PI
    );
    this.context.fillStyle = 'black';
    this.context.fill();
  }

  drawQuadraticFloor(terrainManager: TerrainManager): void {
    const cameraPosition: Position2D = this.camera.getPosition();
    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;
    const canvasMapLeft: number = cameraPosition.x - canvasWidth / 2;
    const canvasMapRight: number = canvasMapLeft + canvasWidth;
    const cameraCanvasOffsetX: number = this.camera.getPosition().x - canvasWidth / 2;
    const cameraCanvasOffsetY: number = this.camera.getPosition().y - canvasHeight / 2;
    
    const visibleTerrain = terrainManager.terrain.filter(
      floor => {
        const floorX: number = floor.x;
        const segmentWidth: number = terrainManager.terrainSettings.segmentWidth;
        return floorX >= canvasMapLeft - segmentWidth * 3 && floorX <= canvasMapRight + segmentWidth * 2
      }
    );
    this.context.beginPath();
    this.context.lineWidth = 21;
    this.context.strokeStyle = terrainManager.terrainSettings.surfaceColour;
    this.context.fillStyle = terrainManager.terrainSettings.subsurfaceColour;
    this.context.moveTo(0, this.canvas.height);
    this.context.lineTo(
      visibleTerrain[0].x - cameraCanvasOffsetX,
      visibleTerrain[0].y - cameraCanvasOffsetY
    );

    for (let i = 1; i < visibleTerrain.length - 1; i++) {
      const currentVisible: Position2D = visibleTerrain[i];
      const nextVisible: Position2D = visibleTerrain[i + 1];

      const cpx = currentVisible.x - cameraCanvasOffsetX;
      const cpy = currentVisible.y - cameraCanvasOffsetY;
      const x = (currentVisible.x + nextVisible.x) / 2 - cameraCanvasOffsetX;
      const y = (currentVisible.y - cameraCanvasOffsetY + visibleTerrain[i + 1].y - cameraCanvasOffsetY) / 2;
      this.context.quadraticCurveTo(cpx, cpy, x, y);
    }
    this.context.lineTo(canvasWidth, canvasHeight);
    this.context.stroke();
    this.context.fill();
  }

  drawCloud(cloud: Cloud): void {
    const canvasWidth: number = this.canvas.width;
    const canvasHeight: number = this.canvas.height;
    const cameraCanvasOffsetX: number = this.camera.getPosition().x - canvasWidth / 2;
    const cameraCanvasOffsetY: number = this.camera.getPosition().y - canvasHeight / 2;

    for(let i = 0; i < cloud.particles.length; i++) {
      const cloudParticle: CloudParticle = cloud.particles[i];

      this.context.fillStyle = cloudParticle.colour;

      const particlePositionX: number = cloud.position.x + cloudParticle.relativePosition.x - cameraCanvasOffsetX;
      const particlePositionY: number = cloud.position.y + cloudParticle.relativePosition.y - cameraCanvasOffsetY / 2;

      this.context.beginPath();
      this.context.arc(particlePositionX, particlePositionY, cloudParticle.radius, 0, 2 * Math.PI);
      this.context.fill();
    }

  }

  drawClouds(clouds: Array<Cloud>, segmentWidth: number) {
    const canvasMapLeft = this.camera.getPosition().x - this.canvas.width / 2;
    const canvasMapRight = canvasMapLeft + this.canvas.width;

    // between 34 - 49 fps
    const visibleClouds = clouds.filter(
      cloud => {
        const cloudPositionX: number = cloud.position.x;
        return cloudPositionX + 300 >= canvasMapLeft && cloudPositionX - 300 <= canvasMapRight
      }
    );

    for (let i = 0; i < visibleClouds.length; i++) {
      const cloud = visibleClouds[i];
      this.drawCloud(cloud);
    }
  }

  clearCanvas() {
    this.context.fillStyle = 'rgb(150, 210, 255)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // drawDebugInformation(ball: Ball) {
  //   this.drawClosestPositionOnFloor(ball);
  //   this.drawNormalisedDisplacementVector(ball);
  //   this.drawBallVelocity(ball);
  //   this.drawReflectionVector(ball);
  //   this.drawCollisionFloors(ball);
  //   this.drawMovementLines(ball);
  // }

  // drawMovementLines(ball: Ball) {
  //   if (DebugSettings.drawMovementLines) {
  //     for (
  //       let i =
  //         ball.attributes.startingPosition.x -
  //         (ball.getPosition().x - ball.attributes.startingPosition.x);
  //       i <=
  //       ball.attributes.startingPosition.x -
  //         (ball.getPosition().x - ball.attributes.startingPosition.x) +
  //         1000;
  //       i += (2 * Math.PI * ball.attributes.radius) / 8
  //     ) {
  //       this.context.beginPath();
  //       this.context.moveTo(i, this.canvas.height);
  //       this.context.lineTo(i, 0);
  //       this.context.lineWidth = 1;
  //       this.context.stroke();
  //       this.context.closePath();
  //     }
  //   }
  // }

  // drawClosestPositionOnFloor(ball: Ball) {
  //   if (DebugSettings.closestPoint) {
  //     const position = DebugSettings.closestPoint;

  //     this.context.beginPath();
  //     this.context.arc(
  //       position.x -
  //         ball.getPosition().x +
  //         ball.attributes.startingPosition.x,
  //       position.y -
  //         ball.getPosition().y +
  //         ball.attributes.startingPosition.y,
  //       10,
  //       0,
  //       2 * Math.PI
  //     );
  //     this.context.strokeStyle = 'black';
  //     this.context.lineWidth = 3;
  //     this.context.stroke();
  //     this.context.closePath();
  //   }
  // }

  // drawNormalisedDisplacementVector(ball: Ball) {
  //   if (
  //     DebugSettings.closestPoint &&
  //     DebugSettings.normalisedDisplacementVector
  //   ) {
  //     const startPosition = DebugSettings.closestPoint;
  //     const vector = DebugSettings.normalisedDisplacementVector;
  //     const endPosition = startPosition.add(vector);
  //     this.context.beginPath();
  //     this.context.strokeStyle = 'red';
  //     this.context.moveTo(
  //       startPosition.x -
  //         ball.getPosition().x +
  //         ball.attributes.startingPosition.x,
  //       startPosition.y -
  //         ball.getPosition().y +
  //         ball.attributes.startingPosition.y
  //     );
  //     this.context.lineTo(
  //       endPosition.x -
  //         ball.getPosition().x +
  //         ball.attributes.startingPosition.x,
  //       endPosition.y -
  //         ball.getPosition().y +
  //         ball.attributes.startingPosition.y
  //     );
  //     this.context.stroke();
  //     this.context.closePath();
  //   }
  // }

  // drawBallVelocity(ball: Ball) {
  //   const startPosition = ball.getPosition();
  //   const endPosition = ball.getPosition().add(
  //     ball.attributes.velocity.multiply(0.2)
  //   );

  //   this.context.beginPath();
  //   this.context.strokeStyle = 'green';
  //   this.context.moveTo(
  //     startPosition.x -
  //       ball.getPosition().x +
  //       ball.attributes.startingPosition.x,
  //     startPosition.y -
  //       ball.getPosition().y +
  //       ball.attributes.startingPosition.y
  //   );
  //   this.context.lineTo(
  //     endPosition.x -
  //       ball.getPosition().x +
  //       ball.attributes.startingPosition.x,
  //     endPosition.y -
  //       ball.getPosition().y +
  //       ball.attributes.startingPosition.y
  //   );
  //   this.context.stroke();
  //   this.context.closePath();
  // }

  // drawReflectionVector(ball: Ball) {
  //   if (DebugSettings.closestPoint && DebugSettings.reflectionVector) {
  //     const startPosition = DebugSettings.closestPoint;
  //     const vector = DebugSettings.reflectionVector;
  //     const endPosition = DebugSettings.closestPoint.add(vector.multiply(2));

  //     this.context.beginPath();
  //     this.context.strokeStyle = 'purple';
  //     this.context.moveTo(
  //       startPosition.x -
  //         ball.getPosition().x +
  //         ball.attributes.startingPosition.x,
  //       startPosition.y -
  //         ball.getPosition().y +
  //         ball.attributes.startingPosition.y
  //     );
  //     this.context.lineTo(
  //       endPosition.x -
  //         ball.getPosition().x +
  //         ball.attributes.startingPosition.x,
  //       endPosition.y -
  //         ball.getPosition().y +
  //         ball.attributes.startingPosition.y
  //     );
  //     this.context.stroke();
  //     this.context.closePath();
  //   }
  // }

  // drawCollisionFloors(ball: Ball) {
  //   if (DebugSettings.collisionFloors) {
  //     this.context.beginPath();
  //     this.context.lineWidth = 3;
  //     this.context.strokeStyle = 'yellow';
  //     this.context.moveTo(
  //       DebugSettings.collisionFloors[0].x -
  //         ball.getPosition().x +
  //         ball.attributes.startingPosition.x,
  //       DebugSettings.collisionFloors[0].y -
  //         ball.getPosition().y +
  //         ball.attributes.startingPosition.y
  //     );

  //     for (let i = 1; i < DebugSettings.collisionFloors.length - 1; i++) {
  //       const cpx =
  //         DebugSettings.collisionFloors[i].x -
  //         ball.getPosition().x +
  //         ball.attributes.startingPosition.x;
  //       const cpy =
  //         DebugSettings.collisionFloors[i].y -
  //         ball.getPosition().y +
  //         ball.attributes.startingPosition.y;
  //       const x =
  //         (DebugSettings.collisionFloors[i].x +
  //           DebugSettings.collisionFloors[i + 1].x) /
  //           2 -
  //         ball.getPosition().x +
  //         ball.attributes.startingPosition.x;
  //       const y =
  //         (DebugSettings.collisionFloors[i].y -
  //           ball.getPosition().y +
  //           ball.attributes.startingPosition.y +
  //           DebugSettings.collisionFloors[i + 1].y -
  //           ball.getPosition().y +
  //           ball.attributes.startingPosition.y) /
  //         2;

  //       this.context.quadraticCurveTo(cpx, cpy, x, y);
  //     }

  //     this.context.stroke();
  //     this.context.closePath();
  //   }
  // }
}

export default CanvasRenderer;
