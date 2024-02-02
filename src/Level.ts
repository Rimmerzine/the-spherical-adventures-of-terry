import { BackgroundObject } from "./utils/BackgroundObject.js";
import { Terrain } from "./terrain/Terrain.js";

class Level {
    levelKey: string;
    terrain: Terrain;
    backgroundObjects: Array<BackgroundObject>;
    skyColour: string;

    constructor(levelKey: string, terrain: Terrain, backgroundObjects: Array<BackgroundObject>, skyColour: string) {
        this.levelKey = levelKey;
        this.terrain = terrain;
        this.backgroundObjects = backgroundObjects;
        this.skyColour = skyColour;
    }
}
