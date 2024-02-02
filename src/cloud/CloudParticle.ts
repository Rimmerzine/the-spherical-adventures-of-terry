import { Position2D } from "../utils/Position2D.js";

class CloudParticle {
    relativePosition: Position2D;
    radius: number;
  
    constructor(
      relativePosition: Position2D,
      radius: number
    ) {
      this.relativePosition = relativePosition;
      this.radius = radius;
    }
}

export {CloudParticle}
