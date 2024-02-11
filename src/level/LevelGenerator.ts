import { BackgroundObject } from "../background/BackgroundObject.js";
import TerrainManager from "../terrain/TerrainManager.js";
import { Position2D } from "../utils/Position2D.js";
import { Level } from "./Level.js";
import { LevelSettings } from "./LevelSettings.js";

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
            levelSettings.skyColour,
            levelSettings.gravity
        )
    }

    private generateBackgroundObjects(levelSettings: LevelSettings): Array<BackgroundObject> {
        const backgroundObjects: Array<BackgroundObject> = [];
        const curveCount = levelSettings.terrainSettings.curveCount;
        const segmentWidth = levelSettings.terrainSettings.segmentWidth;
        const density = levelSettings.backgroundObjectDensity;
    
        for (let i = -20 * density; i <= curveCount * density + 20 * density; i++) {
        //   const xRange: number = Math.random() * 500 - 250;
          const yRange: number = -Math.random() * 10000 + 1000;

          const position = new Position2D(i * segmentWidth / density, yRange)
          const backgroundObject = levelSettings.backgroundObjectCreation(position);
    
          backgroundObjects.push(backgroundObject);
        }
    
        return backgroundObjects;
      }

}

export {LevelGenerator}
