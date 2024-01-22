import {Game} from './Game.js';

const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;
const canvasParent: HTMLElement = canvas.parentElement as HTMLElement;

canvas.width = canvasParent.offsetWidth;
canvas.height = canvasParent.offsetHeight;

const game = new Game(canvas);
game.initialise();
game.start();

window.addEventListener('resize', resize);

function resize(): void {
  canvas.width = canvasParent.offsetWidth;
  canvas.height = canvasParent.offsetHeight;
}
