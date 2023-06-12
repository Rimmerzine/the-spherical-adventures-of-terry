"use strict";

class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // add another vector to this vector
  add(vector) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  // subtract another vector from this vector
  subtract(vector) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  // multiply the vector by a scalar value
  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  // calculate the magnitude (length) of the vector
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  // calculate the perpendicular direction of the vector
  perpendicularDirection() {
    if (this.y >= 0 && this.x >= 0) {
      return new Vector2D(this.y, -this.x); // :)
    } else if (this.y >= 0 && this.x < 0) {
      return new Vector2D(this.y, -this.x); // :)
    } else if (this.y < 0 && this.x >= 0) {
      return new Vector2D(-this.y, this.x); // :)
    } else if (this.y < 0 && this.x < 0) {
      return new Vector2D(-this.y, this.x); // :)
    } else {
      return new Vector2D(0, 0);
    }
  }

  // normalize the vector to have a magnitude of 1
  normalize() {
    const magnitude = this.magnitude();
    if (magnitude !== 0) {
      return new Vector2D(this.x / magnitude, this.y / magnitude);
    } else {
      return new Vector2D(0, 0);
    }
  }

  // calculate the distance between this vector and the origin (0, 0)
  distance() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  // calculate the dot product of this vector and another vector
  dotProduct(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
}

export function addVectors(v1, v2) {
  return new Vector2D(v1.x + v2.x, v1.y + v2.y);
}

export default Vector2D;
