class BallStats {
  stats: Map<string, BallStat>;
  constructor() {
    this.stats = new Map();
  }

  add(name: string, stat: BallStat): BallStats {
    this.stats.set(name, stat);
    return this;
  }

  getStat(name: string): BallStat {
    return this.stats.get(name);
  }
}

class BallStat {
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

export {BallStats, BallStat};
