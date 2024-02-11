import {Position2D, PositionedObject} from "./utils/Position2D.js";

class Camera {
  attachedObject: PositionedObject;

  constructor(positionObject: PositionedObject) {
    this.attachedObject = positionObject;
  }

  attach(positionObject: PositionedObject): void {
    this.attachedObject = positionObject;
  }

  getPosition(): Position2D {
    return this.attachedObject.position;
  }

}

export {Camera};
