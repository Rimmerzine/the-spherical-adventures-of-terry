import {Vector} from "../utils/Vector.js";
import {TerrainSettings} from "./TerrainSettings.js";

class Terrain {
    segments: Array<Segment>;
    settings: TerrainSettings;

    constructor(settings: TerrainSettings) {
        this.segments = [];
        this.settings = settings;
    }

    addSegment(position: Vector) {
      const previousSegment: Segment = this.segments.slice(-1)[0];
      const nextMidPoint: Vector = this.middleOf(position, position.add(new Vector(this.settings.segmentWidth, 0)));
      let previousMidPoint: Vector;

      if(previousSegment) {
        previousMidPoint = this.middleOf(position, previousSegment.position);
        previousSegment.nextMidPoint = previousMidPoint;
      } else {
        previousMidPoint = this.middleOf(position, position.add(new Vector(-this.settings.segmentWidth, 0)));
      }

      this.segments.push(new Segment(position, previousMidPoint, nextMidPoint));
    }

    addManualSegment(segment: Segment) {
      this.segments.push(segment);
    }

    private middleOf(position: Vector, position2: Vector) {
      return new Vector(
        (position.x + position2.x) / 2,
        (position.y + position2.y) / 2
      );
    }

    addHole(position: number, size: number = 1): void {
      const holes: Array<Segment> = [];
  
      for(let i = position; i <= position + size; i++) {
        const newPosition: Vector = new Vector(this.segments[i].position.x, this.segments[i].position.y + 2000);
        
        if(i === position) {
          const previousMidPoint: Vector = this.middleOf(this.segments[i].position, newPosition);
          const nextMidPoint: Vector = null;
          
          holes.push(new Segment(newPosition, previousMidPoint, nextMidPoint));

          this.segments[i].nextMidPoint = previousMidPoint;
        } else if (i === position + size) {
          const previousMidPoint: Vector = this.middleOf(holes.slice(-1)[0].position, newPosition);
          const nextMidPoint: Vector = this.middleOf(this.segments[i].position, newPosition);

          holes.slice(-1)[0].nextMidPoint = previousMidPoint;
          holes.push(new Segment(newPosition, previousMidPoint, nextMidPoint));

          this.segments[i].previousMidPoint = nextMidPoint;
        } else {
          const previousMidPoint: Vector = this.middleOf(holes.slice(-1)[0].position, newPosition);
          const nextMidPoint: Vector = null;

          holes.slice(-1)[0].nextMidPoint = previousMidPoint;
          holes.push(new Segment(newPosition, previousMidPoint, nextMidPoint));
        }
      }
      
      this.segments.splice(position + 1, size - 1, ...holes);
    }
}

export {Terrain};

class Segment {
  position: Vector;
  previousMidPoint: Vector;
  nextMidPoint: Vector;

  constructor(position: Vector, previousMidPoint: Vector, nextMidPoint: Vector) {
    this.position = position;
    this.previousMidPoint = previousMidPoint;
    this.nextMidPoint = nextMidPoint;
  }

  estimateLength(): number {
    return this.position.subtract(this.previousMidPoint).magnitude() + this.nextMidPoint.subtract(this.position).magnitude();
  }

  closestPointTo(point: Vector): Vector {
    const numberOfPoints: number = Math.ceil(this.estimateLength()) * 2;

    let closestPointAndDistance: { point: Vector, distance: number };

    for(let i = 0; i <= numberOfPoints; i++) {
      const t = i / numberOfPoints;
      const s = 1 - t;
      const position: Vector = new Vector(
        s * s * this.previousMidPoint.x + 2 * s * t * this.position.x + t * t * this.nextMidPoint.x,
        s * s * this.previousMidPoint.y + 2 * s * t * this.position.y + t * t * this.nextMidPoint.y
      )
      if(!closestPointAndDistance || closestPointAndDistance.distance > position.subtract(point).magnitude()) {
        closestPointAndDistance = { point: position, distance: position.subtract(point).magnitude() };
      }
    }

    return closestPointAndDistance.point;
  }
}

export {Segment}
