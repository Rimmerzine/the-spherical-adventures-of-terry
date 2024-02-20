import { Position2D } from "../utils/Position2D.js";
import { HeightlessBackgroundObject } from "./HeightlessBackgroundObject.js";

class LavaFalls extends HeightlessBackgroundObject {
    static collectionCount: number = 100;
    static collection: Array<HTMLCanvasElement> = [];

    constructor(position: Position2D) {
        const randomXFloat: number = Math.random() * 2000 - 2000;
        super(position.x + randomXFloat, 100, LavaFalls.collection, LavaFalls.collectionCount);
    }

    drawCanvas(): void {
        this.canvas.height = 1500;
        this.height = 1500;
        this.context.strokeStyle = "#ff8000";
        this.context.fillStyle = "#c2570a"
        this.context.lineWidth = 11;

        this.context.beginPath();
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.height);
        this.context.moveTo(this.width, 0);
        this.context.lineTo(this.width, this.height);
        this.context.stroke();
    }
}

export {LavaFalls}
