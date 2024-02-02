import {Vector2D} from './Vector2D.js';

interface PositionedObject {
  position: Position2D;
}

class Position2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector2D): Position2D {
    return new Position2D(this.x + vector.x, this.y + vector.y);
  }
}

export {PositionedObject, Position2D}
