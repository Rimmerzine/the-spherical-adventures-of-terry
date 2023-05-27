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

  drawCurvedWalls(walls, ballPositionX) {
    this.context.beginPath();
    this.context.moveTo(
      walls[0].lineStart.x - ballPositionX + 400,
      walls[0].lineStart.y
    );

    for (let i = 0; i < walls.length - 1; i++) {
      const cpx = walls[i].lineStart.x - ballPositionX + 400;
      const cpy = walls[i].lineStart.y;
      const x =
        (walls[i].lineStart.x + walls[i + 1].lineStart.x) / 2 -
        ballPositionX +
        400;
      const y = (walls[i].lineStart.y + walls[i + 1].lineStart.y) / 2;

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
