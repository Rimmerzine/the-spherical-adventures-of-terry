import {Vector} from '../utils/Vector.js';

class BallAttributes {
  startingPosition: Vector;
  radius: number;
  colour: string;
  velocity: Vector = new Vector(0, 0);
  jumpVelocity: Vector;
  rotation = 0;
  rotationsPerSecond = 0;

  constructor(
    position: Vector,
    radius: number,
    colour: string,
    jumpVelocity: Vector
  ) {
    this.startingPosition = position;
    this.radius = radius;
    this.colour = colour;
    this.jumpVelocity = jumpVelocity;
  }
}

export {BallAttributes};
