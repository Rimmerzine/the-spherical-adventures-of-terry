"use strict";
// Define a class for terrain settings
class TerrainSettings {
  constructor(
    segmentWidth, // width of each terrain segment
    flatCount, // number of flat segments
    curveCount, // number of curved segments
    startingHeight, // starting height of the terrain
    startMinHeight, // minimum height at the start
    startMaxHeight, // maximum height at the start
    endMinHeight, // minimum height at the end
    endMaxHeight, // maximum height at the end
    minHeightAdjustment, // adjustment to the minimum height
    maxHeightAdjustment, // adjustment to the maximum height
    surfaceGripCoefficient, // conversion between rotation and linear motion
    surfaceElasticity, // how bouncy the terrain is
    surfaceColour, // color of the terrain surface
    subsurfaceColour // color of the terrain subsurface
  ) {
    // Assign all the properties to the class instance
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

    // Calculate the difference between start and end heights
    this.differenceMinHeight = Math.abs(startMinHeight - endMinHeight);
    this.differenceMaxHeight = Math.abs(startMaxHeight - endMaxHeight);

    // Assign the remaining properties
    this.surfaceGripCoefficient = surfaceGripCoefficient;
    this.surfaceElasticity = surfaceElasticity;
    this.surfaceColour = surfaceColour;
    this.subsurfaceColour = subsurfaceColour;
  }
}
// Export the class as the default export
export default TerrainSettings;
