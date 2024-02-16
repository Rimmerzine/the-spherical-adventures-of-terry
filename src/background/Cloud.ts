import { Position2D } from "../utils/Position2D.js";
import { BoundedBackgroundObject } from "./BoundedBackgroundObject.js";

class Cloud extends BoundedBackgroundObject {
  static collectionCount: number = 100;
  static collection: Array<HTMLCanvasElement> = [];

  constructor(position: Position2D) {
    super(position, 700, 500, Cloud.collection, Cloud.collectionCount);
  }

  drawCanvas(): void {
    this.context.fillStyle = "#ffffff88";

    for (let j = 0; j <= 15; j++) {
      const cloudParticle = new CloudParticle(
        new Position2D(
          Math.random() * 500 - 250,
          Math.random() * 300 - 150
        ),
        100,
        this.context
      );
      cloudParticle.draw();
    }
  }
  
}

class CloudParticle {
  position: Position2D;
  radius: number;
  context: CanvasRenderingContext2D;

  constructor(position: Position2D, radius: number, context: CanvasRenderingContext2D) {
    this.position = position;
    this.radius = radius;
    this.context = context;
  }

  draw(): void {
    this.context.beginPath();
    this.context.arc(this.position.x + this.context.canvas.width / 2, this.position.y + this.context.canvas.height / 2, this.radius, 0, 2 * Math.PI);
    this.context.fill();
  }
}

export {Cloud}
