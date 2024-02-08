import CanvasRenderer from "./CanvasRenderer.js";
import { Terrain } from "./terrain/Terrain.js";
import { BackgroundObject } from "./utils/BackgroundObject.js";

class Level {
    terrain: Terrain;
    backgroundObjects: Array<BackgroundObject>;
    skyColour: string;

    constructor(terrain: Terrain, backgroundObjects: Array<BackgroundObject>, skyColour: string) {
        this.terrain = terrain;
        this.backgroundObjects = backgroundObjects;
        this.skyColour = skyColour;
    }

    draw(renderer: CanvasRenderer): void {
        renderer.drawSky(this.skyColour);
        renderer.drawBackgroundObjects(this.backgroundObjects);
        renderer.drawQuadraticFloor(this.terrain);
    }
}

export {Level};
