import Vector2D from "./Vector2D.js";

("use strict");

export const gameSettings = {
  times: [],
  fps: null,
};

export const debugSettings = {
  debugMode: false,
  drawClosestCollisionPoint: true,
  drawNormalisedDisplacementVector: true,
  drawReflectionVector: true,
  drawCollisionFloors: true,
  drawMovementLines: true,
  closestPoint: null,
  normalisedDisplacementVector: null,
  reflectionVector: null,
  collisionFloors: null,
  perpendicularFaceVectorAddition: null,
};

export const gravity = new Vector2D(0, 500);
// export const gravity = new Vector2D(0, 0);
