import { Vector } from "../utils/Vector.js";

abstract class BackgroundObject {
    type: string;
    position: Vector;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(type: string, position: Vector, canvasWidth: number, canvasHeight: number, collection: Array<HTMLCanvasElement>, collectionCount: number) {
        this.position = position;
        this.type = type;

        if (collection.length < collectionCount) {
            this.width = canvasWidth;
            this.height = canvasHeight;

            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.context = this.canvas.getContext("2d");

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

export { BackgroundObject };
