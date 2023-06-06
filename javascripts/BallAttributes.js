import Vector2D from "./Vector2D.js";

("use strict");

class BallAttributes {
  constructor(position, radius, colour, jumpVelocity) {
    this.startingPosition = position;
    this.position = position;
    this.radius = radius;
    this.colour = colour;

    this.velocity = new Vector2D(0, 0);
    this.jumpCount = 0;
    this.jumpVelocity = jumpVelocity;
    this.rotation = 0;
    this.rotationsPerSecond = 0;
  }
}

export default BallAttributes;
