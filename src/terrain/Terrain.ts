import { Position2D } from "../utils/Position2D.js";
import TerrainSettings from "./TerrainSettings.js";

class Terrain {
    segments: Array<Position2D>;
    settings: TerrainSettings;

    constructor(segments: Array<Position2D>, settings: TerrainSettings) {
        this.segments = segments;
        this.settings = settings;
    }
}

export {Terrain};
