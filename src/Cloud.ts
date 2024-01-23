import { Position2D } from "./Position2D.js";

class Cloud {
  position: Position2D
  size: number;
  density: number;
  seed: number;

  constructor(
    x: number,
    y: number,
    size: number,
    density: number,
    seed: number
  ) {
    this.position = new Position2D(x, y);
    this.size = size;
    this.density = density;
    this.seed = seed;
  }
}

export {Cloud};
