import Vector2D from "./Vector2D.js";

("use strict");

export const ballSettings = {
  jumpCooldown: 0,
};

export const gameSettings = {
  times: [],
  fps: null,
};

export const debugSettings = {
  targetFps: 60,
  debugMode: true,
  drawClosestCollisionPoint: true,
  drawNormalisedDisplacementVector: true,
  drawReflectionVector: true,
  drawCollisionFloors: true,
  drawMovementLines: true,
  closestPoint: null,
  normalisedDisplacementVector: null,
  reflectionVector: null,
  collisionFloors: null,
};

export const gravity = new Vector2D(0, 0);
