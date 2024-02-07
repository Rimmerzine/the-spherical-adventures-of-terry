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
}

export {Level};
