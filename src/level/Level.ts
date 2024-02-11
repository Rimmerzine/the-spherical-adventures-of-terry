import CanvasRenderer from "../CanvasRenderer.js";
import { Terrain } from "../terrain/Terrain.js";
import { BackgroundObject } from "../background/BackgroundObject.js";
import { Vector2D } from "../utils/Vector2D.js";

class Level {
    terrain: Terrain;
    backgroundObjects: Array<BackgroundObject>;
    skyColour: string;
    gravity: Vector2D;

    constructor(terrain: Terrain, backgroundObjects: Array<BackgroundObject>, skyColour: string, gravity: Vector2D) {
        this.terrain = terrain;
        this.backgroundObjects = backgroundObjects;
        this.skyColour = skyColour;
        this.gravity = gravity;
    }

    draw(renderer: CanvasRenderer): void {
        renderer.drawSky(this.skyColour);
        renderer.drawBackgroundObjects(this.backgroundObjects);
        renderer.drawQuadraticFloor(this.terrain);
    }
}

export {Level};
