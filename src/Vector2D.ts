class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // add another vector to this vector
  add(vector: Vector2D): Vector2D {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  // subtract another vector from this vector
  subtract(vector: Vector2D): Vector2D {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  // multiply the vector by a scalar value
  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  // calculate the magnitude (length) of the vector
  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  // calculate the perpendicular direction of the vector
  perpendicularDirection(): Vector2D {
    if (this.y >= 0) {
      return new Vector2D(this.y, -this.x); // clockwise rotation
    } else {
      return new Vector2D(-this.y, this.x); // counterclockwise rotation
    }
    // if (this.y >= 0 && this.x >= 0) {
    //   return new Vector2D(this.y, -this.x); // :)
    // } else if (this.y >= 0 && this.x < 0) {
    //   return new Vector2D(this.y, -this.x); // :)
    // } else if (this.y < 0 && this.x >= 0) {
    //   return new Vector2D(-this.y, this.x); // :)
    // } else if (this.y < 0 && this.x < 0) {
    //   return new Vector2D(-this.y, this.x); // :)
    // } else {
    //   return new Vector2D(0, 0);
    // }
  }

  // normalize the vector to have a magnitude of 1
  normalize(): Vector2D {
    const magnitude = this.magnitude();
    if (magnitude !== 0) {
      return new Vector2D(this.x / magnitude, this.y / magnitude);
    } else {
      return new Vector2D(0, 0);
    }
  }

  // calculate the distance between this vector and the origin (0, 0)
  distance(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  // calculate the dot product of this vector and another vector
  dotProduct(vector: Vector2D): number {
    return this.x * vector.x + this.y * vector.y;
  }
}

export function addVectors(v1: Vector2D, v2: Vector2D): Vector2D {
  return new Vector2D(v1.x + v2.x, v1.y + v2.y);
}

export default Vector2D;
