import {Position2D} from '../utils/Position2D.js';
import { Terrain } from './Terrain.js';
import TerrainSettings from './TerrainSettings.js';

class TerrainManager {
  constructor() {}
  
  generateTerrain(terrainSettings: TerrainSettings): Terrain {
    const terrain: Array<Position2D> = [];

    for(let i = 20; i > 0; i--) {
      const position = new Position2D(
        -terrainSettings.segmentWidth * i,
        0
      )
      terrain.push(position);
    }

    for (let i = 0; i < terrainSettings.flatCount; i++) {
      const position = new Position2D(
        terrainSettings.segmentWidth * i,
        0
      );
      terrain.push(position);
    }
    let lastPosition =
      terrain.slice(-1)[0] ||
      new Position2D(0, 0);
    for (let i = 0; i < terrainSettings.curveCount; i++) {
      const nextHeight = this.calculateNextHeight(terrainSettings, i, lastPosition.y);
      const nextPosition = this.calculateNextPosition(terrainSettings.segmentWidth, lastPosition, nextHeight);
      terrain.push(nextPosition);
      lastPosition = nextPosition;
    }

    return new Terrain(terrain, terrainSettings);
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
