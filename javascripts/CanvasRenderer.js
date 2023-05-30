import { mapSettings, ballSettings, debugSettings } from "./Settings.js";

class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  drawBall(ball) {
    const x = ballSettings.displayXPosition;
    const y = ballSettings.startingYPosition;
    const radius = ball.radius;
    const scale = 0.8 * radius;

    // Draw the gray background
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = "gray";
    this.context.fill();
    this.context.strokeStyle = "black";
    this.context.lineWidth = 3;
    this.context.stroke();

    // Draw the yellow ball
    this.context.beginPath();
    this.context.arc(x, y, scale, 0, 2 * Math.PI);
    this.context.fillStyle = ball.color;
    this.context.fill();
    this.context.stroke();

    // Calculate common values for the mouth and eye
    const mouthOffsetX = 0.7 * scale;
    const mouthRadius = scale / 2;
    const eyeOffsetX = 0.7 * scale;
    const eyeOffsetY = 0.2 * scale;
    const eyeRadius = scale / 6;
    const pupilOffsetX = 0.1 * scale;
    const pupilRadius = scale / 20;

    // Draw the mouth
    this.context.beginPath();
    this.context.arc(x + mouthOffsetX, y, mouthRadius, 1.3, Math.PI - 0.8);
    this.context.lineWidth = 2;
    this.context.stroke();

    // Draw the eye white
    this.context.beginPath();
    this.context.arc(x + eyeOffsetX, y - eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
    this.context.fillStyle = "white";
    this.context.fill();
    this.context.lineWidth = 2;
    this.context.stroke();

    // Draw the pupil
    this.context.beginPath();
    this.context.arc(
      x + eyeOffsetX + pupilOffsetX,
      y - eyeOffsetY,
      pupilRadius,
      0,
      2 * Math.PI
    );
    this.context.fillStyle = "black";
    this.context.fill();
  }

  drawCurvedWalls(floor, ballPosition) {
    const canvasMapLeft = ballPosition.x - ballSettings.displayXPosition;
    const canvasMapRight = canvasMapLeft + this.canvas.width;
    const visibleFloor = floor.filter(
      (floor) =>
        floor.x >= canvasMapLeft - mapSettings.floorSegmentWidth * 3 &&
        floor.x <= canvasMapRight + mapSettings.floorSegmentWidth * 3
    );
    this.context.beginPath();
    this.context.lineWidth = 5;
    this.context.strokeStyle = "green";
    this.context.fillStyle = "brown";
    this.context.moveTo(0, this.canvas.height);
    this.context.lineTo(
      visibleFloor[0].x - ballPosition.x + ballSettings.displayXPosition,
      visibleFloor[0].y - ballPosition.y + ballSettings.startingYPosition + 2
    );

    for (let i = 1; i < visibleFloor.length - 1; i++) {
      const cpx =
        visibleFloor[i].x - ballPosition.x + ballSettings.displayXPosition;
      const cpy =
        visibleFloor[i].y - ballPosition.y + ballSettings.startingYPosition + 2;
      const x =
        (visibleFloor[i].x + visibleFloor[i + 1].x) / 2 -
        ballPosition.x +
        ballSettings.displayXPosition;
      const y =
        (visibleFloor[i].y -
          ballPosition.y +
          ballSettings.startingYPosition +
          2 +
          visibleFloor[i + 1].y -
          ballPosition.y +
          ballSettings.startingYPosition +
          2) /
        2;

      this.context.quadraticCurveTo(cpx, cpy, x, y);
    }
    this.context.lineTo(this.canvas.width, this.canvas.height);
    this.context.stroke();
    this.context.fill();
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
    this.drawCollisionFloors(ball);
  }

  drawClosestPositionOnFloor(ball) {
    if (debugSettings.closestPoint) {
      const position = debugSettings.closestPoint;

      this.context.beginPath();
      this.context.arc(
        position.x - ball.position.x + ballSettings.displayXPosition,
        position.y - ball.position.y + ballSettings.startingYPosition,
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
        startPosition.y - ball.position.y + ballSettings.startingYPosition
      );
      this.context.lineTo(
        endPosition.x - ball.position.x + ballSettings.displayXPosition,
        endPosition.y - ball.position.y + ballSettings.startingYPosition
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
      startPosition.y - ball.position.y + ballSettings.startingYPosition
    );
    this.context.lineTo(
      endPosition.x - ball.position.x + ballSettings.displayXPosition,
      endPosition.y - ball.position.y + ballSettings.startingYPosition
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
        startPosition.y - ball.position.y + ballSettings.startingYPosition
      );
      this.context.lineTo(
        endPosition.x - ball.position.x + ballSettings.displayXPosition,
        endPosition.y - ball.position.y + ballSettings.startingYPosition
      );
      this.context.stroke();
    }
  }

  drawCollisionFloors(ball) {
    if (debugSettings.collisionFloors) {
      this.context.beginPath();
      this.context.lineWidth = 3;
      this.context.strokeStyle = "yellow";
      this.context.moveTo(
        debugSettings.collisionFloors[0].x -
          ball.position.x +
          ballSettings.displayXPosition,
        debugSettings.collisionFloors[0].y -
          ball.position.y +
          ballSettings.startingYPosition
      );

      for (let i = 1; i < debugSettings.collisionFloors.length - 1; i++) {
        const cpx =
          debugSettings.collisionFloors[i].x -
          ball.position.x +
          ballSettings.displayXPosition;
        const cpy =
          debugSettings.collisionFloors[i].y -
          ball.position.y +
          ballSettings.startingYPosition;
        const x =
          (debugSettings.collisionFloors[i].x +
            debugSettings.collisionFloors[i + 1].x) /
            2 -
          ball.position.x +
          ballSettings.displayXPosition;
        const y =
          (debugSettings.collisionFloors[i].y -
            ball.position.y +
            ballSettings.startingYPosition +
            debugSettings.collisionFloors[i + 1].y -
            ball.position.y +
            ballSettings.startingYPosition) /
          2;

        this.context.quadraticCurveTo(cpx, cpy, x, y);
      }

      this.context.stroke();
    }
  }
}

export default CanvasRenderer;
