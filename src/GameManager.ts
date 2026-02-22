import { CanvasRenderer } from "./CanvasRenderer.js";
import { collisionDetection } from "./CollisionDetection.js";
import { GameSettings, Gravity } from "./Settings.js";
import { Vector } from "./utils/Vector.js";
import { InputManager } from "./InputManager.js";
import { TerrainSettings } from "./terrain/TerrainSettings.js";
import { Cloud } from "./background/Cloud.js";
import { camera } from "./Camera.js";
import { playerStats } from "./player/PlayerStats.js";
import { Eye } from "./background/Eye.js";
import { Star } from "./background/Star.js";
import { CollectablePoint, Level } from "./level/Level.js";
import { LevelGenerator } from "./level/LevelGenerator.js";
import { BackgroundObjectCreationSettings, LevelSettings } from "./level/LevelSettings.js";
import { Snow } from "./background/Snow.js";
import { Player } from "./player/Player.js";
import { Skyscraper } from "./background/Skyscraper.js";
import { LavaFalls } from "./background/LavaFalls.js";
import { UIContainer } from "./ui/UIContainer.js";
import { UIButton, UIButtonOptions } from "./ui/UIButton.js";
import { UIWindow } from "./ui/UIWindow.js";
import { UIOpenWindowButton } from "./ui/UIOpenWindowButton.js";
import { UIText, UITextOptions } from "./ui/UIText.js";
import { UIAttributeText } from "./ui/UIAttributeText.js";
import { BallSkill } from "./ball/BallSkills.js";
import { UISkillUpgradeSection } from "./ui/UISkillUpgradeSection.js";
import { uiManager } from "./ui/UIManager.js";
import { UILabelledAttribute } from "./ui/UILabelledAttribute.js";

class GameManager {
    renderer: CanvasRenderer;
    inputManager: InputManager;
    levelGenerator: LevelGenerator;
    distanceReached: number;
    totalPoints: number;
    requiredDelay: number;
    lastTime: number = 0;
    fpsTimer: number = 0;
    frameCount: number = 0;
    levelSettings: Map<string, LevelSettings>;
    currentLevel: Level;
    player: Player;

