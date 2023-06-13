import { BallStats, BallStat } from "../BallStats.js";

describe("BallStats", () => {
  let ballStats;
  beforeEach(() => {
    ballStats = new BallStats();
  });
  test("add should add a new stat to the stats map", () => {
    ballStats.add("stat1", new BallStat(0, 1, [1, 2, 3]));
    expect(ballStats.getStat("stat1")).toBeDefined();
  });
  test("getStat should return the correct stat from the stats map", () => {
    const stat = new BallStat(0, 1, [1, 2, 3]);
    ballStats.add("stat1", stat);
    expect(ballStats.getStat("stat1")).toBe(stat);
  });
});

describe("BallStat", () => {
  let ballStat;
  beforeEach(() => {
    ballStat = new BallStat(0, 1, [1, 2, 3]);
  });
  test("nextUpgradeCost should return the correct upgrade cost", () => {
    expect(ballStat.nextUpgradeCost()).toBe(1);
    ballStat.upgrade();
    expect(ballStat.nextUpgradeCost()).toBe(2);
    ballStat.upgrade();
    expect(ballStat.nextUpgradeCost()).toBe(3);
    ballStat.upgrade();
    expect(ballStat.nextUpgradeCost()).toBe(Infinity);
  });
  test("upgrade should upgrade the stat value", () => {
    expect(ballStat.currentValue).toBe(0);
    ballStat.upgrade();
    expect(ballStat.currentValue).toBe(1);
    ballStat.upgrade();
    expect(ballStat.currentValue).toBe(2);
  });
  test("upgrade should not upgrade the stat value if there are no more upgrade costs", () => {
    ballStat.upgrade();
    ballStat.upgrade();
    ballStat.upgrade();
    expect(ballStat.currentValue).toBe(3);
    ballStat.upgrade();
    expect(ballStat.currentValue).toBe(3);
  });
});
