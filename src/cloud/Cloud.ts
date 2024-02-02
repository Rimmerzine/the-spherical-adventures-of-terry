import { BackgroundObject } from "../utils/BackgroundObject.js";
import { Position2D, PositionedObject } from "../utils/Position2D.js";
import { CloudParticle } from "./CloudParticle.js";

class Cloud implements BackgroundObject {
  particles: Array<CloudParticle>
  position: Position2D;

  constructor(
    position: Position2D,
  ) {
    this.position = position;
    this.particles = [];
  }

  draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void {

    for(let i = 0; i < this.particles.length; i++) {
      const cloudParticle: CloudParticle = this.particles[i];
      const cloudPosition = this.position;

      const particlePositionX: number = (cloudPosition.x + cloudParticle.relativePosition.x) - cameraOffsetX;
      const particlePositionY: number = (cloudPosition.y + cloudParticle.relativePosition.y) - cameraOffsetY / 2;
      
      context.fillStyle = "#ffffff88";

      context.beginPath();
      context.arc(particlePositionX, particlePositionY, cloudParticle.radius, 0, 2 * Math.PI);
      context.fill();
    }

  }

  addParticle(particle: CloudParticle) {
    this.particles.push(particle);
  }
}



export {Cloud, CloudParticle};
