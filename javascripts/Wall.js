import Position2D from "./Position2D.js";
import Vector2D from "./Vector2D.js";
import { mapSettings, ballSettings } from "./Settings.js";

class Wall {
  constructor(lineStart, lineEnd) {
    this.lineStart = lineStart;
    this.lineEnd = lineEnd;
    this.drawStartX = lineStart.x + ballSettings.ballDisplayXPosition - 1;
    this.drawEndX = lineEnd.x + ballSettings.ballDisplayXPosition + 1;
    this.direction = new Vector2D(
      lineEnd.x - lineStart.x,
      lineEnd.y - lineStart.y
    );
    this.directionLengthSquared =
      this.direction.x * this.direction.x + this.direction.y * this.direction.y;
    this.normal = new Vector2D(-this.direction.y, this.direction.x);
    this.normalizedWallNormal = this.normal.normalize();
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

export default Wall;

// Calculate the distance between two points
function calculateDistance(pointOne, pointTwo) {
  const dx = pointTwo.x - pointOne.x;
  const dy = pointTwo.y - pointOne.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
}
