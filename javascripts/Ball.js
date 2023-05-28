import Vector2D from "./Vector2D.js";
import { gravity, ballSettings, debugSettings } from "./Settings.js";

class Ball {
  constructor(position, radius) {
    this.radius = radius;
    this.position = position;
    this.velocity = new Vector2D(0, 0);
    this.movable = true;
    this.color = "red";
    this.jumpCount = 0;
  }

  // Reflect the ball's velocity based on the given reflection vector
  reflect(reflectionVector) {
    const dotProduct = this.velocity.dotProduct(reflectionVector);
    // const slowVector = this.velocity;
    const reflection = {
      x: reflectionVector.x * dotProduct * 2 * ballSettings.gripFactor,
      y:
        reflectionVector.y *
        dotProduct *
        2 *
        ballSettings.reflectionDampeningFactor,
    };
    if (debugSettings.drawReflectionVector) {
      debugSettings.reflectionVector = new Vector2D(reflection.x, reflection.y);
    }
    this.velocity.x -= reflection.x;
    this.velocity.y -= reflection.y;
    this.jumpCount = 0;
  }

  // Update the ball's position and handle collisions
  update() {
    this.velocity = this.velocity.add(gravity); // add gravity to the balls current velocity

    const nextPosition = this.position.add(this.velocity); // where the ball will be after velocity is added to its position

    if (nextPosition.x < ballSettings.displayXPosition) {
      nextPosition.x = ballSettings.displayXPosition + 5;
      this.velocity.x = -this.velocity.x;
    }
  }

  move() {
    this.position = this.position.add(this.velocity);
  }

  // Push the ball to the left
  pushLeft() {
    if (this.movable) this.velocity.x -= ballSettings.movementSpeed;
  }

  // Push the ball to the right
  pushRight() {
    if (this.movable) this.velocity.x += ballSettings.movementSpeed;
  }

  jump() {
    if (this.jumpCount < ballSettings.totalJumps) {
      this.velocity = this.velocity.add(new Vector2D(0, -5));
      this.jumpCount++;
    }
  }
}

export default Ball;
