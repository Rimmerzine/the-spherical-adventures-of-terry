import Vector2D from "./Vector2D.js";

export const ballSettings = {
  movableDistance: 2,
  acceleration: 0.04,
  maxSpeed: 4,
  displayXPosition: document.getElementById("canvas-container").offsetWidth / 2,
  startingYPosition:
    document.getElementById("canvas-container").offsetHeight / (3 / 2) - 100,
  startingRadius: 50,
  reflectionDampeningFactor: 0.8,
  gripFactor: 0.8,
  totalJumps: 0,
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
