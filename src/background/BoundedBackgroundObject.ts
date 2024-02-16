import { Position2D } from "../utils/Position2D.js";
import { BackgroundObject } from "./BackgroundObject.js";

abstract class BoundedBackgroundObject extends BackgroundObject {
    constructor(position: Position2D, width: number, height: number, collection: Array<HTMLCanvasElement>, collectionCount: number) {
        super(position, width, height, collection, collectionCount);
    }

    draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void {
        context.drawImage(this.canvas, this.position.x - cameraOffsetX - this.width / 2, this.position.y - this.height / 2 - cameraOffsetY / 2);
    }
}

export {BoundedBackgroundObject};
