import { Position2D } from "../utils/Position2D";

class Player {
    levelPointsCollected: Map<string, Array<Position2D>>;

    constructor() {
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
