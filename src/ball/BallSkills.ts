class BallSkills {
  skills: Map<string, BallSkill>;

  constructor() {
    this.skills = new Map(
      [
        ["max-rps", new BallSkill(1, 0.2, [2, 4, 6, 7, 10, 12, 14, 16, 18])],
        ["acceleration", new BallSkill(0.5, 0.1, [2, 4, 6, 7, 10, 12, 14, 16, 18])],
        ["grip", new BallSkill(0.1, 0.1, [2, 4, 6, 7, 10, 12, 14, 16, 18])],
        ["shock-absorber", new BallSkill(0.1, 0.1, [2, 4, 6, 7, 10, 12, 14, 16, 18])],
        ["jumps", new BallSkill(0, 1, [10, 40])],
      ]
    );
  }

  getSkill(name: string): BallSkill {
    return this.skills.get(name);
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
