import { BackgroundObject } from "../background/BackgroundObject.js";
import { Player } from "../player/Player.js";
import { Segment } from "../terrain/Terrain.js";
import TerrainManager from "../terrain/TerrainManager.js";
import { Position2D } from "../utils/Position2D.js";
import { Vector2D } from "../utils/Vector2D.js";
import { CollectablePoint, Level } from "./Level.js";
import { LevelSettings } from "./LevelSettings.js";

class LevelGenerator {
    terrainManager: TerrainManager;

    constructor() {
        this.terrainManager = new TerrainManager();
    }

    generateLevel(player: Player, levelSettings: LevelSettings): Level {
        const terrain = this.terrainManager.generateTerrain(levelSettings.terrainSettings);
        const backgroundObjects: Array<BackgroundObject> = this.generateBackgroundObjects(levelSettings)
        const levelPointsCollected: Array<Position2D> = player.levelPointsCollected.get(levelSettings.name) || [];
        const collectables = this.generateCollectablePoints(terrain.segments, levelPointsCollected)
        
        return new Level(
            levelSettings.name,
            terrain,
            backgroundObjects,
            collectables,
            levelSettings.skyColour,
            levelSettings.gravity
        )
    }

    private generateCollectablePoints(segments: Array<Segment>, collectedPoints: Array<Position2D>): Array<CollectablePoint> {
        const collectables: Array<CollectablePoint> = [];

        for(let i = 21; i < segments.length; i+= 20) {
            const segment: Segment = segments[i];
            const collectablePosition = segment.nextMidPoint.add(new Vector2D(0, -100));
            
            if(collectedPoints.find(position => collectablePosition.x === position.x)) {
                collectables.push(new CollectablePoint(collectablePosition, true));
            } else {
                collectables.push(new CollectablePoint(collectablePosition, false));
            }
        }

        return collectables;
    }

    private generateBackgroundObjects(levelSettings: LevelSettings): Array<BackgroundObject> {
        const backgroundObjects: Array<BackgroundObject> = [];
        const curveCount = levelSettings.terrainSettings.curveCount;
        const segmentWidth = levelSettings.terrainSettings.segmentWidth;

        for(let j = 0; j < levelSettings.backgroundObjectsCreation.length; j++) {
            const density = levelSettings.backgroundObjectsCreation[j].density;
        
            for (let i = -20 * density; i <= curveCount * density + 20 * density; i++) {
                //   const xRange: number = Math.random() * 500 - 250;
                const yRange: number = -Math.random() * 10000 + 1000;

                const position = new Position2D(i * segmentWidth / density, yRange)
                const backgroundObject = levelSettings.backgroundObjectsCreation[j].create(position);
            
                backgroundObjects.push(backgroundObject);
            }
        }
    
        return backgroundObjects;
      }

}

export {LevelGenerator}
