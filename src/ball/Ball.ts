import {BallAttributes} from './BallAttributes.js';
import {BallStats} from './BallStats.js';
import {playerStats} from '../PlayerStats.js';
import {Position2D, PositionedObject} from '../utils/Position2D.js';
import {Gravity} from '../Settings.js';
import {addVectors} from '../utils/Vector2D.js';

class Ball implements PositionedObject {
  attributes: BallAttributes;
  stats: BallStats;
  jumpsRemaining: number;
  position: Position2D;

  constructor(attributes: BallAttributes, stats: BallStats) {
    this.position = attributes.startingPosition;
    this.attributes = attributes;
    this.stats = stats;
    this.jumpsRemaining = stats.getStat('jumps').currentValue;
  }

  draw(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    const drawPositionX: number = canvasWidth / 2;
    const drawPositionY: number = canvasHeight / 2;

    const ballRadius: number = this.attributes.radius;
    const scale = 0.8 * ballRadius;

    // Draw the gray background
    context.beginPath();
    context.arc(drawPositionX, drawPositionY, ballRadius, 0, 2 * Math.PI)
    context.fillStyle = 'gray';
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.fill();
    context.stroke();

    //Draw the lines from the center to the edge
    const angleStep = (2 * Math.PI) / 8;
    const rotationAdjustment = (this.attributes.rotation * Math.PI) / 180;
    
    for (let i = 0; i < 8; i++) {
      const angle = i * angleStep + rotationAdjustment;
      const lineEndX = drawPositionX + ballRadius * Math.cos(angle);
      const lineEndY = drawPositionY + ballRadius * Math.sin(angle);

      // Draw the line
      context.beginPath();
      context.moveTo(drawPositionX, drawPositionY);
      context.lineTo(lineEndX, lineEndY);
      context.stroke();
    }

    // Draw the yellow ball
    context.beginPath();
    context.arc(drawPositionX, drawPositionY, scale, 0, 2 * Math.PI);
    context.fillStyle = this.attributes.colour;
    context.fill();
    context.stroke();

    // Calculate common values for the mouth and eye
    const mouthOffsetX = 0.7 * scale;
    const mouthRadius = scale / 2;
    const eyeOffsetX = 0.7 * scale;
    const eyeOffsetY = 0.2 * scale;
    const eyeRadius = scale / 6;
    const pupilOffsetX = 0.1 * scale;
    const pupilRadius = scale / 20;

    // Draw the mouth
    context.beginPath();
    context.arc(drawPositionX + mouthOffsetX, drawPositionY, mouthRadius, 1.3, Math.PI - 0.8);
    context.lineWidth = 2;
    context.stroke();

    // Draw the eye white
    context.beginPath();
    context.arc(drawPositionX + eyeOffsetX, drawPositionY - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 2;
    context.stroke();

    // Draw the pupil
    context.beginPath();
    context.arc(
      drawPositionX + eyeOffsetX + pupilOffsetX,
      drawPositionY - eyeOffsetY,
      pupilRadius,
      0,
      2 * Math.PI
    );
    context.fillStyle = 'black';
    context.fill();
  }

  resetPosition(): void {
    this.position.x = 0;
    this.position.y = -this.attributes.radius;
    this.attributes.velocity.x = 0;
    this.attributes.velocity.y = 0;
    this.attributes.rotation = 0;
    this.attributes.rotationsPerSecond = 0;
  }
  
  update(deltaTime: number): void {
    this.applyGravity(deltaTime);
    this.updateRotation(deltaTime);
    this.handleStartingPositionCollision(deltaTime);
  }
  applyGravity(deltaTime: number): void {
    const gravityForce = Gravity.multiply(deltaTime);
    this.attributes.velocity = addVectors(this.attributes.velocity, gravityForce);
  }
  updateRotation(deltaTime: number): void {
    const rotationDelta = this.attributes.rotationsPerSecond * 360 * deltaTime;
    this.attributes.rotation += rotationDelta;
    this.attributes.rotationsPerSecond -=
      this.attributes.rotationsPerSecond * 0.1 * deltaTime;
  }
  handleStartingPositionCollision(deltaTime: number): void {
    const collided = this.position.x + this.attributes.velocity.x * deltaTime < this.attributes.startingPosition.x - 1;
    if (collided) {
      this.attributes.velocity.x = 0;
      this.attributes.velocity.y = 0;
      this.attributes.rotationsPerSecond = 0;
      this.position.x = this.attributes.startingPosition.x + 1;
    }
  }
  move(deltaTime: number): void {
    this.position = this.position.add(
      this.attributes.velocity.multiply(deltaTime)
    );
  }
  pushLeft(deltaTime: number): void {
    this.adjustRotationsPerSecond(-1, deltaTime);
  }
  pushRight(deltaTime: number): void {
    this.adjustRotationsPerSecond(1, deltaTime);
  }
  adjustRotationsPerSecond(direction: number, deltaTime: number): void {
    const acceleration = this.stats.getStat('acceleration').currentValue;
    const maxRps = this.stats.getStat('max-rps').currentValue;
    const delta = acceleration * direction * deltaTime;
    const newRps = this.attributes.rotationsPerSecond + delta;
    if (Math.abs(newRps) <= maxRps) {
      this.attributes.rotationsPerSecond = newRps;
    }
  }
  jump(): void {
    if (this.jumpsRemaining > 0) {
      this.attributes.velocity.y += this.attributes.jumpVelocity.y;
      this.jumpsRemaining--;
      playerStats.addJump();
    }
  }

  getNextPosition(deltaTime: number): Position2D {
    return this.position.add(this.attributes.velocity.multiply(deltaTime));
  }
}

export default Ball;
