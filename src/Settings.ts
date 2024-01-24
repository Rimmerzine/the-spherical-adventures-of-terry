import {Position2D} from './Position2D.js';
import {Vector2D} from './Vector2D.js';

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
  static closestPoint: Position2D = new Position2D(0, 0);
  static normalisedDisplacementVector: Vector2D = new Vector2D(0, 0);
  static reflectionVector: Vector2D = new Vector2D(0, 0);
  static collisionFloors: Array<Position2D> = null;
  static perpendicularFaceVectorAddition: Vector2D = new Vector2D(0, 0);
}

export const Gravity = new Vector2D(0, 1500);
