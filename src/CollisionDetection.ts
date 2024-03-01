import {DebugSettings} from './Settings.js';
import {Vector} from './utils/Vector.js';
import Ball from './ball/Ball.js';
import { playerStats } from './player/PlayerStats.js';
import { Segment, Terrain } from './terrain/Terrain.js';
import { Level } from './level/Level.js';

class CollisionDetection {
  constructor() {}

  detectBallFloorCollision(ball: Ball, level: Level, deltaTime: number): void {
    const ballNextPosition = ball.getNextPosition(deltaTime);

    const collidableFloorSegments: Array<Segment> = level.terrain.segments.filter(
      floor => {
        const floorX: number = floor.position.x;
        const segmentWidth: number = level.terrain.settings.segmentWidth;
        return floorX >= ballNextPosition.x - segmentWidth && floorX <= ballNextPosition.x + segmentWidth
      }
    );

    DebugSettings.collisionFloors = collidableFloorSegments;

    let closestPointFinal;

    for(let i = 0; i < collidableFloorSegments.length; i++) {
     const closestPoint: Vector = collidableFloorSegments[i].closestPointTo(ballNextPosition);
     if(!DebugSettings.closestPoint || ball.position.subtract(closestPoint).magnitude() < ball.position.subtract(DebugSettings.closestPoint).magnitude()) {
       DebugSettings.closestPoint = closestPoint;
     }
     const closestPointSize = ballNextPosition.subtract(closestPoint).magnitude()
      if(closestPointSize <= ball.attributes.radius) {
        if(!closestPointFinal || ballNextPosition.subtract(closestPointFinal).magnitude() > closestPointSize) {
          closestPointFinal = closestPoint;
        }
      }
    }

    if(closestPointFinal) {
      this.resolveBallPointCollision(ball, closestPointFinal, level, deltaTime);
    }
  }

  resolveBallPointCollision(ball: Ball, point: Vector, level: Level, deltaTime: number): void {
    const reflectionVector: Vector = ball.getNextPosition(deltaTime).subtract(point).unit();
    
    DebugSettings.normalisedDisplacementVector = reflectionVector;

    ball.attributes.velocity.subtract(level.gravity.multiply(deltaTime));

    const surfaceGrip = level.terrain.settings.surfaceGripCoefficient;
    const gripFactor = (surfaceGrip + surfaceGrip + ball.skills.getSkill("grip").currentValue) / 3;

    const surfaceElasticity = level.terrain.settings.surfaceElasticity;
    const bounceFactor = (0.5 + ((surfaceElasticity + (1 - ball.skills.getSkill("shock-absorber").currentValue) + (1 - ball.skills.getSkill("shock-absorber").currentValue)) / 3) / 2)

    this.resolveImpactAndRotation(ball, reflectionVector, bounceFactor, gripFactor);
    
    ball.jumpsRemaining = ball.skills.getSkill('jumps').currentValue;
  }

  resolveImpactAndRotation(ball: Ball, reflectionUnitVector: Vector, elasticity: number, grip: number): void {
    const seperatingVelocity = Vector.dot(ball.attributes.velocity, reflectionUnitVector);
    const seperatingVelocityTotal = seperatingVelocity * 2 * elasticity;
    const perpendicular = ball.attributes.velocity.subtract(reflectionUnitVector.multiply(Vector.dot(reflectionUnitVector, ball.attributes.velocity)));
    const ballCircumference = ball.attributes.radius * Math.PI * 2;
    const potentialMovement = (ballCircumference * ball.attributes.rotationsPerSecond + Math.sign(perpendicular.x) * perpendicular.magnitude()) / 2;
    const movementGain = potentialMovement - Math.sign(perpendicular.x) * perpendicular.magnitude();
    const perpendicularFaceVectorAddition = reflectionUnitVector.normal().multiply(movementGain).multiply(grip);

    ball.attributes.velocity = ball.attributes.velocity.add(reflectionUnitVector.multiply(-seperatingVelocityTotal)).add(perpendicularFaceVectorAddition);
    ball.attributes.rotationsPerSecond += (potentialMovement / ballCircumference - ball.attributes.rotationsPerSecond) * grip;
  }

}

export default CollisionDetection;
