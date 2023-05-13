const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const fps = 60

canvas.width = 1024
canvas.height = 576

keys = {
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    }
}

class Ball {
    constructor(position, radius) {
        this.radius = radius
        this.position = position
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
        context.strokeStyle = "black"
        context.stroke()
        context.fillStyle = "red"
        context.fill()
    }

    update() {
      const nextPosition = {
        x: this.position.x + this.velocity.x,
        y: this.position.y + this.velocity.y
      };
    
      let collided = false;
      let reflectionVector = { x: 0, y: 0 }; // Accumulator for reflection direction
    
      // Check collision with each wall
      walls.forEach((wall) => {
        const closestPosition = wall.calculateClosestPosition(nextPosition);
        const distance = calculateDistance(nextPosition, closestPosition);
        if (distance <= this.radius) {
          collided = true;
          const wallNormal = wall.normalizedWallNormal;
          reflectionVector.x += wallNormal.x;
          reflectionVector.y += wallNormal.y;
        }
      });
    
      if (collided) {
        // Apply reflection
        const reflectionMagnitude = Math.sqrt(reflectionVector.x ** 2 + reflectionVector.y ** 2);
        if (reflectionMagnitude > 0) {
          reflectionVector.x /= reflectionMagnitude;
          reflectionVector.y /= reflectionMagnitude;
        }
        const dotProduct = dotProduct2D(this.velocity, reflectionVector);
        const reflection = {
          x: reflectionVector.x * dotProduct * 2,
          y: reflectionVector.y * dotProduct * 2
        };
        this.velocity.x -= reflection.x;
        this.velocity.y -= reflection.y;
      } else {
        this.position = nextPosition;
      }
    }
    
    pushLeft() {
        this.velocity.x -= 0.1
    }

    pushRight() {
        this.velocity.x += 0.1
    }

    pushUp() {
        this.velocity.y -= 0.1
    }

    pushDown() {
        this.velocity.y += 0.1
    }
}

class Wall {
    constructor(lineStart, lineEnd) {
        this.lineStart = lineStart
        this.lineEnd = lineEnd
        this.direction = {
            x: lineEnd.x - lineStart.x,
            y: lineEnd.y - lineStart.y
        }
        this.directionLengthSquared = this.direction.x * this.direction.x + this.direction.y * this.direction.y
        this.normal = {
            x: -this.direction.y,
            y: this.direction.x
        }
        this.normalizedWallNormal = normalizeVector(this.normal)
    }

    draw() {
        context.beginPath()
        context.moveTo(this.lineStart.x, this.lineStart.y)
        context.lineTo(this.lineEnd.x, this.lineEnd.y)
        context.strokeStyle = "black"
        context.stroke()
    }

    calculateClosestPosition(point) {
      const pointVectorX = point.x - this.lineStart.x;
      const pointVectorY = point.y - this.lineStart.y;
    
      const dotProduct = pointVectorX * this.direction.x + pointVectorY * this.direction.y;
      
      let projectionFactor;
      if (dotProduct <= 0) {
        projectionFactor = 0;
      } else if (dotProduct >= this.directionLengthSquared) {
        projectionFactor = 1;
      } else {
        projectionFactor = dotProduct / this.directionLengthSquared;
      }
    
      const closestPosition = {
        x: this.lineStart.x + this.direction.x * projectionFactor,
        y: this.lineStart.y + this.direction.y * projectionFactor
      };
    
      return closestPosition;
    }
    
    
}

const ball = new Ball(
    {x: 100,y: 450},
    50
)

const wallOne = new Wall(
    {x: 0, y: 500},
    {x: 1000, y: 500}
)

const wallTwo = new Wall(
    {x: 0, y: 20},
    {x: 1000, y: 20}
)

const wallThree = new Wall(
    {x: 20, y: 0},
    {x: 20, y: 550}
)

const wallFour = new Wall(
    {x: 950, y: 0},
    {x: 950, y: 550}
)

const wallFive = new Wall(
    {x: 200, y: 200},
    {x: 600, y: 400}
)

const walls = [
    wallOne,
    wallTwo,
    wallThree,
    wallFour,
    wallFive
]

function normalizeVector(vector) {
    const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    if (magnitude > 0) {
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        };
    } else {
      return vector;
    }
}


function dotProduct2D(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
}

function checkCollisions() {

    walls.forEach((wall) => {
        const distance = calculateDistance(ball.position, wall.calculateClosestPosition(ball.position))
        if(distance <= ball.radius) {
            ballAndWallCollision(ball, wall)
        }
    })

}

function ballAndWallCollision(ball, wall) {
    const dotProduct = dotProduct2D(ball.velocity, wall.normalizedWallNormal)
    ball.velocity = {
        x: ball.velocity.x - 2 * dotProduct * wall.normalizedWallNormal.x,
        y: ball.velocity.y - 2 * dotProduct * wall.normalizedWallNormal.y
    }
}

function calculateDistance(pointOne, pointTwo) {
    const dx = pointTwo.x - pointOne.x;
    const dy = pointTwo.y - pointOne.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
}

function animate() {

    setTimeout(() => {window.requestAnimationFrame(animate)}, 1000 / fps);

    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)

    if(keys.a.pressed) ball.pushLeft()
    if(keys.d.pressed) ball.pushRight()
    if(keys.s.pressed) ball.pushDown()
    if(keys.w.pressed) ball.pushUp()

    walls.forEach((wall) => {
        wall.draw()
    })

    ball.draw()
    ball.update()

    checkCollisions()
}

animate()


window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break;
        case 'w':
            keys.w.pressed = true
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break;
        case 'w':
            keys.w.pressed = false
            break;
    }
})