// Get the canvas element and its 2D rendering context
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const fps = 60; // Frames per second

// Set the dimensions of the canvas
canvas.width = 1024;
canvas.height = 576;

// Define an object to store the state of the keyboard keys
const keys = {
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
};

// Define a class for 2D positions
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

// Define a class for 2D vectors
class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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

// Define a class for the ball
class Ball {
  constructor(position, radius) {
    this.radius = radius;
    this.position = position;
    this.velocity = new Vector2D(0, 0);
  }

  // Draw the ball on the canvas
  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.strokeStyle = "black";
    context.stroke();
    context.fillStyle = "red";
    context.fill();
  }

  // Reflect the ball's velocity based on the given reflection vector
  reflect(reflectionVector) {
    const dotProduct = this.velocity.dotProduct(reflectionVector);
    const reflection = {
      x: reflectionVector.x * dotProduct * 2,
      y: reflectionVector.y * dotProduct * 2,
    };
    this.velocity.x -= reflection.x;
    this.velocity.y -= reflection.y;
  }

  // Handle the collision with a wall
  handleWallCollision(wall, closestPoint) {
    if (wall.lineStart == closestPoint || wall.lineEnd == closestPoint) {
      // vector from the point to the ball
      const normalisedDisplacementVector = new Vector2D(
        this.position.x - closestPoint.x,
        this.position.y - closestPoint.y
      ).normalize();

      this.reflect(normalisedDisplacementVector);
    } else {
      // Calculate the reflection vector
      const reflectionVector = wall.normalizedWallNormal;

      // Apply reflection
      this.reflect(reflectionVector);
    }
  }

  // Update the ball's position and handle collisions
  update() {
    const nextPosition = this.position.add(this.velocity);

    let collided = false;
    let closestPoint = null;
    let collidingWall = null; // Declare the collidingWall variable

    // Check collision with each wall
    walls.forEach((wall) => {
      const wallClosestPosition = wall.calculateClosestPosition(nextPosition);
      const distance = calculateDistance(nextPosition, wallClosestPosition);
      if (distance <= this.radius) {
        collided = true;

        if (
          !closestPoint ||
          distance < calculateDistance(nextPosition, closestPoint)
        ) {
          closestPoint = wallClosestPosition;
          collidingWall = wall; // Assign the current wall to collidingWall
        }
      }
    });

    this.position = nextPosition;

    if (collided && closestPoint) {
      // Handle the wall collision
      this.handleWallCollision(collidingWall, closestPoint);
    }
  }

  // Push the ball to the left
  pushLeft() {
    this.velocity.x -= 0.1;
  }

  // Push the ball to the right
  pushRight() {
    this.velocity.x += 0.1;
  }

  // Push the ball upwards
  pushUp() {
    this.velocity.y -= 0.1;
  }

  // Push the ball downwards
  pushDown() {
    this.velocity.y += 0.1;
  }
}

// Define a class for walls
class Wall {
  constructor(lineStart, lineEnd) {
    this.lineStart = lineStart;
    this.lineEnd = lineEnd;
    this.direction = new Vector2D(
      lineEnd.x - lineStart.x,
      lineEnd.y - lineStart.y
    );
    this.directionLengthSquared =
      this.direction.x * this.direction.x + this.direction.y * this.direction.y;
    this.normal = new Vector2D(-this.direction.y, this.direction.x);
    this.normalizedWallNormal = this.normal.normalize();
  }

  // Draw the wall on the canvas
  draw() {
    context.beginPath();
    context.moveTo(this.lineStart.x, this.lineStart.y);
    context.lineTo(this.lineEnd.x, this.lineEnd.y);
    context.strokeStyle = "black";
    context.stroke();
  }

  // Calculate the closest position on the wall to a given point
  calculateClosestPosition(point) {
    const lineVector = new Vector2D(
      this.lineEnd.x - this.lineStart.x,
      this.lineEnd.y - this.lineStart.y
    );

    const pointVector = new Vector2D(
      point.x - this.lineStart.x,
      point.y - this.lineStart.y
    );

    const lineLengthSquared = lineVector.x ** 2 + lineVector.y ** 2;
    const dotProduct =
      pointVector.x * lineVector.x + pointVector.y * lineVector.y;

    let projectionFactor;
    if (dotProduct <= 0) {
      projectionFactor = 0;
    } else if (dotProduct >= lineLengthSquared) {
      projectionFactor = 1;
    } else {
      projectionFactor = dotProduct / lineLengthSquared;
    }

    const closestPosition = new Position2D(
      this.lineStart.x + lineVector.x * projectionFactor,
      this.lineStart.y + lineVector.y * projectionFactor
    );

    if (projectionFactor === 0 || projectionFactor === 1) {
      // The closest point lies on one of the endpoints of the wall
      const distanceToStart = calculateDistance(point, this.lineStart);
      const distanceToEnd = calculateDistance(point, this.lineEnd);
      if (distanceToStart < distanceToEnd) {
        return this.lineStart;
      } else {
        return this.lineEnd;
      }
    }

    return closestPosition;
  }
}

// Create instances of the Ball class
const ball = new Ball(new Position2D(235, 450), 50);

// Create instances of the Wall class
const wallOne = new Wall(new Position2D(0, 500), new Position2D(1000, 500));
const wallTwo = new Wall(new Position2D(0, 20), new Position2D(1000, 20));
const wallThree = new Wall(new Position2D(20, 0), new Position2D(20, 550));
const wallFour = new Wall(new Position2D(950, 0), new Position2D(950, 550));
const wallFive = new Wall(new Position2D(250, 250), new Position2D(350, 350));
const wallSix = new Wall(new Position2D(250, 250), new Position2D(350, 150));

// Store the walls in an array
const walls = [wallOne, wallTwo, wallThree, wallFour, wallFive, wallSix];

// Calculate the distance between two points
function calculateDistance(pointOne, pointTwo) {
  const dx = pointTwo.x - pointOne.x;
  const dy = pointTwo.y - pointOne.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
}

// Animation loop
function animate() {
  setTimeout(() => {
    window.requestAnimationFrame(animate);
  }, 1000 / fps);

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Handle key presses and push the ball accordingly
  if (keys.a.pressed) ball.pushLeft();
  if (keys.d.pressed) ball.pushRight();
  if (keys.s.pressed) ball.pushDown();
  if (keys.w.pressed) ball.pushUp();

  // Draw and update walls
  walls.forEach((wall) => {
    wall.draw();
  });

  // Draw and update the ball
  ball.draw();
  ball.update();
}

// Start the animation loop
animate();

// Event listener for keydown events
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "s":
      keys.s.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case "w":
      keys.w.pressed = true;
      break;
  }
});

// Event listener for keyup events
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }
});
