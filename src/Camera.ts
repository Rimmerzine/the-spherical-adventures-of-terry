import { PositionedObject } from "./ball/Ball.js";
import { Vector } from "./utils/Vector.js";

class Camera {
    attachedObject: PositionedObject;

    constructor() {}

    attach(positionObject: PositionedObject): void {
        this.attachedObject = positionObject;
    }

    getPosition(): Vector {
        return this.attachedObject.position;
    }
}

const camera = new Camera();

export { camera };
