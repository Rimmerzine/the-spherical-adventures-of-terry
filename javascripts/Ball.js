import Vector2D from "./Vector2D.js";
import { mapSettings, gravity, ballSettings } from "./Settings.js";

class Ball {
  constructor(position, radius) {
    this.radius = radius;
    this.position = position;
    this.velocity = new Vector2D(0, 0);
    this.movable = false;
    this.color = "red";
    this.jumpCount = 0;
  }

  // Reflect the ball's velocity based on the given reflection vector
  reflect(reflectionVector) {
    const dotProduct = this.velocity.dotProduct(reflectionVector);
    // const slowVector = this.velocity;
    const reflection = {
      x: reflectionVector.x * dotProduct * 2 * ballSettings.gripFactor,
      y:
        reflectionVector.y *
        dotProduct *
        2 *
        ballSettings.reflectionDampeningFactor,
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
  update(walls, floor) {
    this.velocity = this.velocity.add(gravity); // add gravity to the balls current velocity

    const nextPosition = this.position.add(this.velocity); // where the ball will be after velocity is added to its position

    if (nextPosition.x < ballSettings.displayXPosition) {
      nextPosition.x = ballSettings.displayXPosition;
      this.velocity.x = 0;
    }

    let collided = false; // has the ball collided with a wall
    let closestPoint = null; // closest point on the wall
    let collidingWall = null; // the wall which the ball collided with
    let ballMovable = false; // should the ball be able to move

    // get the floor tiles which are closest to the ball
    const localFloors = walls.filter(
      (wall) =>
        wall.lineEnd.x >= this.position.x - this.radius &&
        wall.lineStart.x <= this.position.x + this.radius
    );

    // const localFloors = walls.slice(
    //   this.position.x / mapSettings.floorSegmentWidth - 1,
    //   this.position.x / mapSettings.floorSegmentWidth + 2
    // );

    localFloors.forEach((wall) => {
      const wallClosestPosition = wall.calculateClosestPosition(nextPosition);
      const distance = calculateDistance(nextPosition, wallClosestPosition);

      if (
        !ballMovable &&
        distance <= this.radius + ballSettings.movableDistance
      ) {
        ballMovable = true;
      }
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

    if (collided && closestPoint) {
      // Handle the wall collision
      this.handleWallCollision(collidingWall, closestPoint);
      this.position = this.position.add(this.velocity);
      this.jumpCount = 0;
    } else {
      this.position = nextPosition;
      this.movable = false;
    }

    if (ballMovable) this.movable = ballMovable;
  }

  // Push the ball to the left
  pushLeft() {
    if (this.movable) this.velocity.x -= ballSettings.movementSpeed;
  }

  // Push the ball to the right
  pushRight() {
    if (this.movable) this.velocity.x += ballSettings.movementSpeed;
  }

  jump() {
    if (this.jumpCount < ballSettings.totalJumps) {
      this.velocity = this.velocity.add(new Vector2D(0, -5));
      this.jumpCount++;
    }
  }
}

export default Ball;

// Calculate the distance between two points
function calculateDistance(pointOne, pointTwo) {
  const dx = pointTwo.x - pointOne.x;
  const dy = pointTwo.y - pointOne.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
}
