class TerrainSettings {
  constructor(
    segmentWidth,
    flatCount,
    curveCount,
    startingHeight,
    startMinHeight,
    startMaxHeight,
    endMinHeight,
    endMaxHeight,
    minHeightAdjustment,
    maxHeightAdjustment
  ) {
    this.segmentWidth = segmentWidth;
    this.flatCount = flatCount;
    this.curveCount = curveCount;
    this.startingHeight = startingHeight;
    this.startMinHeight = startMinHeight;
    this.startMaxHeight = startMaxHeight;
    this.endMinHeight = endMinHeight;
    this.endMaxHeight = endMaxHeight;
    this.minHeightAdjustment = minHeightAdjustment;
    this.maxHeightAdjustment = maxHeightAdjustment;

    this.differenceMinHeight = Math.abs(startMinHeight - endMinHeight);
    this.differenceMaxHeight = Math.abs(startMaxHeight - endMaxHeight);
  }
}

export default TerrainSettings;
