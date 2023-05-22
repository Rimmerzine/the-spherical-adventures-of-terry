class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Add another vector to this vector
  add(vector) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  // Multiply the vector by a scalar value
  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude !== 0) {
      return new Vector2D(this.x / magnitude, this.y / magnitude);
    } else {
      return new Vector2D(0, 0);
    }
  }

  dotProduct(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
}

export default Vector2D;
