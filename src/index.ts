import {GameManager} from './GameManager.js';

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;

const nav: HTMLElement = document.getElementById('navbar') as HTMLElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - nav.offsetHeight;

const game: GameManager = new GameManager(canvas);
game.play();

window.addEventListener('resize', resize);

function resize(): void {
  if(window.innerHeight < 2048) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - nav.offsetHeight;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("../serviceworker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
