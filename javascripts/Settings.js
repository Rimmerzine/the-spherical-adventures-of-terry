import Vector2D from "./Vector2D.js";

export const mapSettings = {
  floorSegmentWidth: 100,
  floorSegmentCount: 1000,
  flatFloorCount: 10,
  floorSegmentCount: 1000,
  floorStartingHeight: 650,
};

export const ballSettings = {
  movableDistance: 10,
  movementSpeed: 0.1,
  ballDisplayXPosition: mapSettings.floorSegmentWidth * 4,
};

export const gameSettings = {
  debugMode: false,
  times: [],
  fps: null,
};

export const gravity = new Vector2D(0, 0.2);
