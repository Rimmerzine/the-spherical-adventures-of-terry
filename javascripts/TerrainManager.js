import Position2D from "./Position2D.js";

("use strict");

class Terrain {
  constructor(terrainSettings) {
    this.terrain = [];
    this.terrainSettings = terrainSettings;
  }

  generateTerrain() {
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
      const nextPosition = this.calculateNextPosition(
        lastPosition.x,
        nextHeight
      );
      this.terrain.push(nextPosition);
      lastPosition = nextPosition;
    }

    console.debug(this.terrain);
  }

  // Add the rest of the floor segments which adjust on height
  calculateNextHeight(index, lastHeight) {
    const potentialMax =
      this.terrainSettings.startMaxHeight -
      (this.terrainSettings.differenceMaxHeight /
        this.terrainSettings.curveCount) *
        index;

    const potentialMin =
      this.terrainSettings.startMinHeight +
      (this.terrainSettings.differenceMinHeight /
        this.terrainSettings.curveCount) *
        index;

    const targetHeight =
      Math.random() * (potentialMin - potentialMax + 1) + potentialMax;

    const adjustment = targetHeight - lastHeight;

    const allowedAdjustment =
      this.terrainSettings.minHeightAdjustment +
      (this.terrainSettings.maxHeightAdjustment /
        this.terrainSettings.curveCount) *
        index;

    const limitedAdjustment = Math.max(
      Math.min(adjustment, allowedAdjustment),
      -allowedAdjustment
    );

    return lastHeight + limitedAdjustment;
  }
  calculateNextPosition(lastX, newHeight) {
    return new Position2D(lastX + this.terrainSettings.segmentWidth, newHeight);
  }
}

export default Terrain;
