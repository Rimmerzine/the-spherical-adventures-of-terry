("use strict");

class Position2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Add a vector to the position
  add(vector) {
    return new Position2D(this.x + vector.x, this.y + vector.y);
  }
}

export default Position2D;
