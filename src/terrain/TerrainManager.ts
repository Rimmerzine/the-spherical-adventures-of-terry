import {Position2D} from '../utils/Position2D.js';
import { Segment, Terrain } from './Terrain.js';
import TerrainSettings from './TerrainSettings.js';

class TerrainManager {
  constructor() {}
  
  generateTerrain(terrainSettings: TerrainSettings): Terrain {
    const terrain: Terrain = new Terrain(terrainSettings)

    for(let i = 20; i > 0; i--) {
      terrain.addSegment(new Position2D(-terrainSettings.segmentWidth * i, 0))
    }

    for(let i = 0; i < terrainSettings.flatCount; i++) {
      terrain.addSegment(new Position2D(terrainSettings.segmentWidth * i, 0))
    }

    let lastPosition: Position2D = terrain.segments.slice(-1)[0].position || new Position2D(0, 0);

    for(let i = 0; i < terrainSettings.curveCount; i++) {
      const nextHeight: number = this.calculateNextHeight(terrainSettings, i, lastPosition.y)
      const nextPosition: Position2D = this.calculateNextPosition(terrainSettings.segmentWidth, lastPosition, nextHeight)
      terrain.addSegment(nextPosition)
      lastPosition = nextPosition
    }

    if(terrainSettings.hasHoles) {
      for(let i = 50; i <= terrain.segments.length - 50; i += 50) {
        const numberOfHolesPossible = terrain.segments.length / 50;
        const currentHole: number = i / 50;
        const random: number = Math.floor(Math.random() * numberOfHolesPossible)
        if(currentHole > random * 2) {
          terrain.addHole(i, 3);
        } else if(currentHole > random) {
            terrain.addHole(i, 2);
        } else {
          terrain.addHole(i);
        }
      }
    }

    return terrain;
  }
  calculateNextHeight(terrainSettings: TerrainSettings, index: number, lastHeight: number): number {
    const maxDiff = terrainSettings.differenceMaxHeight;
    const minDiff = terrainSettings.differenceMinHeight;
    const maxAdj = terrainSettings.maxHeightAdjustment;
    const minAdj = terrainSettings.minHeightAdjustment;
    const startMax = terrainSettings.startingMaxHeight;
    const startMin = terrainSettings.startingMinHeight;
    const curveCount = terrainSettings.curveCount;
    const potentialMax = startMax - (maxDiff / curveCount) * index;
    const potentialMin = startMin + (minDiff / curveCount) * index;
    const allowedAdjustment = minAdj + (maxAdj / curveCount) * index;
    const targetHeight = Math.min(
      potentialMin,
      Math.max(
        potentialMax,
        lastHeight +
          allowedAdjustment -
          Math.random() * (allowedAdjustment + allowedAdjustment)
      )
    );

    return targetHeight;
  }

  calculateNextPosition(segmentWidth: number, lastPosition: Position2D, newHeight: number) {
    lastPosition =
      lastPosition || new Position2D(0, 0);
    return new Position2D(
      lastPosition.x + segmentWidth,
      newHeight
    );
  }
}

export default TerrainManager;
