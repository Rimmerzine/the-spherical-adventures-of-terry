import { Position2D } from "../utils/Position2D.js";
import { Vector2D } from "../utils/Vector2D.js";
import TerrainSettings from "./TerrainSettings.js";

class Terrain {
    segments: Array<Segment>;
    settings: TerrainSettings;

    constructor(settings: TerrainSettings) {
        this.segments = [];
        this.settings = settings;
    }

    addSegment(position: Position2D) {
      const previousSegment: Segment = this.segments.slice(-1)[0];
      const nextMidPoint: Position2D = this.middleOf(position, position.add(new Vector2D(this.settings.segmentWidth, 0)));
      let previousMidPoint: Position2D;

      if(previousSegment) {
        previousMidPoint = this.middleOf(position, previousSegment.position);
        previousSegment.nextMidPoint = previousMidPoint;
      } else {
        previousMidPoint = this.middleOf(position, position.add(new Vector2D(-this.settings.segmentWidth, 0)));
      }

      this.segments.push(new Segment(position, previousMidPoint, nextMidPoint));
    }

    private middleOf(position: Position2D, position2: Position2D) {
      return new Position2D(
        (position.x + position2.x) / 2,
        (position.y + position2.y) / 2
      );
    }

    addHole(position: number, size: number = 1): void {
      const holes: Array<Segment> = [];
  
      for(let i = position; i <= position + size; i++) {
        const newPosition: Position2D = new Position2D(this.segments[i].position.x, this.segments[i].position.y + 2000);
        
        if(i === position) {
          const previousMidPoint: Position2D = this.middleOf(this.segments[i].position, newPosition);
          const nextMidPoint: Position2D = null;
          
          holes.push(new Segment(newPosition, previousMidPoint, nextMidPoint));

          this.segments[i].nextMidPoint = previousMidPoint;
        } else if (i === position + size) {
          const previousMidPoint: Position2D = this.middleOf(holes.slice(-1)[0].position, newPosition);
          const nextMidPoint: Position2D = this.middleOf(this.segments[i].position, newPosition);

          holes.slice(-1)[0].nextMidPoint = previousMidPoint;
          holes.push(new Segment(newPosition, previousMidPoint, nextMidPoint));

          this.segments[i].previousMidPoint = nextMidPoint;
        } else {
          const previousMidPoint: Position2D = this.middleOf(holes.slice(-1)[0].position, newPosition);
          const nextMidPoint: Position2D = null;

          holes.slice(-1)[0].nextMidPoint = previousMidPoint;
          holes.push(new Segment(newPosition, previousMidPoint, nextMidPoint));
        }
      }
      
      this.segments.splice(position + 1, size - 1, ...holes);
    }
}

export {Terrain};

class Segment {
  position: Position2D;
  previousMidPoint: Position2D;
  nextMidPoint: Position2D;

  constructor(position: Position2D, previousMidPoint: Position2D, nextMidPoint: Position2D) {
    this.position = position;
    this.previousMidPoint = previousMidPoint;
    this.nextMidPoint = nextMidPoint;
  }
}

export {Segment}
