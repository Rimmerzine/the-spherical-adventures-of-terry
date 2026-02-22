import { DebugSettings } from "./Settings.js";
import { Vector } from "./utils/Vector.js";
import { Ball } from "./ball/Ball.js";
import { Segment } from "./terrain/Terrain.js";
import { Level } from "./level/Level.js";
import { playerStats } from "./player/PlayerStats.js";

class CollisionDetection {
    constructor() {}

    detectBallFloorCollision(ball: Ball, level: Level, deltaTime: number): void {
        const ballNextPosition = ball.getNextPosition(deltaTime);

        const collidableFloorSegments: Array<Segment> = level.terrain.segments.filter((floor) => {
            const floorX: number = floor.position.x;
            const segmentWidth: number = level.terrain.settings.segmentWidth;
            return floorX >= ballNextPosition.x - segmentWidth && floorX <= ballNextPosition.x + segmentWidth;
        });

        DebugSettings.collisionFloors = collidableFloorSegments;

        let closestPointFinal;

        for (let i = 0; i < collidableFloorSegments.length; i++) {
            const closestPoint: Vector = collidableFloorSegments[i].closestPointTo(ballNextPosition);
            if (
                !DebugSettings.closestPoint ||
                ball.position.subtract(closestPoint).magnitude() < ball.position.subtract(DebugSettings.closestPoint).magnitude()
            ) {
                DebugSettings.closestPoint = closestPoint;
            }
            const closestPointSize = ballNextPosition.subtract(closestPoint).magnitude();
            if (closestPointSize <= ball.attributes.radius) {
                if (!closestPointFinal || ballNextPosition.subtract(closestPointFinal).magnitude() > closestPointSize) {
                    closestPointFinal = closestPoint;
                }
            }
        }

        if (closestPointFinal) {
            playerStats.updateCollided(ball);
            this.resolveBallPointCollision(ball, closestPointFinal, level, deltaTime);
        }
    }

    resolveBallPointCollision(ball: Ball, point: Vector, level: Level, deltaTime: number): void {
        const reflectionVector: Vector = ball.getNextPosition(deltaTime).subtract(point).unit();

        DebugSettings.normalisedDisplacementVector = reflectionVector;

        const surfaceGrip = level.terrain.settings.surfaceGripCoefficient;
        const gripFactor = surfaceGrip * ball.skills.getSkill("grip").currentValue;

        const surfaceElasticity = level.terrain.settings.surfaceElasticity;
        const bounceFactor =
            0.5 +
            (surfaceElasticity + (1 - ball.skills.getSkill("shock-absorber").currentValue) + (1 - ball.skills.getSkill("shock-absorber").currentValue)) / 3 / 2;

        const newBallPosition = point.add(reflectionVector.multiply(ball.attributes.radius));
        const startVelocityMagnitude = ball.attributes.velocity.magnitude();
        const ballDifferenceMagnitude = ball.position.subtract(newBallPosition).magnitude();
        const remainingDistance = ballDifferenceMagnitude / startVelocityMagnitude;

        ball.position = newBallPosition;
        if (startVelocityMagnitude > 0) {
            ball.attributes.remainingMovement = remainingDistance;
        }

        this.resolveImpactAndRotation(ball, reflectionVector, bounceFactor, gripFactor);

        ball.jumpsRemaining = ball.skills.getSkill("jumps").currentValue;
    }

    resolveImpactAndRotation(ball: Ball, reflectionUnitVector: Vector, elasticity: number, grip: number): void {
        // Calculate the component of the ball's velocity in the direction of the reflection vector
        const velocityReflection = ball.attributes.velocity.dot(reflectionUnitVector);

        // Calculate the change in velocity due to the bounce, scaled by elasticity (bounciness factor).
        const impactVelocityChange: Vector = reflectionUnitVector
            .multiply(velocityReflection)
            .multiply(2 * elasticity)
            .multiply(-1);

        // Calculate the ball's circumference, relating its radius to potential rotational speed.
        const ballCircumference = ball.attributes.radius * Math.PI * 2;

        // Find the velocity component perpendicular to the reflection vector,
        const perpendicular = ball.attributes.velocity.subtract(reflectionUnitVector.multiply(velocityReflection));

        // Determine the direction of the rotation normal based on current rotation,
        const rotationNormal = reflectionUnitVector.normal(ball.attributes.rotationsPerSecond >= 0);

        // Calculate the potential rotational velocity, based on current rotational speed and the ball's circumference, for a realistic rolling effect.
        const potentialRotationalVelocity = rotationNormal
            .multiply(ballCircumference * Math.abs(ball.attributes.rotationsPerSecond))
            .add(perpendicular)
            .multiply(0.5);

        // Calculate the velocity adjustment from grip, which affects sliding vs. rolling.
        const rotationalVelocityAddition = potentialRotationalVelocity.subtract(perpendicular).multiply(grip);

        // Update the ball's velocity with the impact and grip-influenced changes.
        ball.attributes.velocity = ball.attributes.velocity.add(impactVelocityChange).add(rotationalVelocityAddition);

        // Adjust the ball's rotational speed to gradually align with its linear velocity.
        ball.attributes.rotationsPerSecond +=
            (((Math.sign(reflectionUnitVector.cross(potentialRotationalVelocity)) * potentialRotationalVelocity.magnitude()) / ballCircumference -
                ball.attributes.rotationsPerSecond) /
                2) *
            grip;
    }
}

const collisionDetection = new CollisionDetection();

export { collisionDetection };
