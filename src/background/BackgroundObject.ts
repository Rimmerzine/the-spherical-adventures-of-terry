import { Position2D } from "../utils/Position2D.js";

interface BackgroundObject {
    position: Position2D;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    
    draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void;
};

export {BackgroundObject};
