import Ball from "../ball/Ball.js";

class PlayerStats {
  furthestDistanceReached: number = 0;
  totalDistanceTravelled: number = 0;
  totalResetDistance: number = 0;
  numberOfJumpsMade: number = 0;
  pointsEarned: number = 0;
  pointsSpent: number = 0;
  maxRotationsUpgradesBought: number = 0;
  accelerationUpgradesBought: number = 0;
  gripUpgradesBought: number = 0;
  shockAbsorberUpgradesBought: number = 0;
  jumpUpgradesBought: number = 0;
  fastestSpeedAchieved: number = 0;
  furthestJump: number = 0;
  longestTimeMidair: number = 0;
  numberOfLevelResets: number = 0;
  lastCollision: number = performance.now();
  lastBounceX: number = null;

  constructor() {}

  updateStat(statName: string, newValue: number): void {
    if(newValue % 1 === 0) {
        document.getElementById(`${statName}-stat`).innerText = newValue.toFixed(0).toString();
    } else {
        document.getElementById(`${statName}-stat`).innerText = newValue.toFixed(2).toString();
    }
  }

  updateCollided(ball: Ball): void {
    const now = performance.now()
    const collisionDifference = now - this.lastCollision;
    this.lastCollision = now;

    if(this.longestTimeMidair < collisionDifference) {
      this.longestTimeMidair = collisionDifference;
      if(this.longestTimeMidair / 1000 >= 0.2) {
        this.updateStat("longest-time-midair", this.longestTimeMidair / 1000);
      }
    }

    if(this.lastBounceX === null) {
        this.lastBounceX = ball.position.x / 200;
    } else {
        const distanceJumped = Math.abs(ball.position.x / 200 - this.lastBounceX / 200);
        if(this.furthestJump < distanceJumped) {
            this.furthestJump = distanceJumped;
            if(this.furthestJump >= 1) {
                this.updateStat("furthest-jump-achieved", this.furthestJump);
            }
            this.lastBounceX = ball.position.x;
        } else {
            this.lastBounceX = ball.position.x;
        }
    }
  }

  trackRelevantStats(ball: Ball): void {
    this.totalDistanceTravelled = this.totalResetDistance + ball.position.x / 200;
    this.updateStat("total-distance-travelled", this.totalDistanceTravelled);

    if(this.furthestDistanceReached < ball.position.x / 200) {
        this.furthestDistanceReached = ball.position.x / 200;
        this.updateStat("furthest-distance-reached", this.furthestDistanceReached);
    }

    if(this.fastestSpeedAchieved < ball.attributes.velocity.magnitude()) {
        this.fastestSpeedAchieved = ball.attributes.velocity.magnitude();
        this.updateStat("fastest-speed-achieved", this.fastestSpeedAchieved / 200)
    }
  }

  addJump(): void {
    this.numberOfJumpsMade++;
    this.updateStat("total-jumps", this.numberOfJumpsMade);
  }

  addDistanceTravelled(distance: number): void {
    this.totalResetDistance += distance / 200;
  }

  addPointsEarned(points: number): void {
    this.pointsEarned += points;
    this.updateStat("total-points-earned", this.pointsEarned);
  }

  addUpgradeBought(stat: string, spent: number): void {
    switch(stat) {
      case "acceleration":
        this.accelerationUpgradesBought++;
        this.updateStat("total-acceleration-upgrades", this.accelerationUpgradesBought);
        break;
      case "max-rps":
        this.maxRotationsUpgradesBought++;
        this.updateStat("total-max-rps-upgrades", this.maxRotationsUpgradesBought);
        break;
      case "grip":
        this.gripUpgradesBought++;
        this.updateStat("total-grip-upgrades", this.gripUpgradesBought);
        break;
      case "shock-absorber":
        this.shockAbsorberUpgradesBought++;
        this.updateStat("total-shock-absorber-upgrades", this.shockAbsorberUpgradesBought);
        break;
      case "jumps":
        this.jumpUpgradesBought++;
        this.updateStat("total-jump-upgrades", this.jumpUpgradesBought);
        break;
    }
    this.pointsSpent += spent;
    this.updateStat("total-points-spent", this.pointsSpent);
  }

  addNumberOfResets(): void {
    this.numberOfLevelResets++;
    this.updateStat("total-level-resets", this.numberOfLevelResets);
  }

}

const playerStats: PlayerStats = new PlayerStats();

export {playerStats}
