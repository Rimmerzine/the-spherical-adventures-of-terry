import { mapSettings, ballSettings } from "./Settings.js";

class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  drawBall(ball) {
    this.context.beginPath();
    this.context.arc(
      ballSettings.displayXPosition,
      ball.position.y,
      ball.radius,
      0,
      2 * Math.PI
    );
    this.context.strokeStyle = "black";
    this.context.stroke();
    this.context.fillStyle = ball.color;
    this.context.fill();
    this.context.closePath();
  }

  drawWalls(walls, ballPositionX) {
    const canvasMapLeft = ballPositionX - ballSettings.displayXPosition;
    const canvasMapRight = canvasMapLeft + this.canvas.width;
    const visibleWalls = walls.filter(
      (wall) =>
        wall.lineEnd.x >= canvasMapLeft && wall.lineStart.x <= canvasMapRight
    );
    visibleWalls.forEach((wall) => this.drawWall(wall, ballPositionX));
  }

  drawCurvedWalls(floor, ballPositionX) {
    this.context.beginPath();
    this.context.moveTo(
      floor[0].x - ballPositionX + ballSettings.displayXPosition,
      floor[0].y
    );

    for (let i = 1; i < floor.length - 1; i++) {
      const cpx = floor[i].x - ballPositionX + ballSettings.displayXPosition;
      const cpy = floor[i].y;
      const x =
        (floor[i].x + floor[i + 1].x) / 2 -
        ballPositionX +
        ballSettings.displayXPosition;
      const y = (floor[i].y + floor[i + 1].y) / 2;

      this.context.quadraticCurveTo(cpx, cpy, x, y);
    }

    this.context.stroke();
  }

  drawWall(wall, ballPositionX) {
    let region = new Path2D();
    region.moveTo(wall.drawStartX - ballPositionX, this.canvas.height);
    region.lineTo(wall.drawStartX - ballPositionX, wall.lineStart.y);
    region.lineTo(wall.drawEndX - ballPositionX, wall.lineEnd.y);
    region.lineTo(wall.drawEndX - ballPositionX, this.canvas.height);
    region.closePath();

    this.context.fillStyle = "brown";
    this.context.fill(region);

    this.context.lineWidth = 4;

    this.context.beginPath();
    this.context.moveTo(wall.drawStartX - ballPositionX, wall.lineStart.y);
    this.context.lineTo(wall.drawEndX - ballPositionX, wall.lineEnd.y);
    this.context.strokeStyle = "green";
    this.context.stroke();
  }

  clearCanvas() {
    this.context.fillStyle = `rgb(150, 210, 255)`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default CanvasRenderer;
