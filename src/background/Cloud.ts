import { BackgroundObject } from "../utils/BackgroundObject.js";
import { Position2D } from "../utils/Position2D.js";

class Cloud implements BackgroundObject {
  particles: Array<CloudParticle>
  position: Position2D;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  static collectionCount: number = 100;
  static collection: Array<HTMLCanvasElement> = [];

  constructor(
    position: Position2D
  ) {
    this.position = position;

    if(Cloud.collection.length < Cloud.collectionCount) {
      this.canvas = document.createElement('canvas');
      this.width = 700;
      this.height = 500;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context = this.canvas.getContext('2d');
      this.context.fillStyle = "#ffffff88";
  
      const cloudParticleRadius: number = 100;
  
      for (let j = 0; j <= 15; j++) {
        const cloudParticle = new CloudParticle(
          new Position2D(
            Math.random() * 500 - 250,
            Math.random() * 300 - 150
          ),
          cloudParticleRadius
        );
        this.addParticle(cloudParticle);
      }

      Cloud.collection.push(this.canvas);
    } else {
      this.canvas = Cloud.collection[Math.floor(Math.random() * Cloud.collectionCount)];
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    }
    
  }

  draw(context: CanvasRenderingContext2D, cameraOffsetX: number, cameraOffsetY: number): void {
    context.drawImage(this.canvas, this.position.x - cameraOffsetX - this.canvas.width / 2, this.position.y - this.canvas.height / 2 - cameraOffsetY / 2);
  }

  addParticle(particle: CloudParticle) {
    this.context.beginPath();
    this.context.arc(particle.relativePosition.x + this.canvas.width / 2, particle.relativePosition.y + this.canvas.height / 2, particle.radius, 0, 2 * Math.PI);
    this.context.fill();
  }
}

class CloudParticle {
    relativePosition: Position2D;
    radius: number;
  
    constructor(
      relativePosition: Position2D,
      radius: number
    ) {
      this.relativePosition = relativePosition;
      this.radius = radius;
    }
}

export {Cloud, CloudParticle};
