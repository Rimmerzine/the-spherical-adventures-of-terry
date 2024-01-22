class Cloud {
  x: number;
  y: number;
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
    this.x = x;
    this.y = y;
    this.size = size;
    this.density = density;
    this.seed = seed;
  }
}

export {Cloud};
