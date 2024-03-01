import { PositionedObject } from "./ball/Ball.js";
import {Vector} from "./utils/Vector.js";

class Camera {
  attachedObject: PositionedObject;

  constructor(positionObject: PositionedObject) {
    this.attachedObject = positionObject;
  }

  attach(positionObject: PositionedObject): void {
    this.attachedObject = positionObject;
  }

  getPosition(): Vector {
    return this.attachedObject.position;
  }

}

export {Camera};
