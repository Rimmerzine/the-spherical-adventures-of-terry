import { Position2D } from "../utils/Position2D.js";
import { BackgroundObject } from "./BackgroundObject.js";

abstract class HeightlessBackgroundObject extends BackgroundObject {
    constructor(xPosition: number, width: number, collection: Array<HTMLCanvasElement>, collectionCount: number) {
        super(new Position2D(xPosition, 0), width, 0, collection, collectionCount);
    }

    draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void {
        const sideCount: number = Math.ceil(((context.canvas.height - this.height) / 2) / this.height);
        for(let i = -sideCount - 2; i <= sideCount; i++) {
            context.drawImage(this.canvas, Math.floor(this.position.x - cameraOffsetX - this.width / 2), Math.floor(context.canvas.height / 2 - (cameraOffsetY % this.height) + this.height * i));
        }
    }
}

export {HeightlessBackgroundObject};
