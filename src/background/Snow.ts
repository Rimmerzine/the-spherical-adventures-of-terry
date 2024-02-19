import { Position2D } from "../utils/Position2D.js";
import { BoundedBackgroundObject } from "./BoundedBackgroundObject.js";

class Snow extends BoundedBackgroundObject {
    static collectionCount: number = 100;
    static collection: Array<HTMLCanvasElement> = [];

    constructor(position: Position2D) {
        const randomSize: number = Math.random() * 15 + 10;
        super(position, randomSize, randomSize, Snow.collection, Snow.collectionCount);
    }

    drawCanvas(): void {
        const gradiant = this.context.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.height / 2);
        gradiant.addColorStop(0, `hsla(0, 100%, 100%, 0.75)`);
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

        this.context.moveTo(this.width / 2, this.height / 4);
        this.context.lineTo(this.width / 4, this.height / 8);
        this.context.moveTo(this.width / 2, this.height / 4);
        this.context.lineTo(this.width * 3 / 4, this.height / 8);

        this.context.moveTo(this.width / 2, this.height * 3 / 4);
        this.context.lineTo(this.width / 4, this.height * 7 / 8);
        this.context.moveTo(this.width / 2, this.height * 3 / 4);
        this.context.lineTo(this.width * 3 / 4, this.height * 7 / 8);

        this.context.moveTo(this.width / 4, this.height / 2);
        this.context.lineTo(this.width / 8, this.height / 4);
        this.context.moveTo(this.width / 4, this.height / 2);
        this.context.lineTo(this.width / 8, this.height * 3 / 4);

        this.context.moveTo(this.width * 3 / 4, this.height / 2);
        this.context.lineTo(this.width * 7 / 8, this.height / 4);
        this.context.moveTo(this.width * 3 / 4, this.height / 2);
        this.context.lineTo(this.width * 7 / 8, this.height * 3 / 4);
        
        this.context.stroke();
    }
}

export {Snow}
