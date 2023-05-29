import Vector2D from "./Vector2D.js";

export const mapSettings = {
  floorSegmentWidth: 200,
  floorSegmentCount: 1000,
  flatFloorCount: 10,
  floorSegmentCount: 1000,
  floorStartingHeight: 650,
};

export const ballSettings = {
  movableDistance: 10,
  movementSpeed: 0.05,
  displayXPosition: 400,
  startingYPosition: 450,
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
  targetFps: 144,
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
