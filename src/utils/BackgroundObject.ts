import { Position2D } from "./Position2D";

interface BackgroundObject {
    position: Position2D;
    draw: (context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number) => void;
};

export {BackgroundObject};
