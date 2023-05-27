import Game from "./Game.js";
import { ballSettings } from "./Settings.js";

("use strict");

// Get the canvas element and its 2D rendering context
const canvas = document.querySelector("canvas");

// Set the dimensions of the canvas
canvas.width = 1100;
canvas.height = 750;

const game = new Game(canvas);
game.initialise();
game.start();
