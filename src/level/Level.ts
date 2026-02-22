import { CanvasRenderer } from "../CanvasRenderer.js";
import { Terrain } from "../terrain/Terrain.js";
import { BackgroundObject } from "../background/BackgroundObject.js";
import { Vector } from "../utils/Vector.js";

class Level {
    name: string;
    terrain: Terrain;
    backgroundObjects: Array<BackgroundObject>;
    collectables: Array<CollectablePoint>;
    skyColour: string;
    gravity: Vector;

    constructor(
        name: string,
        terrain: Terrain,
        backgroundObjects: Array<BackgroundObject>,
        collectables: Array<CollectablePoint>,
        skyColour: string,
        gravity: Vector,
    ) {
        this.name = name;
        this.terrain = terrain;
        this.backgroundObjects = backgroundObjects;
        this.skyColour = skyColour;
        this.gravity = gravity;
        this.collectables = collectables;
    }

    draw(renderer: CanvasRenderer): void {
        renderer.drawSky(this.skyColour);
        renderer.drawBackgroundObjects(this.backgroundObjects);
        renderer.drawCollectables(this.collectables);
        renderer.drawQuadraticFloor(this.terrain);
    }
}

export { Level, CollectablePoint };

class CollectablePoint {
    position: Vector;
    collected: boolean;
    static canvas: HTMLCanvasElement;
    static collectedCanvas: HTMLCanvasElement;
    static size: number;

    constructor(position: Vector, collected: boolean) {
        this.position = position;
        this.collected = collected;

        if (!CollectablePoint.size) {
            CollectablePoint.size = 50;
        }

        if (!CollectablePoint.canvas) {
            CollectablePoint.canvas = document.createElement("canvas");
            CollectablePoint.canvas.width = CollectablePoint.size;
            CollectablePoint.canvas.height = CollectablePoint.size;

            const context: CanvasRenderingContext2D = CollectablePoint.canvas.getContext("2d");

            context.lineWidth = 5;
            context.fillStyle = "hsla(45, 100%, 50%, 1)";
            context.strokeStyle = "hsla(30, 100%, 50%, 1)";
            context.beginPath();
            context.arc(CollectablePoint.size / 2, CollectablePoint.size / 2, CollectablePoint.size / 2 - 5, 0, 2 * Math.PI);
            context.stroke();
            context.fill();

            context.lineWidth = 2;
            context.strokeStyle = "hsla(20, 100%, 50%, 1)";
            context.beginPath();
            context.arc(CollectablePoint.size / 2, CollectablePoint.size / 2, CollectablePoint.size / 2 - 8, 0, 2 * Math.PI);
            context.stroke();
        }

        if (!CollectablePoint.collectedCanvas) {
            CollectablePoint.collectedCanvas = document.createElement("canvas");
            CollectablePoint.collectedCanvas.width = CollectablePoint.size;
            CollectablePoint.collectedCanvas.height = CollectablePoint.size;

            const context: CanvasRenderingContext2D = CollectablePoint.collectedCanvas.getContext("2d");

            context.lineWidth = 5;
            context.fillStyle = "hsla(45, 100%, 50%, 0.25)";
            context.strokeStyle = "hsla(30, 100%, 50%, 0.25)";
            context.beginPath();
            context.arc(CollectablePoint.size / 2, CollectablePoint.size / 2, CollectablePoint.size / 2 - 5, 0, 2 * Math.PI);
            context.stroke();
            context.fill();

            context.lineWidth = 2;
            context.strokeStyle = "hsla(20, 100%, 50%, 0.25)";
            context.beginPath();
            context.arc(CollectablePoint.size / 2, CollectablePoint.size / 2, CollectablePoint.size / 2 - 8, 0, 2 * Math.PI);
            context.stroke();
        }
    }

    draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number) {
        if (this.collected) {
            context.drawImage(
                CollectablePoint.collectedCanvas,
                this.position.x - cameraOffsetX - CollectablePoint.size / 2,
                this.position.y - CollectablePoint.size / 2 - cameraOffsetY,
            );
        } else {
            context.drawImage(
                CollectablePoint.canvas,
                this.position.x - cameraOffsetX - CollectablePoint.size / 2,
                this.position.y - CollectablePoint.size / 2 - cameraOffsetY,
            );
        }
    }
}
