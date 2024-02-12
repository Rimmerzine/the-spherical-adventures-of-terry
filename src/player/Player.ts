import Ball from "../ball/Ball.js";
import { Position2D } from "../utils/Position2D.js";

class Player {
    ball: Ball;
    levelPointsCollected: Map<string, Array<Position2D>>;

    constructor() {
        this.ball = new Ball();
        this.levelPointsCollected = new Map();
    }

    collectPoint(level: string, point: Position2D) {
        if(this.levelPointsCollected.has(level)) {
            this.levelPointsCollected.get(level).push(point);
        } else {
            this.levelPointsCollected.set(level, [point]);
        }
    }
}

export {Player}
