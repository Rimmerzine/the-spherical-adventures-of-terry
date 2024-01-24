import {DebugSettings} from './Settings.js';
import {Vector2D} from './Vector2D.js';
import {Position2D} from './Position2D.js';
import Ball from './Ball.js';
import TerrainManager from './TerrainManager.js';

class CollisionDetection {
  constructor() {}

  // Reflect the ball's velocity based on the given reflection vector
  reflect(
    ball: Ball,
    surfaceGripCoefficient: number,
    surfaceElasticity: number,
    reflectionVector: Vector2D
  ) {
    const {perpendicular} = calculateParallelAndPerpendicular(
      reflectionVector,
      ball.attributes.velocity
    );
    const circumferance = 2 * Math.PI * ball.attributes.radius;
    const potentialMovement =
      (circumferance * ball.attributes.rotationsPerSecond +
        Math.sign(perpendicular.x) * perpendicular.distance()) /
      2;
    const movementGain =
      potentialMovement - Math.sign(perpendicular.x) * perpendicular.distance();

    ball.attributes.rotationsPerSecond +=
      (potentialMovement / circumferance - ball.attributes.rotationsPerSecond) *
      surfaceGripCoefficient;

    const perpendicularFaceVectorAddition = reflectionVector
      .normalize()
      .perpendicularDirection()
      .multiply(movementGain)
      .multiply(surfaceGripCoefficient);

    DebugSettings.perpendicularFaceVectorAddition =
      perpendicularFaceVectorAddition;

    const dotProduct = ball.attributes.velocity.dotProduct(reflectionVector);
    const reflection = new Vector2D(
      reflectionVector.x * dotProduct * 2 * surfaceElasticity, // (1 - ball.stats.getStat("grip").currentValue)
      reflectionVector.y * dotProduct * 2 * surfaceElasticity // change back to 0.8 when finished testing
    );
    if (DebugSettings.drawReflectionVector) {
      DebugSettings.reflectionVector = new Vector2D(reflection.x, reflection.y);
    }

    const velocityChange = ball.attributes.velocity
      .add(perpendicularFaceVectorAddition)
      .subtract(reflection);
    ball.attributes.velocity = velocityChange;

    ball.jumpsRemaining = ball.stats.getStat('jumps').currentValue;
  }

  ballFloorCollision(
    ball: Ball,
    terrainManager: TerrainManager,
    deltaTime: number
  ) {
    const ballNextPosition = ball.getPosition().add(
      ball.attributes.velocity.multiply(deltaTime)
    );

    const visibleFloor = terrainManager.terrain.filter(
      floor =>
        floor.x >=
          ballNextPosition.x -
            terrainManager.terrainSettings.segmentWidth * 3 &&
        floor.x <=
          ballNextPosition.x + terrainManager.terrainSettings.segmentWidth * 3
    );

    DebugSettings.collisionFloors = visibleFloor;

    const numPositions = Math.ceil(240 / (1 / deltaTime));
    const interPositions = [];

    for (let i = 0; i <= 1; i += 1 / numPositions) {
      interPositions.push(
        ball.getPosition().add(
          ball.attributes.velocity.multiply(deltaTime).multiply(i)
        )
      );
    }

    for (let i = 0; i < interPositions.length; i++) {
      const interPosition = interPositions[i];

      // get the closest point to the ball on the floor
      const position = findClosestPoint(visibleFloor, interPosition);
      if (DebugSettings.drawClosestCollisionPoint) {
        DebugSettings.closestPoint = position;
      }

      const distance = calculateDistance(interPosition, position);
      if (distance <= ball.attributes.radius) {
        const normalisedDisplacementVector = new Vector2D(
          interPosition.x - position.x,
          interPosition.y - position.y
        ).normalize();

        if (DebugSettings.drawNormalisedDisplacementVector) {
          DebugSettings.normalisedDisplacementVector =
            normalisedDisplacementVector;
        }

        this.reflect(
          ball,
          terrainManager.terrainSettings.surfaceGripCoefficient,
          terrainManager.terrainSettings.surfaceElasticity,
          normalisedDisplacementVector
        );

        break;
      }
    }
  }
}

export default CollisionDetection;

function calculateParallelAndPerpendicular(a: Vector2D, b: Vector2D) {
  // Step 1: Calculate the unit vector of "a"
  const magnitudeA = a.magnitude();
  const uA = new Vector2D(a.x / magnitudeA, a.y / magnitudeA);

  // Step 2: Calculate the dot product between "uA" and "b"
  const dotProduct = uA.dotProduct(b);

  // Step 3: Calculate the parallel vector
  const parallelB = uA.multiply(dotProduct);

  // Step 4: Calculate the perpendicular vector
  const perpendicularB = b.subtract(parallelB);

  return {parallel: parallelB, perpendicular: perpendicularB};
}

function calculateDistance(pointOne: Position2D, pointTwo: Position2D) {
  if (pointOne === null || pointTwo === null) return Infinity;
  const dx = pointTwo.x - pointOne.x;
  const dy = pointTwo.y - pointOne.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
}

function findClosestPoint(floor: Array<Position2D>, givenPoint: Position2D) {
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

function _getQBezierValue(t: number, p1: number, p2: number, p3: number) {
  const iT = 1 - t;
  return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(
  startX: number,
  startY: number,
  cpX: number,
  cpY: number,
  endX: number,
  endY: number,
  position: number
) {
  return new Position2D(
    _getQBezierValue(position, startX, cpX, endX),
    _getQBezierValue(position, startY, cpY, endY)
  );
}