    constructor(canvas: HTMLCanvasElement) {
        this.player = new Player();
        this.renderer = new CanvasRenderer(canvas);
        this.inputManager = new InputManager(this);
        this.levelGenerator = new LevelGenerator();
        this.distanceReached = 0;
        this.totalPoints = 0;
        this.requiredDelay = 0;
        this.lastTime;

        camera.attach(this.player.ball);

        const windowContainer = new UIContainer(
            "screen-space",
            new Vector(0, 0),
            new Vector(this.renderer.canvas.width, this.renderer.canvas.height),
            "rgba(255, 255, 255, 0)",
        );

        uiManager.setWindowContainer(windowContainer);

        const upgradesWindow = new UIWindow(
            "upgrades-window",
            new Vector(this.renderer.canvas.width - 400, 0),
            new Vector(400, this.renderer.canvas.height),
            "white",
            windowContainer.size.y,
        );

        const openUpgradesWindowButton = new UIOpenWindowButton(
            "open-upgrades-window-button",
            new Vector(this.renderer.canvas.width - 150 - 25, 25),
            new Vector(150, 50),
            "Upgrades",
            upgradesWindow,
            new UIButtonOptions({
                defaultBackgroundColour: "rgb(180, 100, 200)",
                hoverBackgroundColour: "rgb(235, 165, 255)",
                hoverTextColour: "black",
                hoverTrimColour: "rgb(255, 255, 0)",
            }),
            new UITextOptions({
                fontSize: 24,
                colour: "white",
                textAlign: "center",
                textBaseline: "middle",
            }),
        );

        const statsWindow = new UIWindow(
            "stats-window",
            new Vector(this.renderer.canvas.width - 400, 0),
            new Vector(400, this.renderer.canvas.height),
            "white",
            windowContainer.size.y,
        );

        const openStatsWindowButton = new UIOpenWindowButton(
            "open-stats-window-button",
            new Vector(this.renderer.canvas.width - 150 - 25, 100),
            new Vector(150, 50),
            "Stats",
            statsWindow,
            new UIButtonOptions({
                defaultBackgroundColour: "rgb(180, 100, 200)",
                hoverBackgroundColour: "rgb(235, 165, 255)",
                hoverTextColour: "black",
                hoverTrimColour: "rgb(255, 255, 0)",
            }),
            new UITextOptions({
                fontSize: 24,
                colour: "white",
                textAlign: "center",
                textBaseline: "middle",
            }),
        );

        windowContainer.addElements(openUpgradesWindowButton, openStatsWindowButton, upgradesWindow, statsWindow);

        const upgradesHeading = new UIText(
            "upgrades-heading",
            new Vector(25, 25),
            "Upgrades",
            200,
            new UITextOptions({
                fontSize: 32,
            }),
        );

        const pointsAttributeText = new UIAttributeText(
            "points-attribute",
            new Vector(25, 90),
            "Total points: {0}",
            350,
            () => this.totalPoints,
            new UITextOptions({
                fontSize: 28,
            }),
        );

        const pointsInfoText = new UIText(
            "points-info",
            new Vector(25, 135),
            "Points can be gained in each level of the game. Points collected previously only provide 0.1 points.",
            350,
            new UITextOptions({
                fontSize: 16,
            }),
        );

        const upgradesContainer = new UIContainer(
            "upgrades-container",
            new Vector(25, 220),
            new Vector(370, 1000),
            "rgba(0, 0, 0, 0)",
            upgradesWindow.size.y - 230,
            false,
        );

        const accelerationUpgradeSection = new UISkillUpgradeSection(
            "acceleration-upgrade-section",
            new Vector(0, 0),
            345,
            "Acceleration",
            "{0} revolutions per second.",
            () => this.player.ball.skills.getSkill("acceleration").currentValue,
            "Upgrade acceleration ({0} points)",
            () => this.player.ball.skills.getSkill("acceleration").nextUpgradeCost(),
            () => {
                const skillKey = "acceleration";
                const stat: BallSkill = this.player.ball.skills.getSkill(skillKey);
                const nextUpgradeCost: number = stat.nextUpgradeCost();

                if (this.totalPoints >= nextUpgradeCost) {
                    this.totalPoints -= nextUpgradeCost;
                    stat.upgrade();
                    playerStats.addUpgradeBought(skillKey, nextUpgradeCost);
                } else {
                    alert(`Not enough points to upgrade ${skillKey}!`);
                }
            },
        );

        const maxRPSUpgradeSection = new UISkillUpgradeSection(
            "max-rps-upgrade-section",
            new Vector(0, 110),
            345,
            "Maximum revolutions per second",
            "{0} revolutions per second.",
            () => this.player.ball.skills.getSkill("max-rps").currentValue,
            "Upgrade maximum RPS ({0} points)",
            () => this.player.ball.skills.getSkill("max-rps").nextUpgradeCost(),
            () => {
                const skillKey = "max-rps";
                const stat: BallSkill = this.player.ball.skills.getSkill(skillKey);
                const nextUpgradeCost: number = stat.nextUpgradeCost();

                if (this.totalPoints >= nextUpgradeCost) {
                    this.totalPoints -= nextUpgradeCost;
                    stat.upgrade();
                    playerStats.addUpgradeBought(skillKey, nextUpgradeCost);
                } else {
                    alert(`Not enough points to upgrade ${skillKey}!`);
                }
            },
        );

        const gripUpgradeSection = new UISkillUpgradeSection(
            "grip-upgrade-section",
            new Vector(0, 220),
            345,
            "Grip",
            "{0}%",
            () => this.player.ball.skills.getSkill("grip").currentValue * 100,
            "Upgrade grip ({0} points)",
            () => this.player.ball.skills.getSkill("grip").nextUpgradeCost(),
            () => {
                const skillKey = "grip";
                const stat: BallSkill = this.player.ball.skills.getSkill(skillKey);
                const nextUpgradeCost: number = stat.nextUpgradeCost();

                if (this.totalPoints >= nextUpgradeCost) {
                    this.totalPoints -= nextUpgradeCost;
                    stat.upgrade();
                    playerStats.addUpgradeBought(skillKey, nextUpgradeCost);
                } else {
                    alert(`Not enough points to upgrade ${skillKey}!`);
                }
            },
        );

        const shockAbsorberUpgradeSection = new UISkillUpgradeSection(
            "shock-absorber-upgrade-section",
            new Vector(0, 330),
            345,
            "Shock absorber",
            "{0}%",
            () => this.player.ball.skills.getSkill("shock-absorber").currentValue * 100,
            "Upgrade shock absorber ({0} points)",
            () => this.player.ball.skills.getSkill("shock-absorber").nextUpgradeCost(),
            () => {
                const skillKey = "shock-absorber";
                const stat: BallSkill = this.player.ball.skills.getSkill(skillKey);
                const nextUpgradeCost: number = stat.nextUpgradeCost();

                if (this.totalPoints >= nextUpgradeCost) {
                    this.totalPoints -= nextUpgradeCost;
                    stat.upgrade();
                    playerStats.addUpgradeBought(skillKey, nextUpgradeCost);
                } else {
                    alert(`Not enough points to upgrade ${skillKey}!`);
                }
            },
        );

        const jumpsUpgradeSection = new UISkillUpgradeSection(
            "jumps-upgrade-section",
            new Vector(0, 440),
            345,
            "Jumps",
            "{0} jumps.",
            () => this.player.ball.skills.getSkill("jumps").currentValue,
            "Upgrade jumps ({0} points)",
            () => this.player.ball.skills.getSkill("jumps").nextUpgradeCost(),
            () => {
                const skillKey = "jumps";
                const stat: BallSkill = this.player.ball.skills.getSkill(skillKey);
                const nextUpgradeCost: number = stat.nextUpgradeCost();

                if (this.totalPoints >= nextUpgradeCost) {
                    this.totalPoints -= nextUpgradeCost;
                    stat.upgrade();
                    playerStats.addUpgradeBought(skillKey, nextUpgradeCost);
                } else {
                    alert(`Not enough points to upgrade ${skillKey}!`);
                }
            },
        );

        const buttonTest = new UIButton(
            "button-test",
            new Vector(0, 550),
            new Vector(150, 50),
            "test",
            () => {
                this.totalPoints += 50;
            },
            new UIButtonOptions({
                defaultBackgroundColour: "rgb(180, 100, 200)",
                hoverBackgroundColour: "rgb(235, 165, 255)",
                hoverTextColour: "black",
                hoverTrimColour: "rgb(255, 255, 0)",
            }),
            new UITextOptions({
                fontSize: 24,
                colour: "white",
                textAlign: "center",
                textBaseline: "middle",
            }),
        );

        upgradesContainer.addElements(
            accelerationUpgradeSection,
            maxRPSUpgradeSection,
            gripUpgradeSection,
            shockAbsorberUpgradeSection,
            jumpsUpgradeSection,
            buttonTest,
        );

        upgradesWindow.addElements(upgradesHeading, pointsAttributeText, pointsInfoText, upgradesContainer);

        const statsHeading = new UIText(
            "stats-heading",
            new Vector(25, 25),
            "Stats",
            200,
            new UITextOptions({
                fontSize: 32,
            }),
        );

        const statsContainer = new UIContainer(
            "stats-container",
            new Vector(25, 80),
            new Vector(370, 1000),
            "rgba(0, 0, 0, 0)",
            statsWindow.size.y - 90,
            false,
        );

        const furthestDistanceReachedStat = new UILabelledAttribute(
            "furthest-distance-reached-stat",
            new Vector(0, 0),
            345,
            "Furthest distance reached",
            "{0} meters",
            () => playerStats.furthestDistanceReached,
        );

        const totalDistanceTravelledStat = new UILabelledAttribute(
            "total-distance-travelled-stat",
            new Vector(0, 70),
            345,
            "Total distance travelled",
            "{0} meters",
            () => playerStats.totalDistanceTravelled,
        );

        const totalNumberOfJumpsStat = new UILabelledAttribute(
            "total-number-of-jumps-stat",
            new Vector(0, 140),
            345,
            "Total number of jumps",
            "{0} jumps",
            () => playerStats.numberOfJumpsMade,
        );

        const totalPointsEarntStat = new UILabelledAttribute(
            "total-points-earnt-stat",
            new Vector(0, 210),
            345,
            "Total points earnt",
            "{0} points",
            () => playerStats.pointsEarned,
        );

        const totalPointsSpentStat = new UILabelledAttribute(
            "total-points-spent-stat",
            new Vector(0, 280),
            345,
            "Total points spent",
            "{0} points",
            () => playerStats.pointsSpent,
        );

        const totalMaxRPSUpgradesBoughtStat = new UILabelledAttribute(
            "total-max-rps-upgrades-bought-stat",
            new Vector(0, 350),
            345,
            "Total max RPS upgrades bought",
            "{0} upgrades",
            () => playerStats.maxRotationsUpgradesBought,
        );

        const totalAccelerationUpgradesBoughtStat = new UILabelledAttribute(
            "total-acceleration-upgrades-bought-stat",
            new Vector(0, 420),
            345,
            "Total acceleration upgrades bought",
            "{0} upgrades",
            () => playerStats.accelerationUpgradesBought,
        );

        const totalGripUpgradesBoughtStat = new UILabelledAttribute(
            "total-grip-upgrades-bought-stat",
            new Vector(0, 490),
            345,
            "Total grip upgrades bought",
            "{0} upgrades",
            () => playerStats.gripUpgradesBought,
        );

        const totalShockAbsorberUpgradesBoughtStat = new UILabelledAttribute(
            "total-shock-absorber-upgrades-bought-stat",
            new Vector(0, 560),
            345,
            "Total shock absorber upgrades bought",
            "{0} upgrades",
            () => playerStats.shockAbsorberUpgradesBought,
        );

        const totalJumpUpgradesBoughtStat = new UILabelledAttribute(
            "total-jump-upgrades-bought-stat",
            new Vector(0, 630),
            345,
            "Total jump upgrades bought",
            "{0} upgrades",
            () => playerStats.jumpUpgradesBought,
        );

        const fastestSpeedAchieveStat = new UILabelledAttribute(
            "fastest-speed-achieved-stat",
            new Vector(0, 700),
            345,
            "Fastest speed achieved",
            "{0} meters per second",
            () => playerStats.fastestSpeedAchieved,
        );

        const furthestJumpAchievedStat = new UILabelledAttribute(
            "furthest-jump-achieved-stat",
            new Vector(0, 770),
            345,
            "Furthest jump achieved",
            "{0} meters",
            () => playerStats.furthestJump,
        );

        const longestTimeSpentMidAirStat = new UILabelledAttribute(
            "longest-time-spent-mid-air-stat",
            new Vector(0, 840),
            345,
            "Longest time spent mid-air",
            "{0} seconds",
            () => playerStats.longestTimeMidair,
        );

        const totalNumberOfLevelResetsStat = new UILabelledAttribute(
            "total-number-of-level-resets-stat",
            new Vector(0, 910),
            345,
            "Total number of level resets",
            "{0} resets",
            () => playerStats.numberOfLevelResets,
        );

        statsContainer.addElements(
            furthestDistanceReachedStat,
            totalDistanceTravelledStat,
            totalNumberOfJumpsStat,
            totalPointsEarntStat,
            totalPointsSpentStat,
            totalMaxRPSUpgradesBoughtStat,
            totalAccelerationUpgradesBoughtStat,
            totalGripUpgradesBoughtStat,
            totalShockAbsorberUpgradesBoughtStat,
            totalJumpUpgradesBoughtStat,
            fastestSpeedAchieveStat,
            furthestJumpAchievedStat,
            longestTimeSpentMidAirStat,
            totalNumberOfLevelResetsStat,
        );

        statsWindow.addElements(statsHeading, statsContainer);

        const grasslandsLevelSettings: LevelSettings = new LevelSettings(
            "grasslands",
            new TerrainSettings(400, 5, 1000, 1000, -2000, 0, -20000, 150, 800, 0.4, 0.6, "rgb(0, 130, 0)", "rgb(100, 50, 0)"),
            "rgb(150, 210, 255)",
            Gravity.multiply(1),
            [new BackgroundObjectCreationSettings((position: Vector) => new Cloud(position), 10)],
        );

        const tarmacLevelSettings: LevelSettings = new LevelSettings(
            "tarmac",
            new TerrainSettings(300, 5, 1000, 1000, -2000, 0, -20000, 200, 500, 1.0, 0.8, "rgb(10, 10, 10)", "rgb(20, 20, 20)"),
            "rgb(10, 5, 20)",
            Gravity,
            [
                new BackgroundObjectCreationSettings((position: Vector) => new Star(position), 20),
                new BackgroundObjectCreationSettings((position: Vector) => new Skyscraper(position), 1 / 3),
            ],
        );

        const iceLevelSettings: LevelSettings = new LevelSettings(
            "ice",
            new TerrainSettings(300, 10, 1000, 100, -100, 1000, -1000, 200, 500, 0.01, 0.9, "rgb(30, 130, 200)", "rgb(50, 180, 255)"),
            "rgb(180, 225, 255)",
            Gravity,
            [
                new BackgroundObjectCreationSettings((position: Vector) => new Cloud(position), 5),
                new BackgroundObjectCreationSettings((position: Vector) => new Snow(position), 50),
            ],
        );

        const hellLevelSettings: LevelSettings = new LevelSettings(
            "hell",
            new TerrainSettings(300, 10, 1000, 1000, -2000, 0, -20000, 250, 1000, 0.4, 0, "rgb(75, 25, 25)", "rgb(100, 0, 0)"),
            "rgb(45, 0, 0)",
            Gravity,
            [
                new BackgroundObjectCreationSettings((position: Vector) => new Eye(position), 10),
                new BackgroundObjectCreationSettings((position: Vector) => new LavaFalls(position), 1 / 8),
            ],
        );

        const moonLevelSettings: LevelSettings = new LevelSettings(
            "moon",
            new TerrainSettings(400, 10, 1000, 1000, -2000, 0, -20000, 250, 1000, 0.2, 0.75, "rgb(75, 75, 75)", "rgb(50, 50, 50)"),
            "rgb(0, 0, 0)",
            Gravity.multiply(0.2),
            [new BackgroundObjectCreationSettings((position: Vector) => new Star(position), 50)],
        );

        const holyMolyLevelSettings: LevelSettings = new LevelSettings(
            "holymoly",
            new TerrainSettings(400, 5, 1000, 1000, -2000, 0, -20000, 150, 800, 0.4, 0.6, "rgb(0, 130, 0)", "rgb(100, 50, 0)", true),
            "rgb(70, 120, 175)",
            Gravity,
            [
                new BackgroundObjectCreationSettings((position: Vector) => new Star(position), 10),
                new BackgroundObjectCreationSettings((position: Vector) => new Cloud(position), 10),
            ],
        );

        this.levelSettings = new Map<string, LevelSettings>([
            ["grasslands", grasslandsLevelSettings],
            ["tarmac", tarmacLevelSettings],
            ["ice", iceLevelSettings],
            ["hell", hellLevelSettings],
            ["moon", moonLevelSettings],
            ["holymoly", holyMolyLevelSettings],
        ]);

        this.currentLevel = this.levelGenerator.generateLevel(this.player, this.levelSettings.get("grasslands"));
    }

