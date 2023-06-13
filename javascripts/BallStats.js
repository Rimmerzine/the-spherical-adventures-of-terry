"use strict";

class BallStats {
  constructor() {
    this.stats = new Map();
  }

  add(name, stat) {
    this.stats.set(name, stat);
    return this;
  }

  getStat(name) {
    return this.stats.get(name);
  }
}

class BallStat {
  constructor(startingValue, upgradeIncrement, upgradeCosts) {
    this.currentValue = startingValue;
    this.upgradeIncrement = upgradeIncrement;
    this.upgradeCosts = upgradeCosts;
    this.numberOfUpgrades = 0;
  }

  nextUpgradeCost() {
    return this.upgradeCosts[this.numberOfUpgrades] || Infinity;
  }

  upgrade() {
    if (this.numberOfUpgrades < this.upgradeCosts.length) {
      this.numberOfUpgrades++;
      this.currentValue = this.currentValue + this.upgradeIncrement;
    }
  }
}

export { BallStats, BallStat };
