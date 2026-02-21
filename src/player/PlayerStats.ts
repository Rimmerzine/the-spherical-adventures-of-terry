import { Ball } from "../ball/Ball.js";

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

    updateCollided(ball: Ball): void {
        const now = performance.now();
        const collisionDifference = now - this.lastCollision;
        this.lastCollision = now;

        if (this.longestTimeMidair < collisionDifference / 1000) {
            this.longestTimeMidair = collisionDifference / 1000;
        }

        if (this.lastBounceX === null) {
            this.lastBounceX = ball.position.x / 200;
        } else {
            const distanceJumped = Math.abs(ball.position.x / 200 - this.lastBounceX / 200);
            if (this.furthestJump < distanceJumped) {
                this.furthestJump = distanceJumped;
                this.lastBounceX = ball.position.x;
            } else {
                this.lastBounceX = ball.position.x;
            }
        }
    }

    trackRelevantStats(ball: Ball): void {
        this.totalDistanceTravelled = this.totalResetDistance + ball.position.x / 200;

        if (this.furthestDistanceReached < ball.position.x / 200) {
            this.furthestDistanceReached = ball.position.x / 200;
        }

        if (this.fastestSpeedAchieved < ball.attributes.velocity.magnitude() / 200) {
            this.fastestSpeedAchieved = ball.attributes.velocity.magnitude() / 200;
        }
    }

    addJump(): void {
        this.numberOfJumpsMade++;
    }

    addDistanceTravelled(distance: number): void {
        this.totalResetDistance += distance / 200;
    }

    addPointsEarned(points: number): void {
        this.pointsEarned += points;
    }

    addUpgradeBought(stat: string, spent: number): void {
        switch (stat) {
            case "acceleration":
                this.accelerationUpgradesBought++;
                break;
            case "max-rps":
                this.maxRotationsUpgradesBought++;
                break;
            case "grip":
                this.gripUpgradesBought++;
                break;
            case "shock-absorber":
                this.shockAbsorberUpgradesBought++;
                break;
            case "jumps":
                this.jumpUpgradesBought++;
                break;
        }
        this.pointsSpent += spent;
    }

    addNumberOfResets(): void {
        this.numberOfLevelResets++;
    }
}

const playerStats: PlayerStats = new PlayerStats();

export { playerStats };