    resetLevel(level: string) {
        playerStats.addDistanceTravelled(this.player.ball.position.x);
        playerStats.lastBounceX = 0;
        playerStats.addNumberOfResets();

        this.player.ball.resetPosition();
        this.currentLevel = this.levelGenerator.generateLevel(this.player, this.levelSettings.get(level));
    }

    draw(): void {
        this.renderer.draw(this.currentLevel, this.player.ball);
    }

    update(deltaTime: number): void {
        deltaTime = Math.min(1 / 30, (deltaTime /= 1000));

        if (this.inputManager.isLeftPressed()) {
            this.player.ball.pushLeft(deltaTime);
        }
        if (this.inputManager.isRightPressed()) {
            this.player.ball.pushRight(deltaTime);
        }
        if (this.inputManager.isJumpPressed()) {
            this.player.ball.jump();
        }

        this.player.ball.update(this.currentLevel.gravity, deltaTime);
        collisionDetection.detectBallFloorCollision(this.player.ball, this.currentLevel, deltaTime);
        this.player.ball.move(deltaTime);

        this.currentLevel.collectables.forEach((collectable) => {
            const diffXSquared = (this.player.ball.position.x - collectable.position.x) ** 2;
            const diffYSquared = (this.player.ball.position.y - collectable.position.y) ** 2;
            if (diffXSquared + diffYSquared <= (this.player.ball.attributes.radius + CollectablePoint.size / 2) ** 2) {
                this.player.collectPoint(this.currentLevel.name, collectable.position);

                this.currentLevel.collectables = this.currentLevel.collectables.filter((c) => c != collectable);

                if (!collectable.collected) {
                    this.totalPoints += 1;
                    playerStats.addPointsEarned(1);
                } else {
                    this.totalPoints += 0.1;
                    playerStats.addPointsEarned(0.1);
                }
            }
        });

        playerStats.trackRelevantStats(this.player.ball);
    }

    manageFps(deltaTime: number): void {
        this.fpsTimer += deltaTime;
        this.frameCount++;

        if (this.fpsTimer >= 1000) {
            GameSettings.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
    }

    play() {
        window.requestAnimationFrame((time) => {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;

            this.manageFps(deltaTime);
            this.draw();
            this.update(deltaTime);
            this.play();
        });
    }
}

export { GameManager };
