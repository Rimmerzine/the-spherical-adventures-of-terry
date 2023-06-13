"use strict";

// Define a class for 2D positions
class Position2D {
  // Constructor to initialize x and y coordinates
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // Method to add a vector to the position
  add(vector) {
    // Create a new position with updated coordinates
    return new Position2D(this.x + vector.x, this.y + vector.y);
  }
}
// Export the Position2D class as the default module
export default Position2D;
