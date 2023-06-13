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
    this.attributes.velocity = addVectors(this.attributes.velocity, gravityForce);
  }
  updateRotation(deltaTime) {
    const rotationDelta = this.attributes.rotationsPerSecond * 360 * deltaTime;
    this.attributes.rotation += rotationDelta;
    this.attributes.rotationsPerSecond -= this.attributes.rotationsPerSecond * 0.1 * deltaTime;
  }
  handleStartingPositionCollision(deltaTime) {
    const collided =
      this.attributes.position.x + this.attributes.velocity.x * deltaTime < this.attributes.startingPosition.x - 1;
    if (collided) {
      this.attributes.velocity.x = 0;
      this.attributes.velocity.y = 0;
      this.attributes.rotationsPerSecond = 0;
      this.attributes.position.x = this.attributes.startingPosition.x + 1;
    }
  }
  move(deltaTime) {
    this.attributes.position = addVectors(this.attributes.position, this.attributes.velocity.multiply(deltaTime));
  }
  pushLeft(deltaTime) {
    this.adjustRotationsPerSecond(-1, deltaTime);
  }
  pushRight(deltaTime) {
    this.adjustRotationsPerSecond(1, deltaTime);
  }
  adjustRotationsPerSecond(direction, deltaTime) {
    const acceleration = this.stats.getStat("acceleration").currentValue;
    const maxRps = this.stats.getStat("max-rps").currentValue;
    const delta = acceleration * direction * deltaTime;
    const newRps = this.attributes.rotationsPerSecond + delta;
    if (Math.abs(newRps) <= maxRps) {
      this.attributes.rotationsPerSecond = newRps;
    }
  }
  jump() {
    if (this.jumpsRemaining > 0) {
      this.attributes.velocity.y = this.attributes.jumpVelocity.y;
      this.jumpsRemaining--;
    }
  }
}

export default Ball;
