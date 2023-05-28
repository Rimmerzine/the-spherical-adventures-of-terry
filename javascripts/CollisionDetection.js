import { ballSettings } from "./Settings.js";
import { mapSettings } from "./Settings.js";
import { debugSettings } from "./Settings.js";
import Vector2D from "./Vector2D.js";
import Position2D from "./Position2D.js";

class CollisionDetection {
  static ballFloorCollision(ball, floor) {
    const ballNextPosition = ball.position.add(ball.velocity);
    const canvasMapLeft = ballNextPosition.x - ballSettings.displayXPosition;
    const visibleFloor = floor.filter(
      (floor) =>
        floor.x >= canvasMapLeft &&
        floor.x <= canvasMapLeft + mapSettings.floorSegmentWidth * 6
    );

    // get the closest point to the ball on the floor
    const position = findClosestPoint(visibleFloor, ballNextPosition);
    if (debugSettings.drawClosestCollisionPoint) {
      debugSettings.closestPoint = position;
    }

    // if the distance between the closest point and the ball is less than or equal to it's radius, collision
    if (calculateDistance(position, ballNextPosition) <= ball.radius) {
      const normalisedDisplacementVector = new Vector2D(
        ballNextPosition.x - position.x,
        ballNextPosition.y - position.y
      ).normalize();
      if (debugSettings.drawNormalisedDisplacementVector) {
        debugSettings.normalisedDisplacementVector =
          normalisedDisplacementVector;
      }

      ball.reflect(normalisedDisplacementVector);
    }
  }
}

export default CollisionDetection;

function calculateDistance(pointOne, pointTwo) {
  if (pointOne == null || pointTwo == null) return Infinity;
  const dx = pointTwo.x - pointOne.x;
  const dy = pointTwo.y - pointOne.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
}

function findClosestPoint(floor, givenPoint) {
  let point = null;

  for (let i = 1; i < floor.length - 1; i++) {
    const sx = (floor[i - 1].x + floor[i].x) / 2;
    const sy = (floor[i - 1].y + floor[i].y) / 2;
    const cpx = floor[i].x;
    const cpy = floor[i].y;
    const x = (floor[i].x + floor[i + 1].x) / 2;
    const y = (floor[i].y + floor[i + 1].y) / 2;

    for (let j = 0.0; j <= 1.0; j += 0.01) {
      const newPoint = getQuadraticCurvePoint(sx, sy, cpx, cpy, x, y, j);
      if (
        calculateDistance(newPoint, givenPoint) <
        calculateDistance(point, givenPoint)
      ) {
        point = newPoint;
      }
    }
  }

  return point;
}

function _getQBezierValue(t, p1, p2, p3) {
  var iT = 1 - t;
  return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(
  startX,
  startY,
  cpX,
  cpY,
  endX,
  endY,
  position
) {
  return new Position2D(
    _getQBezierValue(position, startX, cpX, endX),
    _getQBezierValue(position, startY, cpY, endY)
  );
}
