import { gravity } from "./Settings.js";
import { debugSettings } from "./Settings.js";
import Vector2D from "./Vector2D.js";
import Position2D from "./Position2D.js";

("use strict");

class CollisionDetection {
  static ballFloorCollision(ball, terrainManager, deltaTime) {
    const ballNextPosition = ball.attributes.position.add(
      ball.attributes.velocity.multiply(deltaTime)
    );
    const visibleFloor = terrainManager.terrain.filter(
      (floor) =>
        floor.x >=
          ballNextPosition.x -
            terrainManager.terrainSettings.segmentWidth * 3 &&
        floor.x <=
          ballNextPosition.x + terrainManager.terrainSettings.segmentWidth * 3
    );

    debugSettings.collisionFloors = visibleFloor;

    // get the closest point to the ball on the floor
    const position = findClosestPoint(visibleFloor, ballNextPosition);
    if (debugSettings.drawClosestCollisionPoint) {
      debugSettings.closestPoint = position;
    }

    // if the distance between the closest point and the ball is less than or equal to it's radius, collision
    if (
      calculateDistance(position, ballNextPosition) <= ball.attributes.radius
    ) {
      // ball.attributes.velocity = ball.attributes.velocity.multiply(0.99); // slow down the ball slightly whenever touching ground
      const normalisedDisplacementVector = new Vector2D(
        ballNextPosition.x - position.x,
        ballNextPosition.y - position.y
      ).normalize();
      if (debugSettings.drawNormalisedDisplacementVector) {
        debugSettings.normalisedDisplacementVector =
          normalisedDisplacementVector;
      }

      reflect(
        ball,
        terrainManager.terrainSettings.surfaceGripCoefficient,
        normalisedDisplacementVector,
        deltaTime
      );
    }
  }
}

export default CollisionDetection;

// Reflect the ball's velocity based on the given reflection vector
function reflect(ball, surfaceGripCoefficient, reflectionVector, deltaTime) {
  const speedToAdd =
    2 * Math.PI * ball.attributes.radius * ball.attributes.rotationsPerSecond -
    ball.attributes.velocity.x;

  const perpendicularFaceVectorAddition = reflectionVector
    .normalize()
    .perpendicularDirection()
    .multiply(speedToAdd)
    .multiply(surfaceGripCoefficient);

  ball.attributes.velocity = ball.attributes.velocity.add(
    perpendicularFaceVectorAddition
  );

  ball.attributes.rotationsPerSecond =
    ball.attributes.rotationsPerSecond -
    (ball.attributes.rotationsPerSecond / 2) * deltaTime;

  ball.attributes.rotationsPerSecond *= 0.99;

  const dotProduct = ball.attributes.velocity.dotProduct(reflectionVector);
  const reflection = {
    x:
      reflectionVector.x *
      dotProduct *
      2 *
      (1 - ball.stats.getStat("grip").currentValue),
    y: reflectionVector.y * dotProduct * 2 * 0.8,
  };
  if (debugSettings.drawReflectionVector) {
    debugSettings.reflectionVector = new Vector2D(reflection.x, reflection.y);
  }
  ball.attributes.velocity.x -= reflection.x;
  ball.attributes.velocity.y -= reflection.y;

  ball.jumpsRemaining = ball.stats.getStat("jumps").currentValue;
}

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
