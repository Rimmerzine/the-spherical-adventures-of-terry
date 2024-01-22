import {Vector2D} from './Vector2D.js';

abstract class PositionedObject {
  protected position: Position2D;

  constructor(position2D: Position2D) {
    this.position = position2D;
  }

  getPosition(): Position2D {
    return this.position;
  }
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
