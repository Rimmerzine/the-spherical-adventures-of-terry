import { BackgroundObject } from "../background/BackgroundObject.js";
import TerrainSettings from "../terrain/TerrainSettings.js";
import { Position2D } from "../utils/Position2D.js";
import { Vector2D } from "../utils/Vector2D.js";

class LevelSettings {
    terrainSettings: TerrainSettings
    backgroundObjectDensity: number;
    skyColour: string;
    gravity: Vector2D;
    backgroundObjectCreation: (position: Position2D) => BackgroundObject;

    constructor(
        terrainSettings: TerrainSettings,
        backgroundObjectDensity: number,
        skyColour: string,
        gravity: Vector2D,
        backgroundObjectCreation: (position: Position2D) => BackgroundObject
    ) {
        this.terrainSettings = terrainSettings;
        this.backgroundObjectDensity = backgroundObjectDensity;
        this.skyColour = skyColour;
        this.gravity = gravity;
        this.backgroundObjectCreation = backgroundObjectCreation;
    }
}

export {LevelSettings}
