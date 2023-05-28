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
    const position = findClosestPoint(
      floor,
      ball.position,
      this.canvas.width,
      this.context
    );

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
  if (pointOne == null || pointTwo == null) return Infinity;
  const dx = pointTwo.x - pointOne.x;
  const dy = pointTwo.y - pointOne.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
}

function findClosestPoint(floor, givenPoint, canvasWidth, context) {
  const canvasMapLeft = givenPoint.x - ballSettings.displayXPosition;
  const canvasMapRight = canvasMapLeft + canvasWidth;

  const visibleFloor = floor.filter(
    (floor) =>
      floor.x >= canvasMapLeft &&
      floor.x <= canvasMapRight - mapSettings.floorSegmentWidth * 2
  );

  let point = null;

  for (let i = 1; i < visibleFloor.length - 1; i++) {
    const sx = (visibleFloor[i - 1].x + visibleFloor[i].x) / 2;
    const sy = (visibleFloor[i - 1].y + visibleFloor[i].y) / 2;
    const cpx = visibleFloor[i].x;
    const cpy = visibleFloor[i].y;
    const x = (visibleFloor[i].x + visibleFloor[i + 1].x) / 2;
    const y = (visibleFloor[i].y + visibleFloor[i + 1].y) / 2;

    for (let j = 0.0; j <= 1.0; j += 0.01) {
      const newPoint = getQuadraticCurvePoint(sx, sy, cpx, cpy, x, y, j);
      context.beginPath();
      context.arc(
        newPoint.x - givenPoint.x + ballSettings.displayXPosition,
        newPoint.y,
        2,
        0,
        2 * Math.PI
      );
      context.strokeStyle = "yellow";
      context.stroke();
      context.closePath();
      if (
        calculateDistance(newPoint, givenPoint) <
        calculateDistance(point, givenPoint)
      ) {
        point = newPoint;
      }
    }
  }

  console.info(point);

  return point;
}

function _getQBezierValue(t, p1, p2, p3) {
  var iT = 1 - t;
  return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(
  startX,
  startY,
  cpX,
  cpY,
  endX,
  endY,
  position
) {
  return {
    x: _getQBezierValue(position, startX, cpX, endX),
    y: _getQBezierValue(position, startY, cpY, endY),
  };
}
