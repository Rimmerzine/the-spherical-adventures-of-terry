import { Position2D } from "../utils/Position2D.js";
import { BackgroundObject } from "./BackgroundObject.js";

class Eye implements BackgroundObject {
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
        if(Eye.collection.length < Eye.collectionCount) {

            this.width = 200;
            this.height = Math.random() * 100 + 100;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.context = this.canvas.getContext('2d');

            const eyeWidth = 100;
            const eyeHeight = 75;

            const gradiant = this.context.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 0, this.canvas.width / 2, this.canvas.height / 2, this.height / 2);
            gradiant.addColorStop(0, `hsla(0, 100%, 50%, 0.5)`);
            gradiant.addColorStop(1, `hsla(0, 100%, 50%, 0)`);
            this.context.fillStyle = gradiant;
            this.context.beginPath();
            this.context.arc(this.canvas.width / 2, this.canvas.height / 2, this.height, 0, 2 * Math.PI);
            this.context.fill();

            this.context.fillStyle = "rgb(255, 255, 230)"
            this.context.strokeStyle = "rgb(45, 10, 45)";
            this.context.lineWidth = 2;
            this.context.beginPath();
            this.context.moveTo((this.width - eyeWidth) / 2, this.height / 2);
            this.context.quadraticCurveTo(this.width / 2, (this.height - eyeHeight) / 4, this.width - ((this.width - eyeWidth) / 2), this.height / 2);
            this.context.quadraticCurveTo(this.width / 2, this.height - (this.height - eyeHeight) / 4, (this.width - eyeWidth) / 2, this.height / 2);
            this.context.fill();
            this.context.stroke();

            const red2: number = Math.floor(Math.random() * 255)
            const green2: number = Math.floor(Math.random() * 255)
            const blue2: number = Math.floor(Math.random() * 255)

            this.context.fillStyle = `rgb(${red2}, ${green2}, ${blue2})`;
            this.context.lineWidth = 1;
            this.context.beginPath();
            this.context.arc(this.width / 2, this.height / 2, 20, 0, 2 * Math.PI);
            this.context.fill();
            this.context.stroke();

            this.context.fillStyle = "black";
            this.context.beginPath();
            this.context.arc(this.width / 2, this.height / 2, 5, 0, 2 * Math.PI);
            this.context.fill();

            Eye.collection.push(this.canvas);

        } else {
            this.canvas = Eye.collection[Math.floor(Math.random() * Eye.collectionCount)];
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }

      }

    draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void {
        context.drawImage(this.canvas, this.position.x - cameraOffsetX - this.canvas.width / 2, this.position.y - this.canvas.height / 2 - cameraOffsetY / 2);
    }
}

export {Eye}
