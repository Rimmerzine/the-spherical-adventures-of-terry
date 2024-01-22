import {Position2D} from './Position2D.js';
import TerrainSettings from './TerrainSettings.js';

class TerrainManager {
  terrain: Array<Position2D>;
  terrainSettings: TerrainSettings;

  constructor(terrainSettings: TerrainSettings) {
    this.terrain = [];
    this.terrainSettings = terrainSettings;
  }
  generateTerrain(): void {
    this.terrain = [];

    for (let i = 0; i < this.terrainSettings.flatCount; i++) {
      const position = new Position2D(
        this.terrainSettings.segmentWidth * i,
        this.terrainSettings.startingHeight
      );
      this.terrain.push(position);
    }
    let lastPosition =
      this.terrain.slice(-1)[0] ||
      new Position2D(0, this.terrainSettings.startingHeight);
    for (let i = 0; i < this.terrainSettings.curveCount; i++) {
      const nextHeight = this.calculateNextHeight(i, lastPosition.y);
      const nextPosition = this.calculateNextPosition(lastPosition, nextHeight);
      this.terrain.push(nextPosition);
      lastPosition = nextPosition;
    }
    console.log(this.terrain);
  }
  calculateNextHeight(index: number, lastHeight: number): number {
    const maxDiff = this.terrainSettings.differenceMaxHeight;
    const minDiff = this.terrainSettings.differenceMinHeight;
    const maxAdj = this.terrainSettings.maxHeightAdjustment;
    const minAdj = this.terrainSettings.minHeightAdjustment;
    const startMax = this.terrainSettings.startingMaxHeight;
    const startMin = this.terrainSettings.startingMinHeight;
    const curveCount = this.terrainSettings.curveCount;
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

  calculateNextPosition(lastPosition: Position2D, newHeight: number) {
    lastPosition =
      lastPosition || new Position2D(0, this.terrainSettings.startingHeight);
    return new Position2D(
      lastPosition.x + this.terrainSettings.segmentWidth,
      newHeight
    );
  }
}

export default TerrainManager;
