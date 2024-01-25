import Ball from "./Ball.js";

class PlayerStats {
  furthestDistanceReached: number;
  totalDistanceTravelled: number;
  totalResetDistance: number;
  numberOfJumpsMade: number;
  pointsEarned: number;
  pointsSpent: number;
  maxRotationsUpgradesBought: number;
  accelerationUpgradesBought: number;
  jumpUpgradesBought: number;
  fastestSpeedAchieved: number;
  furthestJump: number;
  longestTimeMidair: number;
  numberOfLevelResets: number;
  lastCollision: number;
  lastBounceX: number;

  constructor() {
    this.furthestDistanceReached = 0;
    this.totalDistanceTravelled = 0;
    this.totalResetDistance = 0;
    this.numberOfJumpsMade = 0;
    this.pointsEarned = 0;
    this.pointsSpent = 0;
    this.maxRotationsUpgradesBought = 0;
    this.accelerationUpgradesBought = 0;
    this.jumpUpgradesBought = 0;
    this.fastestSpeedAchieved = 0;
    this.furthestJump = 0;
    this.longestTimeMidair = 0;
    this.numberOfLevelResets = 0;
    this.lastCollision = performance.now();
    this.lastBounceX = null;
  }

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
        this.lastBounceX = ball.getPosition().x / 200;
    } else {
        const distanceJumped = Math.abs(ball.getPosition().x / 200 - this.lastBounceX / 200);
        if(this.furthestJump < distanceJumped) {
            this.furthestJump = distanceJumped;
            if(this.furthestJump >= 1) {
                this.updateStat("furthest-jump-achieved", this.furthestJump);
            }
            this.lastBounceX = ball.getPosition().x;
        } else {
            this.lastBounceX = ball.getPosition().x;
        }
    }
  }

  trackRelevantStats(ball: Ball): void {
    this.totalDistanceTravelled = this.totalResetDistance + ball.getPosition().x / 200;
    this.updateStat("total-distance-travelled", this.totalDistanceTravelled);

    if(this.furthestDistanceReached < ball.getPosition().x / 200) {
        this.furthestDistanceReached = ball.getPosition().x / 200;
        this.updateStat("furthest-distance-reached", this.furthestDistanceReached);
    }

    if(this.fastestSpeedAchieved < ball.attributes.velocity.distance()) {
        this.fastestSpeedAchieved = ball.attributes.velocity.distance();
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
