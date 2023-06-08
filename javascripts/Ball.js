import { gravity } from "./Settings.js";
import { addVectors } from "./Vector2D.js";

class Ball {
  constructor(attributes, stats) {
    this.attributes = attributes;
    this.stats = stats;
    this.jumpsRemaining = stats.getStat("jumps").currentValue;
  }
  update(deltaTime) {
    this.applyGravity(deltaTime);
    this.updateRotation(deltaTime);
    this.handleStartingPositionCollision(deltaTime);
  }
  applyGravity(deltaTime) {
    const gravityForce = gravity.multiply(deltaTime);
    this.attributes.velocity = addVectors(
      this.attributes.velocity,
      gravityForce
    );
  }
  updateRotation(deltaTime) {
    const rotationDelta = this.attributes.rotationsPerSecond * 360 * deltaTime;
    this.attributes.rotation += rotationDelta;
  }
  handleStartingPositionCollision(deltaTime) {
    const collided =
      this.attributes.position.x + this.attributes.velocity.x * deltaTime <
      this.attributes.startingPosition.x - 1;
    if (collided) {
      this.attributes.velocity.x = 0;
      this.attributes.velocity.y = 0;
      this.attributes.rotationsPerSecond = 0;
      this.attributes.position.x = this.attributes.startingPosition.x + 1;
    }
  }
  move(deltaTime) {
    this.attributes.position = addVectors(
      this.attributes.position,
      this.attributes.velocity.multiply(deltaTime)
    );
  }
  pushLeft() {
    this.adjustRotationsPerSecond(-1);
  }
  pushRight() {
    this.adjustRotationsPerSecond(1);
  }
  adjustRotationsPerSecond(direction) {
    const acceleration = this.stats.getStat("acceleration").currentValue;
    const maxRps = this.stats.getStat("max-rpm").currentValue;
    const delta = acceleration * direction;
    const newRps = this.attributes.rotationsPerSecond + delta;
    if (Math.abs(newRps) <= maxRps) {
      this.attributes.rotationsPerSecond = newRps;
    } else {
      this.attributes.rotationsPerSecond = direction * maxRps;
    }
  }
  jump() {
    if (this.jumpsRemaining > 0) {
      this.attributes.velocity = addVectors(
        this.attributes.velocity,
        this.attributes.jumpVelocity
      );
      this.jumpsRemaining--;
    }
  }
}
export default Ball;
