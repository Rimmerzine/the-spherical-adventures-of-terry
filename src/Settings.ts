import { Segment } from "./terrain/Terrain.js";
import { Vector } from "./utils/Vector.js";

export class GameSettings {
    static times: Array<number> = [];
    static fps = 0;
}

export class DebugSettings {
    static debugMode = false;
    static drawClosestCollisionPoint = true;
    static drawNormalisedDisplacementVector = true;
    static drawReflectionVector = true;
    static drawCollisionFloors = true;
    static drawMovementLines = true;
    static closestPoint: Vector = new Vector(0, 0);
    static normalisedDisplacementVector: Vector = new Vector(0, 0);
    static reflectionVector: Vector = new Vector(0, 0);
    static collisionFloors: Array<Segment> = [];
    static perpendicularFaceVectorAddition: Vector = new Vector(0, 0);
}

export const Gravity = new Vector(0, 1500);
