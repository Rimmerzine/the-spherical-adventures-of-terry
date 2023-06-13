import Vector2D from "../Vector2D";
import { addVectors } from "../Vector2D";

describe("Vector2D", () => {
  describe("add", () => {
    it("should add two vectors correctly", () => {
      const v1 = new Vector2D(1, 2);
      const v2 = new Vector2D(3, 4);
      const result = v1.add(v2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });
    it("should return a new vector object", () => {
      const v1 = new Vector2D(1, 2);
      const v2 = new Vector2D(3, 4);
      const result = v1.add(v2);
      expect(result).toBeInstanceOf(Vector2D);
      expect(result).not.toBe(v1);
      expect(result).not.toBe(v2);
    });
  });
  describe("subtract", () => {
    it("should subtract two vectors correctly", () => {
      const v1 = new Vector2D(1, 2);
      const v2 = new Vector2D(3, 4);
      const result = v1.subtract(v2);
      expect(result.x).toBe(-2);
      expect(result.y).toBe(-2);
    });
    it("should return a new vector object", () => {
      const v1 = new Vector2D(1, 2);
      const v2 = new Vector2D(3, 4);
      const result = v1.subtract(v2);
      expect(result).toBeInstanceOf(Vector2D);
      expect(result).not.toBe(v1);
      expect(result).not.toBe(v2);
    });
  });
  describe("multiply", () => {
    it("should multiply the vector by a scalar value correctly", () => {
      const v = new Vector2D(1, 2);
      const result = v.multiply(2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(4);
    });
    it("should return a new vector object", () => {
      const v = new Vector2D(1, 2);
      const result = v.multiply(2);
      expect(result).toBeInstanceOf(Vector2D);
      expect(result).not.toBe(v);
    });
  });
  describe("magnitude", () => {
    it("should calculate the magnitude (length) of the vector correctly", () => {
      const v = new Vector2D(3, 4);
      const result = v.magnitude();
      expect(result).toBe(5);
    });
  });
  describe("perpendicularDirection", () => {
    it("should calculate the perpendicular direction of the vector correctly", () => {
      const v = new Vector2D(1, 2);
      const result = v.perpendicularDirection();
      expect(result.x).toBe(2);
      expect(result.y).toBe(-1);
    });
  });
  describe("normalize", () => {
    it("should normalize the vector to have a magnitude of 1 correctly", () => {
      const v = new Vector2D(3, 4);
      const result = v.normalize();
      expect(result.x).toBeCloseTo(0.6);
      expect(result.y).toBeCloseTo(0.8);
    });
    it("should return a new vector object", () => {
      const v = new Vector2D(3, 4);
      const result = v.normalize();
      expect(result).toBeInstanceOf(Vector2D);
      expect(result).not.toBe(v);
    });
    it("should return a zero vector if the magnitude is zero", () => {
      const v = new Vector2D(0, 0);
      const result = v.normalize();
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });
  });
  describe("distance", () => {
    it("should calculate the distance between the vector and the origin (0, 0) correctly", () => {
      const v = new Vector2D(3, 4);
      const result = v.distance();
      expect(result).toBe(5);
    });
  });
  describe("dotProduct", () => {
    it("should calculate the dot product of two vectors correctly", () => {
      const v1 = new Vector2D(1, 2);
      const v2 = new Vector2D(3, 4);
      const result = v1.dotProduct(v2);
      expect(result).toBe(11);
    });
  });
});
describe("addVectors", () => {
  it("should add two vectors correctly", () => {
    const v1 = new Vector2D(1, 2);
    const v2 = new Vector2D(3, 4);
    const result = addVectors(v1, v2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });
  it("should return a new vector object", () => {
    const v1 = new Vector2D(1, 2);
    const v2 = new Vector2D(3, 4);
    const result = addVectors(v1, v2);
    expect(result).toBeInstanceOf(Vector2D);
    expect(result).not.toBe(v1);
    expect(result).not.toBe(v2);
  });
});
