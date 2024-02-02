import { Position2D } from "./Position2D";

interface BackgroundObject {
    position: Position2D;
    width: number;
    height: number;
    draw: (context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number) => void;
};

export {BackgroundObject};
