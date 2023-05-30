import Game from "./Game.js";
import { ballSettings, mapSettings } from "./Settings.js";

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

window.addEventListener("resize", resize);

function resize() {
  canvas.width = parent.offsetWidth;
  canvas.height = parent.offsetHeight;
  ballSettings.displayXPosition =
    document.getElementById("canvas-container").offsetWidth / 2;
  ballSettings.startingYPosition =
    document.getElementById("canvas-container").offsetHeight / (3 / 2) - 100;
}
