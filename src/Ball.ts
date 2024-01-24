import {BallAttributes} from './BallAttributes.js';
import {BallStats} from './BallStats.js';
import {Position2D, PositionedObject} from './Position2D.js';
import {Gravity} from './Settings.js';
import {addVectors} from './Vector2D.js';

class Ball extends PositionedObject {
  attributes: BallAttributes;
  stats: BallStats;
  jumpsRemaining: number;

  constructor(attributes: BallAttributes, stats: BallStats) {
    super(attributes.startingPosition);
    this.attributes = attributes;
    this.stats = stats;
    this.jumpsRemaining = stats.getStat('jumps').currentValue;
  }
  
  update(deltaTime: number): void {
    this.applyGravity(deltaTime);
    this.updateRotation(deltaTime);
    this.handleStartingPositionCollision(deltaTime);
  }
  applyGravity(deltaTime: number): void {
    const gravityForce = Gravity.multiply(deltaTime);
    this.attributes.velocity = addVectors(
      this.attributes.velocity,
      gravityForce
    );
  }
  updateRotation(deltaTime: number): void {
    const rotationDelta = this.attributes.rotationsPerSecond * 360 * deltaTime;
    this.attributes.rotation += rotationDelta;
    this.attributes.rotationsPerSecond -=
      this.attributes.rotationsPerSecond * 0.1 * deltaTime;
  }
  handleStartingPositionCollision(deltaTime: number): void {
    const collided =
      this.position.x + this.attributes.velocity.x * deltaTime <
      this.attributes.startingPosition.x - 1;
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
      this.attributes.velocity.y = this.attributes.jumpVelocity.y;
      this.jumpsRemaining--;
    }
  }
}

export default Ball;
