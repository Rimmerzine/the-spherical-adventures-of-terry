import { BackgroundObject } from "../utils/BackgroundObject.js";
import { Position2D } from "../utils/Position2D.js";
import { CloudParticle } from "./CloudParticle.js";

class Cloud implements BackgroundObject {
  particles: Array<CloudParticle>
  position: Position2D;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(
    position: Position2D
  ) {
    this.position = position;
    this.canvas = document.createElement('canvas');
    this.width = 900;
    this.height = 700;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext('2d');
  }

  draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void {
    context.drawImage(this.canvas, this.position.x - cameraOffsetX - this.canvas.width / 2, this.position.y - this.canvas.height / 2 - cameraOffsetY / 2);
  }

  addParticle(particle: CloudParticle) {
    this.context.fillStyle="#ffffff88"
    this.context.beginPath();
    this.context.arc(particle.relativePosition.x + this.canvas.width / 2, particle.relativePosition.y + this.canvas.height / 2, particle.radius, 0, 2 * Math.PI);
    this.context.fill();
  }
}



export {Cloud, CloudParticle};
