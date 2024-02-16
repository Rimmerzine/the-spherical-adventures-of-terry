import { Position2D } from "../utils/Position2D.js";
import { HeightlessBackgroundObject } from "./HeightlessBackgroundObject.js";

class Skyscraper extends HeightlessBackgroundObject {
    static collectionCount: number = 100;
    static collection: Array<HTMLCanvasElement> = [];

    constructor(position: Position2D) {
        const randWidth: number = Math.random() * 400 + 500;
        const randomXFloat: number = Math.random() * 300 - 300;
        super(position.x + randomXFloat, randWidth, Skyscraper.collection, Skyscraper.collectionCount);
    }

    drawCanvas(): void {
        this.canvas.height = 2000;
        this.height = 1500;
        this.context.strokeStyle = "#222222";
        this.context.fillStyle = "#333333"
        this.context.lineWidth = 11;

        this.context.beginPath();
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.moveTo(0, 0);
        this.context.lineTo(0, this.height);
        this.context.moveTo(this.width, 0);
        this.context.lineTo(this.width, this.height);
        this.context.stroke();
        
        const edgeBuffer: number = 50;
        let windowSizeX: number = 150;
        let possibleWindowCountX: number = 0;
        let remainingSizeX: number = this.width;

        while (remainingSizeX >= windowSizeX + edgeBuffer) {
            remainingSizeX -= windowSizeX;
            remainingSizeX -= edgeBuffer;
            possibleWindowCountX++;
        }

        windowSizeX += (remainingSizeX - edgeBuffer) / possibleWindowCountX;

        this.context.lineWidth = 4;
        this.context.strokeStyle = "#000000";

        const windowSizeY: number = 250;

        for(let i = 0; i < possibleWindowCountX; i++) {
            for(let j = 0; j < 6; j++) {
                if(Math.floor(Math.random() * 2) === 0) {
                    this.context.fillStyle = "#999966";
                } else {
                    this.context.fillStyle = "#111111";
                }
                this.context.beginPath();
                this.context.rect(edgeBuffer + i * (windowSizeX + edgeBuffer), edgeBuffer + j * (windowSizeY + edgeBuffer), windowSizeX, windowSizeY - edgeBuffer);
                this.context.fill();
                this.context.stroke();
            }
        }
    }
}

export {Skyscraper}
