import CanvasRenderer from "./CanvasRenderer.js";
import { Terrain } from "./terrain/Terrain.js";
import TerrainManager from "./terrain/TerrainManager.js";
import TerrainSettings from "./terrain/TerrainSettings.js";
import { BackgroundObject } from "./utils/BackgroundObject.js";
import { Position2D } from "./utils/Position2D.js";

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

export {Level, LevelGenerator, LevelSettings};

class LevelGenerator {
    terrainManager: TerrainManager;

    constructor() {
        this.terrainManager = new TerrainManager();
    }

    generateLevel(levelSettings: LevelSettings): Level {
        const terrain = this.terrainManager.generateTerrain(levelSettings.terrainSettings);
        const backgroundObjects: Array<BackgroundObject> = this.generateBackgroundObjects(levelSettings)

        return new Level(
            terrain,
            backgroundObjects,
            levelSettings.skyColour
        )
    }

    private generateBackgroundObjects(levelSettings: LevelSettings): Array<BackgroundObject> {
        const backgroundObjects: Array<BackgroundObject> = [];
        const curveCount = levelSettings.terrainSettings.curveCount;
        const segmentWidth = levelSettings.terrainSettings.segmentWidth;
        const density = levelSettings.backgroundObjectDensity;
    
        for (let i = -20 * density; i <= curveCount * density + 20 * density; i++) {
          const xRange: number = Math.random() * 500 - 250;
          const yRange: number = Math.random() * 1500 - 750;

          const position = new Position2D(i * segmentWidth / density + xRange, yRange)
          const backgroundObject = levelSettings.backgroundObjectCreation(position);
    
          backgroundObjects.push(backgroundObject);
        }
    
        // for(let i = -20; i <= curveCount * 5 + 20; i++) {
        //   const eyePosition: Position2D = new Position2D(i * segmentWidth / 5, Math.random() * 5000 - 2500);
        //   const eye: Eye = new Eye(eyePosition)
    
        //   backgroundObjects.push(eye);
        // }
    
        return backgroundObjects;
      }

}




class LevelSettings {
    terrainSettings: TerrainSettings
    backgroundObjectDensity: number;
    skyColour: string;
    backgroundObjectCreation: (position: Position2D) => BackgroundObject;

    constructor(
        terrainSettings: TerrainSettings,
        backgroundObjectDensity: number,
        skyColour: string,
        backgroundObjectCreation: (position: Position2D) => BackgroundObject
    ) {
        this.terrainSettings = terrainSettings;
        this.backgroundObjectDensity = backgroundObjectDensity;
        this.skyColour = skyColour;
        this.backgroundObjectCreation = backgroundObjectCreation
    }
}


// class BackgroundObjectSettings {
//     backgroundObjectCreation: (position: Position2D) => BackgroundObject;
// }
