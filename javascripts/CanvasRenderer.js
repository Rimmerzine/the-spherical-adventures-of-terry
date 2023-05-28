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

  drawClosestPositionOnFloor(floor, ball) {
    const position = findClosestPointAndNormal(floor, ball.position);

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

  drawCurvedWalls(floor, ballPositionX) {
    const canvasMapLeft = ballPositionX - ballSettings.displayXPosition;
    const canvasMapRight = canvasMapLeft + this.canvas.width;
    const visibleFloor = floor.filter(
      (floor) =>
        floor.x >= canvasMapLeft - mapSettings.floorSegmentWidth * 2 &&
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

function calculateDistance(pointOne, pointTwo) {
  const dx = pointTwo.x - pointOne.x;
  const dy = pointTwo.y - pointOne.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
}

function findClosestPointAndNormal(curvedLine, givenPoint) {
  let closestPoint = null;
  let closestDistance = Infinity;
  let closestNormal = null;

  for (let i = 0; i < curvedLine.length - 2; i++) {
    const start = curvedLine[i];
    const control = curvedLine[i + 1];
    const end = curvedLine[i + 2];

    for (let t = 0; t <= 1; t += 0.01) {
      const x =
        Math.pow(1 - t, 2) * start.x +
        2 * (1 - t) * t * control.x +
        Math.pow(t, 2) * end.x;
      const y =
        Math.pow(1 - t, 2) * start.y +
        2 * (1 - t) * t * control.y +
        Math.pow(t, 2) * end.y;

      const distance = Math.sqrt(
        Math.pow(x - givenPoint.x, 2) + Math.pow(y - givenPoint.y, 2)
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = { x, y };

        const tangentX =
          2 * (1 - t) * (control.x - start.x) + 2 * t * (end.x - control.x);
        const tangentY =
          2 * (1 - t) * (control.y - start.y) + 2 * t * (end.y - control.y);

        closestNormal = { x: -tangentY, y: tangentX };
      }
    }
  }

  return closestPoint;
}
