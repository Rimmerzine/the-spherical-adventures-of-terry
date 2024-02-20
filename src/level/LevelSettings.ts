import { BackgroundObject } from "../background/BackgroundObject.js";
import TerrainSettings from "../terrain/TerrainSettings.js";
import { Position2D } from "../utils/Position2D.js";
import { Vector2D } from "../utils/Vector2D.js";

class LevelSettings {
    name: string;
    terrainSettings: TerrainSettings
    skyColour: string;
    gravity: Vector2D;
    backgroundObjectsCreation: Array<BackgroundObjectCreationSettings>;

    constructor(
        name: string,
        terrainSettings: TerrainSettings,
        skyColour: string,
        gravity: Vector2D,
        backgroundObjectCreation: Array<BackgroundObjectCreationSettings>
    ) {
        this.name = name;
        this.terrainSettings = terrainSettings;
        this.skyColour = skyColour;
        this.gravity = gravity;
        this.backgroundObjectsCreation = backgroundObjectCreation;
    }
}

export {LevelSettings}

class BackgroundObjectCreationSettings {
    create: (position: Position2D) => BackgroundObject;
    density: number;

    constructor(create: (position: Position2D) => BackgroundObject, density: number) {
        this.create = create;
        this.density = density;
    }
}

export {BackgroundObjectCreationSettings}
