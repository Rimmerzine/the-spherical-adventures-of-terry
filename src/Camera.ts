import {Position2D, PositionedObject} from "./Position2D";

class Camera {
  attachedObject: PositionedObject;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.attachedObject = null;
  }

  attach(positionObject: PositionedObject): void {
    this.attachedObject = positionObject;
  }

  getPosition(): Position2D {
    return this.attachedObject.getPosition();
  }

}

export {Camera};
