import Vector2D from "./Vector2D.js";
import { gravity, debugSettings } from "./Settings.js";

("use strict");

class Ball {
  constructor(attributes, stats) {
    this.attributes = attributes;
    this.stats = stats;
  }

  // Update the ball's velocity based on handled collisions
  update() {
    // add gravity to the balls current velocity
    this.attributes.velocity = this.attributes.velocity.add(gravity);
    this.attributes.rotation += this.attributes.rotationsPerSecond / 144;

    const nextPosition = this.attributes.position.add(this.attributes.velocity); // where the ball will be after velocity is added to its position

    if (nextPosition.x < this.attributes.startingPosition.x) {
      nextPosition.x = this.attributes.startingPosition.x + 5;
      this.attributes.velocity.x = -this.attributes.velocity.x;
    }
  }

  move() {
    this.attributes.position = this.attributes.position.add(
      this.attributes.velocity
    );
  }

  // Push the ball to the left
  pushLeft() {
    if (this.attributes.rotationsPerSecond > 0)
      this.attributes.rotationsPerSecond -=
        this.stats.getStat("acceleration").currentValue * 3;
    if (
      this.attributes.rotationsPerSecond >
      -this.stats.getStat("max-rpm").currentValue
    ) {
      this.attributes.rotationsPerSecond -=
        this.stats.getStat("acceleration").currentValue;
    }
  }

  // Push the ball to the right
  pushRight() {
    if (this.attributes.rotationsPerSecond < 0)
      this.attributes.rotationsPerSecond +=
        this.stats.getStat("acceleration").currentValue * 3;
    if (
      this.attributes.rotationsPerSecond <
      this.stats.getStat("max-rpm").currentValue
    ) {
      this.attributes.rotationsPerSecond +=
        this.stats.getStat("acceleration").currentValue;
    }
  }

  jump() {
    if (this.attributes.jumpCount < this.stats.getStat("jumps").currentValue) {
      this.attributes.velocity = this.attributes.velocity.add(
        this.attributes.jumpVelocity
      );
      this.attributes.jumpCount++;
    }
  }
}

export default Ball;
