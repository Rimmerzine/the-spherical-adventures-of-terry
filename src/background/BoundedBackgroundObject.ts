import {Vector} from "../utils/Vector.js";
import {BackgroundObject} from "./BackgroundObject.js";

abstract class BoundedBackgroundObject extends BackgroundObject {
    constructor(position: Vector, width: number, height: number, collection: Array<HTMLCanvasElement>, collectionCount: number) {
        super("bounded", position, width, height, collection, collectionCount);
    }

    draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void {
        context.drawImage(this.canvas, this.position.x - cameraOffsetX - this.width / 2, this.position.y - this.height / 2 - cameraOffsetY / 2);
    }
}

export {BoundedBackgroundObject};
