import Vector2D from "./Vector2D.js";

export const ballSettings = {
  movableDistance: 2,
  jumpCooldown: 0,
};

export const gameSettings = {
  times: [],
  fps: null,
};

export const debugSettings = {
  targetFps: 60,
  debugMode: false,
  drawClosestCollisionPoint: true,
  drawNormalisedDisplacementVector: true,
  drawReflectionVector: true,
  drawCollisionFloors: true,
  closestPoint: null,
  normalisedDisplacementVector: null,
  reflectionVector: null,
  collisionFloors: null,
};

export const gravity = new Vector2D(0, 0.15);
