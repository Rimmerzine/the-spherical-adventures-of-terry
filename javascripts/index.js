import Game from "./Game.js";
import { ballSettings, mapSettings } from "./Settings.js";
import Terrain from "./Terrain.js";
import TerrainSettings from "./TerrainSettings.js";

("use strict");

// Get the canvas element and its 2D rendering context
const canvas = document.querySelector("canvas");
const parent = document.getElementById("canvas-container");

// Set the dimensions of the canvas
canvas.width = parent.offsetWidth;
canvas.height = parent.offsetHeight;

const game = new Game(canvas);
game.initialise();
game.start();

const terrainSettings = new TerrainSettings(
  200,
  10,
  1000,
  document.getElementById("canvas-container").offsetHeight / (3 / 2),
  document.getElementById("canvas-container").offsetHeight / (3 / 2) + 100,
  document.getElementById("canvas-container").offsetHeight / (3 / 2) - 100,
  document.getElementById("canvas-container").offsetHeight / (3 / 2) + 1000,
  document.getElementById("canvas-container").offsetHeight / (3 / 2) - 1000,
  50,
  500
);
// const terrain = new Terrain(terrainSettings).generateTerrain();

window.addEventListener("resize", resize);

function resize() {
  canvas.width = parent.offsetWidth;
  canvas.height = parent.offsetHeight;
  ballSettings.displayXPosition =
    document.getElementById("canvas-container").offsetWidth / 2;
  ballSettings.startingYPosition =
    document.getElementById("canvas-container").offsetHeight / (3 / 2) - 100;
}
