import { mapSettings, ballSettings } from "./Settings.js";

class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  drawBall(ball) {
    this.context.beginPath();
    this.context.arc(
      ballSettings.ballDisplayXPosition,
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
    const canvasMapLeft = ballPositionX - ballSettings.ballDisplayXPosition;
    const canvasMapRight = canvasMapLeft + this.canvas.width;
    const visibleWalls = walls.filter(
      (wall) =>
        wall.lineEnd.x >= canvasMapLeft && wall.lineStart.x <= canvasMapRight
    );
    visibleWalls.forEach((wall) => this.drawWall(wall, ballPositionX));
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

    this.context.lineWidth = 3;

    this.context.beginPath();
    this.context.moveTo(wall.drawStartX - ballPositionX, wall.lineStart.y);
    this.context.lineTo(wall.drawEndX - ballPositionX, wall.lineEnd.y);
    this.context.strokeStyle = "green";
    this.context.stroke();
  }

  draw(ballPosX) {
    let region = new Path2D();
    region.moveTo(this.drawStartX - ballPosX, this.canvas.height);
    region.lineTo(this.drawStartX - ballPosX, this.lineStart.y);
    region.lineTo(this.drawEndX - ballPosX, this.lineEnd.y);
    region.lineTo(this.drawEndX - ballPosX, this.canvas.height);
    region.closePath();

    this.context.fillStyle = "brown";
    this.context.fill(region);

    this.context.lineWidth = 3;

    this.context.beginPath();
    this.context.moveTo(
      this.lineStart.x - (ballPosX - ballSettings.ballDisplayXPosition),
      this.lineStart.y
    );
    this.context.lineTo(
      this.lineEnd.x - (ballPosX - ballSettings.ballDisplayXPosition),
      this.lineEnd.y
    );
    this.context.strokeStyle = "green";
    this.context.stroke();
  }

  clearCanvas() {
    this.context.fillStyle = `rgb(150, 210, 255)`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default CanvasRenderer;
