import CollisionDetection from "../CollisionDetection.js";
import Ball from "../Ball.js";
import BallAttributes from "../BallAttributes.js";
import { BallStats, BallStat } from "../BallStats.js";
import Vector2D from "../Vector2D.js";
import Position2D from "../Position2D.js";

const collisionDetection = new CollisionDetection();
const deltaTime = 1;
const position = new Position2D(0, 0);
const precision = 10;

function testBall(velocity, rotation) {
  const ballAttributes = new BallAttributes(position, 10, "blue", new Vector2D(0, 0));
  ballAttributes.velocity = velocity;
  ballAttributes.rotationsPerSecond = rotation;
  const ballStats = new BallStats().add("grip", new BallStat(0, 1, [])).add("jumps", new BallStat(0, 1, []));
  return new Ball(ballAttributes, ballStats);
}
describe("Given the ball reflects off a point below", () => {
  const reflectionVector = new Vector2D(0, -1).normalize();
  describe("And the ball has no movement or rotation", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have not moved at all", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving down, but with no rotation", () => {
    const velocity = new Vector2D(0, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected upwards", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving right, but with no rotation", () => {
    const velocity = new Vector2D(1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = ball.attributes.velocity.x / 2;
    const expectedVelocity = new Vector2D(expectedXMovement, 0);
    const expectedRotation = expectedXMovement / (2 * Math.PI * ball.attributes.radius);

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving to the right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });

  describe("And the ball is moving left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = ball.attributes.velocity.x / 2;
    const expectedVelocity = new Vector2D(expectedXMovement, 0);
    const expectedRotation = expectedXMovement / (2 * Math.PI * ball.attributes.radius);

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving to the left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });

  describe("And the ball is moving bottom right, but with no rotation", () => {
    const velocity = new Vector2D(1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = ball.attributes.velocity.x / 2;
    const expectedVelocity = new Vector2D(expectedXMovement, velocity.y * -1);
    const expectedRotation = expectedXMovement / (2 * Math.PI * ball.attributes.radius);

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected top right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });

  describe("And the ball is moving bottom left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = ball.attributes.velocity.x / 2;
    const expectedVelocity = new Vector2D(expectedXMovement, velocity.y * -1);
    const expectedRotation = expectedXMovement / (2 * Math.PI * ball.attributes.radius);

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected top left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });

  describe("And the ball has no movement, but is rotating clockwise", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 1;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = Math.PI * ball.attributes.radius * rotation;
    const expectedVelocity = new Vector2D(expectedXMovement, 0);
    const expectedRotation = rotation / 2;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to begin moving to the right, slowing it's rotation", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });

  describe("And the ball has no movement, but is rotating counter-clockwise", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = -1;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = Math.PI * ball.attributes.radius * rotation;
    const expectedVelocity = new Vector2D(expectedXMovement, 0);
    const expectedRotation = rotation / 2;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to begin moving to the left, slowing it's rotation", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });

  describe("And the ball is moving right, rotating clockwise with a rotation higher than it's current linear speed", () => {
    const velocity = new Vector2D(1, 0);
    const rotation = 1;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = (2 * Math.PI * ball.attributes.radius * rotation + velocity.x) / 2;
    const expectedVelocity = new Vector2D(expectedXMovement, 0);
    const expectedRotation = expectedXMovement / (2 * Math.PI * ball.attributes.radius);

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to begin moving to the right faster, slowing it's rotation", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });

  describe("And the ball is moving right, rotating clockwise with a rotation matching it's current linear speed", () => {
    const velocity = new Vector2D(2 * Math.PI * 10, 0);
    const rotation = 1;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = (2 * Math.PI * ball.attributes.radius * rotation + velocity.x) / 2;
    const expectedVelocity = new Vector2D(expectedXMovement, 0);
    const expectedRotation = expectedXMovement / (2 * Math.PI * ball.attributes.radius);

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to begin moving to the right, slowing it's rotation", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });

  describe("And the ball is moving right, rotating clockwise with a rotation slower than it's current linear speed", () => {
    const velocity = new Vector2D(4 * Math.PI * 10, 0);
    const rotation = 1;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    const expectedXMovement = (2 * Math.PI * ball.attributes.radius * rotation + velocity.x) / 2;
    const expectedVelocity = new Vector2D(expectedXMovement, 0);
    const expectedRotation = expectedXMovement / (2 * Math.PI * ball.attributes.radius);

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to begin moving to the right, slowing it's rotation", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(expectedVelocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(expectedVelocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(expectedRotation, precision);
    });
  });
});

describe("Given the ball reflects off a point above", () => {
  const reflectionVector = new Vector2D(0, 1).normalize();
  describe("And the ball has no movement or rotation", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have not moved at all", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving up, but with no rotation", () => {
    const velocity = new Vector2D(0, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving right, but with no rotation", () => {
    const velocity = new Vector2D(1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving to the right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving to the left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is top right, but with no rotation", () => {
    const velocity = new Vector2D(1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to reflect bottom right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is top left, but with no rotation", () => {
    const velocity = new Vector2D(-1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected bottom left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });
});

describe("Given the ball reflects off a point right", () => {
  const reflectionVector = new Vector2D(-1, 0).normalize();
  describe("And the ball has no movement or rotation", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have not moved at all", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toStrictEqual(rotation);
    });
  });

  describe("And the ball is moving right, but with no rotation", () => {
    const velocity = new Vector2D(1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving down, but with no rotation", () => {
    const velocity = new Vector2D(0, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball continue moving down", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving up, but with no rotation", () => {
    const velocity = new Vector2D(0, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball continue moving up", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving top right, but with no rotation", () => {
    const velocity = new Vector2D(1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected top left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving bottom right, but with no rotation", () => {
    const velocity = new Vector2D(1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected bottom left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });
});

describe("Given the ball reflects off a point left", () => {
  const reflectionVector = new Vector2D(1, 0).normalize();
  describe("And the ball has no movement or rotation", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have not moved at all", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving up, but with no rotation", () => {
    const velocity = new Vector2D(0, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving up", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving down, but with no rotation", () => {
    const velocity = new Vector2D(0, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving down", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving top left, but with no rotation", () => {
    const velocity = new Vector2D(-1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving bottom left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });
});

describe("Given the ball reflects off a point bottom right", () => {
  const reflectionVector = new Vector2D(-1, -1).normalize();
  describe("And the ball has no movement or rotation", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have not moved at all", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving bottom right, but with no rotation", () => {
    const velocity = new Vector2D(1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving bottom left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving bottom left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving top right, but with no rotation", () => {
    const velocity = new Vector2D(1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving top right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving right, but with no rotation", () => {
    const velocity = new Vector2D(1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected up", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving down, but with no rotation", () => {
    const velocity = new Vector2D(0, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });
});

describe("Given the ball reflects off a point bottom left of it", () => {
  const reflectionVector = new Vector2D(1, -1).normalize();
  describe("And the ball has no movement or rotation", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have not moved at all", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving bottom left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving top left, but with no rotation", () => {
    const velocity = new Vector2D(-1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving top left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving bottom right, but with no rotation", () => {
    const velocity = new Vector2D(1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving bottom right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to reflect up", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving down, but with no rotation", () => {
    const velocity = new Vector2D(0, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to reflect right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });
});

describe("Given the ball reflects off a point top right", () => {
  const reflectionVector = new Vector2D(-1, 1).normalize();
  describe("And the ball has no movement or rotation", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have not moved at all", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving top right, but with no rotation", () => {
    const velocity = new Vector2D(1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving bottom right, but with no rotation", () => {
    const velocity = new Vector2D(1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving bottom right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving top left, but with no rotation", () => {
    const velocity = new Vector2D(-1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving top left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving right, but with no rotation", () => {
    const velocity = new Vector2D(1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving up, but with no rotation", () => {
    const velocity = new Vector2D(0, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });
});

describe("Given the ball reflects off a point top left", () => {
  const reflectionVector = new Vector2D(1, 1).normalize();
  describe("And the ball has no movement or rotation", () => {
    const velocity = new Vector2D(0, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have not moved at all", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving top left, but with no rotation", () => {
    const velocity = new Vector2D(-1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to have been reflected back", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving top right, but with no rotation", () => {
    const velocity = new Vector2D(1, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving top right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving bottom left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to continue moving to the bottom left", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving up, but with no rotation", () => {
    const velocity = new Vector2D(0, -1);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected right", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y * -1, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.x, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });

  describe("And the ball is moving left, but with no rotation", () => {
    const velocity = new Vector2D(-1, 0);
    const rotation = 0;
    const ball = testBall(velocity, rotation);
    const surfaceGripCooefficient = 1;

    collisionDetection.reflect(ball, surfaceGripCooefficient, reflectionVector, deltaTime);

    test("Then I expect the ball to be reflected down", () => {
      expect(ball.attributes.velocity.x).toBeCloseTo(velocity.y, precision);
      expect(ball.attributes.velocity.y).toBeCloseTo(velocity.x * -1, precision);
      expect(ball.attributes.rotationsPerSecond).toBeCloseTo(rotation, precision);
    });
  });
});
