"use strict";

import { debugSettings } from "./Settings.js";
import Vector2D from "./Vector2D.js";
import Position2D from "./Position2D.js";

class CollisionDetection {
  constructor() {}

  // Reflect the ball's velocity based on the given reflection vector
  reflect(ball, surfaceGripCoefficient, reflectionVector, deltaTime) {
    // const circumferance = 2 * Math.PI * ball.attributes.radius;
    // const potentialSpeed = circumferance * ball.attributes.rotationsPerSecond;
    // const currentSpeed = ball.attributes.velocity.distance();
    // const speedToAdd = potentialSpeed - currentSpeed;

    // const perpendicularFaceVectorAddition = reflectionVector
    //   .normalize()
    //   .perpendicularDirection()
    //   .multiply(speedToAdd)
    //   .multiply(surfaceGripCoefficient);

    // debugSettings.perpendicularFaceVectorAddition = perpendicularFaceVectorAddition;

    // const currentRotation = ball.attributes.rotationsPerSecond;
    // const rotationDifference = (currentRotation - currentSpeed / circumferance) * deltaTime;
    // ball.attributes.rotationsPerSecond -= (rotationDifference * surfaceGripCoefficient) / 2;

    // ball.attributes.rotationsPerSecond *= 0.975;

    const dotProduct = ball.attributes.velocity.dotProduct(reflectionVector);
    const { perpendicular } = calculateParallelAndPerpendicular(reflectionVector, ball.attributes.velocity);

    const circumferance = 2 * Math.PI * ball.attributes.radius;
    const potentialMovement =
      (circumferance * ball.attributes.rotationsPerSecond + Math.sign(perpendicular.x) * perpendicular.distance()) / 2;
    const movementGain = potentialMovement - Math.sign(perpendicular.x) * perpendicular.distance();
    const rotationGain = potentialMovement / circumferance;

    ball.attributes.rotationsPerSecond = rotationGain;

    const perpendicularFaceVectorAddition = reflectionVector
      .normalize()
      .perpendicularDirection()
      .multiply(movementGain)
      .multiply(surfaceGripCoefficient);

    debugSettings.perpendicularFaceVectorAddition = perpendicularFaceVectorAddition;

    const reflection = new Vector2D(
      reflectionVector.x * dotProduct * 2 * 1, // (1 - ball.stats.getStat("grip").currentValue)
      reflectionVector.y * dotProduct * 2 * 1 // change back to 0.8 when finished testing
    );
    if (debugSettings.drawReflectionVector) {
      debugSettings.reflectionVector = new Vector2D(reflection.x, reflection.y);
    }

    const velocityChange = ball.attributes.velocity.add(perpendicularFaceVectorAddition).subtract(reflection);
    ball.attributes.velocity = velocityChange;

    ball.jumpsRemaining = ball.stats.getStat("jumps").currentValue;
  }

  ballFloorCollision(ball, terrainManager, deltaTime) {
    const ballNextPosition = ball.attributes.position.add(ball.attributes.velocity.multiply(deltaTime));
    const visibleFloor = terrainManager.terrain.filter(
      (floor) =>
        floor.x >= ballNextPosition.x - terrainManager.terrainSettings.segmentWidth * 3 &&
        floor.x <= ballNextPosition.x + terrainManager.terrainSettings.segmentWidth * 3
    );

    debugSettings.collisionFloors = visibleFloor;

    // get the closest point to the ball on the floor
    const position = findClosestPoint(visibleFloor, ballNextPosition);
    if (debugSettings.drawClosestCollisionPoint) {
      debugSettings.closestPoint = position;
    }

    // if the distance between the closest point and the ball is less than or equal to it's radius, collision
    if (calculateDistance(position, ballNextPosition) <= ball.attributes.radius) {
      const normalisedDisplacementVector = new Vector2D(
        ballNextPosition.x - position.x,
        ballNextPosition.y - position.y
      ).normalize();
      if (debugSettings.drawNormalisedDisplacementVector) {
        debugSettings.normalisedDisplacementVector = normalisedDisplacementVector;
      }

      this.reflect(
        ball,
        terrainManager.terrainSettings.surfaceGripCoefficient,
        normalisedDisplacementVector,
        deltaTime
      );
    }
  }
}

export default CollisionDetection;

function calculateParallelAndPerpendicular(a, b) {
  // Step 1: Calculate the unit vector of "a"
  const magnitudeA = a.magnitude();
  const uA = new Vector2D(a.x / magnitudeA, a.y / magnitudeA);

  // Step 2: Calculate the dot product between "uA" and "b"
  const dotProduct = uA.dotProduct(b);

  // Step 3: Calculate the parallel vector
  const parallelB = uA.multiply(dotProduct);

  // Step 4: Calculate the perpendicular vector
  const perpendicularB = b.subtract(parallelB);

  return { parallel: parallelB, perpendicular: perpendicularB };
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
      if (calculateDistance(newPoint, givenPoint) < calculateDistance(point, givenPoint)) {
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

function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
  return new Position2D(_getQBezierValue(position, startX, cpX, endX), _getQBezierValue(position, startY, cpY, endY));
}
