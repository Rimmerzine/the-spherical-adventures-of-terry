import {GameManager} from './GameManager.js';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

const nav: HTMLElement = document.getElementById('navbar') as HTMLElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - nav.offsetHeight;

const game: GameManager = new GameManager(canvas);
game.initialise();
game.start();

window.addEventListener('resize', resize);

function resize(): void {
  if(window.innerHeight < 2048) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - nav.offsetHeight;
  }
}
