import Position2D from './Position2D.js';
import Vector2D from './Vector2D.js';

class BallAttributes {
  startingPosition: Position2D;
  position: Position2D;
  radius: number;
  colour: string;
  velocity: Vector2D = new Vector2D(0, 0);
  jumpCount = 0;
  jumpVelocity: Vector2D;
  rotation = 0;
  rotationsPerSecond = 0;

  constructor(
    position: Position2D,
    radius: number,
    colour: string,
    jumpVelocity: Vector2D
  ) {
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

export {BallAttributes};
