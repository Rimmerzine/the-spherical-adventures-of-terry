import { mapSettings, ballSettings, debugSettings } from "./Settings.js";

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

  drawCurvedWalls(floor, ballPositionX) {
    const canvasMapLeft = ballPositionX - ballSettings.displayXPosition;
    const canvasMapRight = canvasMapLeft + this.canvas.width;
    const visibleFloor = floor.filter(
      (floor) =>
        floor.x >= canvasMapLeft - mapSettings.floorSegmentWidth * 3 &&
        floor.x <= canvasMapRight + mapSettings.floorSegmentWidth * 3
    );

    this.context.beginPath();
    this.context.moveTo(
      visibleFloor[0].x - ballPositionX + ballSettings.displayXPosition,
      visibleFloor[0].y
    );

    for (let i = 1; i < visibleFloor.length - 1; i++) {
      const cpx =
        visibleFloor[i].x - ballPositionX + ballSettings.displayXPosition;
      const cpy = visibleFloor[i].y;
      const x =
        (visibleFloor[i].x + visibleFloor[i + 1].x) / 2 -
        ballPositionX +
        ballSettings.displayXPosition;
      const y = (visibleFloor[i].y + visibleFloor[i + 1].y) / 2;

      this.context.quadraticCurveTo(cpx, cpy, x, y);
    }

    this.context.stroke();
  }

  clearCanvas() {
    this.context.fillStyle = `rgb(150, 210, 255)`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawDebugInformation(ball) {
    this.drawClosestPositionOnFloor(ball);
    this.drawNormalisedDisplacementVector(ball);
    this.drawBallVelocity(ball);
    this.drawReflectionVector(ball);
  }

  drawClosestPositionOnFloor(ball) {
    if (debugSettings.closestPoint) {
      const position = debugSettings.closestPoint;

      this.context.beginPath();
      this.context.arc(
        position.x - ball.position.x + ballSettings.displayXPosition,
        position.y,
        10,
        0,
        2 * Math.PI
      );
      this.context.strokeStyle = "black";
      this.context.stroke();
      this.context.closePath();
    }
  }

  drawNormalisedDisplacementVector(ball) {
    if (
      debugSettings.closestPoint &&
      debugSettings.normalisedDisplacementVector
    ) {
      const startPosition = debugSettings.closestPoint;
      const vector = debugSettings.normalisedDisplacementVector.multiply(10);
      const endPosition = startPosition.add(vector);
      this.context.beginPath();
      this.context.moveTo(
        startPosition.x - ball.position.x + ballSettings.displayXPosition,
        startPosition.y
      );
      this.context.lineTo(
        endPosition.x - ball.position.x + ballSettings.displayXPosition,
        endPosition.y
      );
      this.context.stroke();
    }
  }

  drawBallVelocity(ball) {
    const startPosition = ball.position;
    const endPosition = ball.position.add(ball.velocity.multiply(5));

    this.context.beginPath();
    this.context.moveTo(
      startPosition.x - ball.position.x + ballSettings.displayXPosition,
      startPosition.y
    );
    this.context.lineTo(
      endPosition.x - ball.position.x + ballSettings.displayXPosition,
      endPosition.y
    );
    this.context.stroke();
  }

  drawReflectionVector(ball) {
    if (debugSettings.closestPoint && debugSettings.reflectionVector) {
      const startPosition = debugSettings.closestPoint;
      const vector = debugSettings.reflectionVector;
      const endPosition = debugSettings.closestPoint.add(vector.multiply(4));

      this.context.beginPath();
      this.context.moveTo(
        startPosition.x - ball.position.x + ballSettings.displayXPosition,
        startPosition.y
      );
      this.context.lineTo(
        endPosition.x - ball.position.x + ballSettings.displayXPosition,
        endPosition.y
      );
      this.context.stroke();
    }
  }
}

export default CanvasRenderer;
