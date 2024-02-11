import {DebugSettings} from './Settings.js';
import {Vector2D} from './utils/Vector2D.js';
import {Position2D} from './utils/Position2D.js';
import Ball from './ball/Ball.js';
import { playerStats } from './player/PlayerStats.js';
import { Terrain } from './terrain/Terrain.js';

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

    const gripFactor = (surfaceGripCoefficient + surfaceGripCoefficient + ball.skills.getSkill("grip").currentValue) / 3;

    ball.attributes.rotationsPerSecond +=
      (potentialMovement / circumferance - ball.attributes.rotationsPerSecond) *
      gripFactor;

    const perpendicularFaceVectorAddition = reflectionVector
      .normalize()
      .perpendicularDirection()
      .multiply(movementGain)
      .multiply(gripFactor);

    DebugSettings.perpendicularFaceVectorAddition =
      perpendicularFaceVectorAddition;

    const dotProduct = ball.attributes.velocity.dotProduct(reflectionVector);
    const bounceFactor = (0.5 + ((surfaceElasticity + (1 - ball.skills.getSkill("shock-absorber").currentValue) + (1 - ball.skills.getSkill("shock-absorber").currentValue)) / 3) / 2)

    const reflection = new Vector2D(
      reflectionVector.x * dotProduct * 2 * bounceFactor,
      reflectionVector.y * -Math.abs(dotProduct) * 2 * bounceFactor
    );
    if (DebugSettings.drawReflectionVector) {
      DebugSettings.reflectionVector = new Vector2D(reflection.x, reflection.y);
    }

    const velocityChange = ball.attributes.velocity
      .add(perpendicularFaceVectorAddition)
      .subtract(reflection);
    ball.attributes.velocity = velocityChange;

    ball.jumpsRemaining = ball.skills.getSkill('jumps').currentValue;
  }

  ballFloorCollision(
    ball: Ball,
    terrain: Terrain,
    deltaTime: number
  ) {

    const ballNextPosition = ball.getNextPosition(deltaTime);

    const x: number = Math.floor(ballNextPosition.x / terrain.settings.segmentWidth) + 21 //todo: update 21 to become dynamic

    const collidableFloor: Array<Position2D> = terrain.segments.slice(x - 3, x + 3);

    DebugSettings.collisionFloors = collidableFloor;

    const numPositions = Math.ceil(240 / (1 / deltaTime));
    const interPositions = [];

    for (let i = 0; i <= 1; i += 1 / numPositions) {
      interPositions.push(
        ball.position.add(
          ball.attributes.velocity.multiply(deltaTime).multiply(i)
        )
      );
    }

    for (let i = 0; i < interPositions.length; i++) {
      const interPosition = interPositions[i];

      // get the closest point to the ball on the floor
      const position = findClosestPoint(collidableFloor, interPosition, terrain.settings.segmentWidth);
      const currentPositionDistance = calculateDistance(ball.position, position);

      if (DebugSettings.drawClosestCollisionPoint) {
        DebugSettings.closestPoint = position;
      }

      const distance = calculateDistance(interPosition, position);
      if (distance <= ball.attributes.radius && distance < currentPositionDistance) {
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
          terrain.settings.surfaceGripCoefficient,
          terrain.settings.surfaceElasticity,
          normalisedDisplacementVector
        );

        playerStats.updateCollided(ball);

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

function findClosestPoint(floor: Array<Position2D>, givenPoint: Position2D, segmentWidth: number) {
  let point = null;

  for (let i = 1; i < floor.length - 1; i++) {
    const initialFloor = floor[i];
    const previousFloor = floor[i - 1];
    const nextFloor = floor[i + 1];

    const sx = (previousFloor.x + initialFloor.x) / 2;
    const sy = (previousFloor.y + initialFloor.y) / 2;
    const cpx = initialFloor.x;
    const cpy = initialFloor.y;
    const x = (initialFloor.x + nextFloor.x) / 2;
    const y = (initialFloor.y + nextFloor.y) / 2;

    for (let j = 0.0; j <= 1.0; j += 1 / segmentWidth) {
      const newPoint = getQuadraticCurvePoint(sx, sy, cpx, cpy, x, y, j);
      if (calculateDistance(newPoint, givenPoint) < calculateDistance(point, givenPoint)) {
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
