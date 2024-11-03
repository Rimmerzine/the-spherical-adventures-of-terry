import {Ball} from "../ball/Ball.js";
import {Vector} from "../utils/Vector.js";

class Player {
    ball: Ball;
    levelPointsCollected: Map<string, Array<Vector>>;

    constructor(startingX: number = 0) {
        this.ball = new Ball(startingX);
        this.levelPointsCollected = new Map();
    }

    collectPoint(level: string, point: Vector) {
        if(this.levelPointsCollected.has(level)) {
            this.levelPointsCollected.get(level).push(point);
        } else {
            this.levelPointsCollected.set(level, [point]);
        }
    }
}

export {Player}
