class BallSkills {
  stats: Map<string, BallSkill>;

  constructor() {
    this.stats = new Map(
      [
        ["max-rps", new BallSkill(1, 0.25, [4, 7, 13, 22, 43])],
        ["acceleration", new BallSkill(1, 0.5, [4, 7, 13, 22, 43])],
        ["grip", new BallSkill(0.4, 0.1, [8, 15, 29])],
        ["shock-absorbers", new BallSkill(0, 0.1, [1, 5, 15, 37])],
        ["jumps", new BallSkill(0, 1, [10, 40])],
      ]
    );
  }

  getStat(name: string): BallSkill {
    return this.stats.get(name);
  }
}

class BallSkill {
  currentValue: number;
  upgradeIncrement: number;
  upgradeCosts: Array<number>;
  numberOfUpgrades = 0;

  constructor(
    startingValue: number,
    upgradeIncrement: number,
    upgradeCosts: Array<number>
  ) {
    this.currentValue = startingValue;
    this.upgradeIncrement = upgradeIncrement;
    this.upgradeCosts = upgradeCosts;
    this.numberOfUpgrades = 0;
  }

  nextUpgradeCost(): number {
    return this.upgradeCosts[this.numberOfUpgrades] || Infinity;
  }

  upgrade(): void {
    if (this.numberOfUpgrades < this.upgradeCosts.length) {
      this.numberOfUpgrades++;
      this.currentValue = this.currentValue + this.upgradeIncrement;
    }
  }
}

export {BallSkills, BallSkill};
