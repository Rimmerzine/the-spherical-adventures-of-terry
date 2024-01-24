import { Position2D } from "./Position2D.js";

class Cloud {
  position: Position2D
  size: number;
  particles: Array<CloudParticle>

  constructor(
    position: Position2D,
  ) {
    this.position = position;
    this.particles = [];
  }

  addParticle(particle: CloudParticle) {
    this.particles.push(particle);
  }
}

class CloudParticle {
  relativePosition: Position2D;
  radius: number;
  colour: string

  constructor(
    relativePosition: Position2D,
    radius: number
  ) {
    this.relativePosition = relativePosition;
    this.radius = radius;
    this.colour = '#ffffffaa';
  }
}

export {Cloud, CloudParticle};
