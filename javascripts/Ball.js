import Vector2D from "./Vector2D.js";
import { gravity, ballSettings, debugSettings } from "./Settings.js";

class Ball {
  constructor(attributes, stats) {
    this.attributes = attributes;
    this.stats = stats;
  }

  // Reflect the ball's velocity based on the given reflection vector
  reflect(reflectionVector) {
    const dotProduct = this.attributes.velocity.dotProduct(reflectionVector);
    const reflection = {
      x:
        reflectionVector.x *
        dotProduct *
        2 *
        (1 - this.stats.getStat("grip").currentValue),
      y: reflectionVector.y * dotProduct * 2 * 0.8,
    };
    if (debugSettings.drawReflectionVector) {
      debugSettings.reflectionVector = new Vector2D(reflection.x, reflection.y);
    }
    this.attributes.velocity.x -= reflection.x;
    this.attributes.velocity.y -= reflection.y;
    this.attributes.jumpCount = 0;
  }

  // Update the ball's velocity based on handled collisions
  update() {
    // add gravity to the balls current velocity
    this.attributes.velocity = this.attributes.velocity.add(gravity);

    const nextPosition = this.attributes.position.add(this.attributes.velocity); // where the ball will be after velocity is added to its position

    if (nextPosition.x < this.attributes.startingPosition.x) {
      nextPosition.x = this.attributes.startingPosition.x + 5;
      this.attributes.velocity.x = -this.attributes.velocity.x;
    }
  }

  move() {
    this.attributes.position = this.attributes.position.add(
      this.attributes.velocity
    );
  }

  // Push the ball to the left
  pushLeft() {
    if (this.attributes.movable) {
      if (
        this.attributes.velocity.x >
        -this.stats.getStat("max-speed").currentValue
      ) {
        this.attributes.velocity.x -=
          this.stats.getStat("acceleration").currentValue;
      }
    }
  }

  // Push the ball to the right
  pushRight() {
    if (this.attributes.movable) {
      if (
        this.attributes.velocity.x <
        this.stats.getStat("max-speed").currentValue
      ) {
        this.attributes.velocity.x +=
          this.stats.getStat("acceleration").currentValue;
      }
    }
  }

  jump() {
    if (this.attributes.jumpCount < this.stats.getStat("jumps").currentValue) {
      this.attributes.velocity = this.attributes.velocity.add(
        this.attributes.jumpVelocity
      );
      this.attributes.jumpCount++;
    }
  }
}

export default Ball;

// class Ball {
//   constructor(position, radius) {
//     this.radius = radius;
//     this.position = position;
//     this.velocity = new Vector2D(0, 0);
//     this.movable = false;
//     this.color = "yellow";
//     this.jumpCount = 0;
//   }

//   constructor(attributes, stats) {
//     this.attributes = attributes;
//     this.stats = stats;
//   }

//   // Reflect the ball's velocity based on the given reflection vector
//   reflect(reflectionVector) {
//     const dotProduct = this.velocity.dotProduct(reflectionVector);
//     const reflection = {
//       x: reflectionVector.x * dotProduct * 2 * ballSettings.gripFactor,
//       y: reflectionVector.y * dotProduct * 2 * 0.8,
//     };
//     if (debugSettings.drawReflectionVector) {
//       debugSettings.reflectionVector = new Vector2D(reflection.x, reflection.y);
//     }
//     this.velocity.x -= reflection.x;
//     this.velocity.y -= reflection.y;
//     this.jumpCount = 0;
//   }

//   // Update the ball's velocity based on handled collisions
//   update() {
//     this.velocity = this.velocity.add(gravity); // add gravity to the balls current velocity

//     const nextPosition = this.position.add(this.velocity); // where the ball will be after velocity is added to its position

//     if (nextPosition.x < ballSettings.displayXPosition) {
//       nextPosition.x = ballSettings.displayXPosition + 5;
//       this.velocity.x = -this.velocity.x;
//     }
//   }

//   move() {
//     this.position = this.position.add(this.velocity);
//   }

//   // Push the ball to the left
//   pushLeft() {
//     if (this.movable) {
//       if (this.velocity.x > -ballSettings.maxSpeed)
//         this.velocity.x -= ballSettings.acceleration;
//     }
//   }

//   // Push the ball to the right
//   pushRight() {
//     if (this.movable) {
//       if (this.velocity.x < ballSettings.maxSpeed)
//         this.velocity.x += ballSettings.acceleration;
//     }
//   }

//   jump() {
//     if (this.jumpCount < ballSettings.totalJumps) {
//       this.velocity = this.velocity.add(new Vector2D(0, -5));
//       this.jumpCount++;
//     }
//   }
// }

// export default Ball;
