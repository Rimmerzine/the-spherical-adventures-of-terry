import { BackgroundObject } from "../utils/BackgroundObject";
import { Position2D } from "../utils/Position2D";

class Star implements BackgroundObject {
    position: Position2D;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    static collectionCount: number = 100;
    static collection: Array<HTMLCanvasElement> = [];

    constructor(
        position: Position2D
    ) {
        this.position = position;
        if(Star.collection.length < Star.collectionCount) {
            const sizeRand: number = Math.random() * 20 + 10

            this.width = sizeRand;
            this.height = sizeRand;
    
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
    
            this.context = this.canvas.getContext('2d');
    
            const gradiant = this.context.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.height / 2);
            gradiant.addColorStop(0, `hsla(0, 100%, 100%, 1)`);
            gradiant.addColorStop(1, `hsla(0, 100%, 100%, 0)`);
            this.context.fillStyle = gradiant;
            this.context.beginPath();
            this.context.arc(this.width / 2, this.height / 2, this.height, 0, 2 * Math.PI);
            this.context.fill();
    
            this.context.strokeStyle = "white";
            this.context.beginPath();
            this.context.moveTo(this.width / 2, 0);
            this.context.lineTo(this.width / 2, this.height);
            this.context.moveTo(0, this.height / 2);
            this.context.lineTo(this.width, this.height / 2);
            this.context.stroke();

            Star.collection.push(this.canvas);
        } else {
            this.canvas = Star.collection[Math.floor(Math.random() * Star.collectionCount)];
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }
    }

    draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void {
        context.drawImage(this.canvas, this.position.x - cameraOffsetX - this.canvas.width / 2, this.position.y - this.canvas.height / 2 - cameraOffsetY / 2);
    }
}

export {Star}
