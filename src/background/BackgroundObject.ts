import { Position2D } from "../utils/Position2D.js";

abstract class BackgroundObject {
    type: string;
    position: Position2D;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(type: string, position: Position2D, canvasWidth: number, canvasHeight: number, collection: Array<HTMLCanvasElement>, collectionCount: number) {
        this.position = position;

        if (collection.length < collectionCount) {
            this.width = canvasWidth;
            this.height = canvasHeight;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.context = this.canvas.getContext('2d');

            this.drawCanvas();

            collection.push(this.canvas);
        } else {
            this.canvas = collection[Math.floor(Math.random() * collectionCount)];
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }
    }

    abstract drawCanvas(): void;

    abstract draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void;
}

export {BackgroundObject};
