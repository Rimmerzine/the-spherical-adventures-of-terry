import Position2D from "../Position2D.js";

describe("Position2D", () => {
  describe("constructor", () => {
    it("should create a new Position2D instance with the given x and y coordinates", () => {
      const position = new Position2D(1, 2);
      expect(position.x).toBe(1);
      expect(position.y).toBe(2);
    });
  });

  describe("add", () => {
    it("should return a new Position2D instance with the updated x and y coordinates", () => {
      const position1 = new Position2D(1, 2);
      const position2 = new Position2D(3, 4);
      const newPosition = position1.add(position2);
      expect(newPosition.x).toBe(4);
      expect(newPosition.y).toBe(6);
    });
  });
});
