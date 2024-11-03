class TerrainSettings {

  segmentWidth: number;
  flatCount: number;
  curveCount: number;
  startingMinHeight: number;
  startingMaxHeight: number;
  endMinHeight: number;
  endMaxHeight: number;
  minHeightAdjustment: number;
  maxHeightAdjustment: number;
  surfaceGripCoefficient: number;
  surfaceElasticity: number;
  surfaceColour: string;
  subsurfaceColour: string;
  differenceMinHeight: number;
  differenceMaxHeight: number;
  hasHoles: boolean;

  constructor(
    segmentWidth: number, // width of each terrain segment
    flatCount: number, // number of flat segments
    curveCount: number, // number of curved segments
    startMinHeight: number, // minimum height at the start
    startMaxHeight: number, // maximum height at the start
    endMinHeight: number, // minimum height at the end
    endMaxHeight: number, // maximum height at the end
    minHeightAdjustment: number, // adjustment to the minimum height
    maxHeightAdjustment: number, // adjustment to the maximum height
    surfaceGripCoefficient: number, // conversion between rotation and linear motion
    surfaceElasticity: number, // how bouncy the terrain is
    surfaceColour: string, // color of the terrain surface
    subsurfaceColour: string, // color of the terrain subsurface
    hasHoles: boolean = false
  ) {
    // Assign all the properties to the class instance
    this.segmentWidth = segmentWidth;
    this.flatCount = flatCount;
    this.curveCount = curveCount;
    this.startingMinHeight = startMinHeight;
    this.startingMaxHeight = startMaxHeight;
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

    this.hasHoles = hasHoles;
  }
}

export {TerrainSettings};
