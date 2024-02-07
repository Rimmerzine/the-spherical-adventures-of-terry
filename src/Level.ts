import { BackgroundObject } from "./utils/BackgroundObject.js";
import { Position2D } from "./utils/Position2D.js";

class Level {
    levelKey: string;
    terrain: Array<Position2D>;
    backgroundObjects: Array<BackgroundObject>;
    skyColour: string;

    constructor(levelKey: string, terrain: Array<Position2D>, backgroundObjects: Array<BackgroundObject>, skyColour: string) {
        this.levelKey = levelKey;
        this.terrain = terrain;
        this.backgroundObjects = backgroundObjects;
        this.skyColour = skyColour;
    }
}
