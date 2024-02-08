import {Position2D, PositionedObject} from "./utils/Position2D.js";

class Camera {
  attachedObject: PositionedObject;

  constructor() {
    this.attachedObject = null;
  }

  attach(positionObject: PositionedObject): void {
    this.attachedObject = positionObject;
  }

  getPosition(): Position2D {
    return this.attachedObject.position;
  }

}

export {Camera};
