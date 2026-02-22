import { BackgroundObject } from "../background/BackgroundObject.js";
import { TerrainSettings } from "../terrain/TerrainSettings.js";
import { Vector } from "../utils/Vector.js";

class LevelSettings {
    name: string;
    terrainSettings: TerrainSettings;
    skyColour: string;
    gravity: Vector;
    backgroundObjectsCreation: Array<BackgroundObjectCreationSettings>;

    constructor(
        name: string,
        terrainSettings: TerrainSettings,
        skyColour: string,
        gravity: Vector,
        backgroundObjectCreation: Array<BackgroundObjectCreationSettings>,
    ) {
        this.name = name;
        this.terrainSettings = terrainSettings;
        this.skyColour = skyColour;
        this.gravity = gravity;
        this.backgroundObjectsCreation = backgroundObjectCreation;
    }
}

export { LevelSettings };

class BackgroundObjectCreationSettings {
    create: (position: Vector) => BackgroundObject;
    density: number;

    constructor(create: (position: Vector) => BackgroundObject, density: number) {
        this.create = create;
        this.density = density;
    }
}

export { BackgroundObjectCreationSettings };
