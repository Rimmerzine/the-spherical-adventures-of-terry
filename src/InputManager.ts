import { GameManager } from "./GameManager.js";
import { uiManager } from "./ui/UIManager.js";
import { Vector } from "./utils/Vector.js";

class PressEvent {
    pressed: boolean;
    cooldown: number;

    constructor(pressed: boolean, cooldown: number) {
        this.pressed = pressed;
        this.cooldown = cooldown;
    }
}

class InputManager {
    keys: Map<string, PressEvent>;
    game: GameManager;
    leftScreenTouch: boolean;
    rightScreenTouch: boolean;
    touchYPosition: number;

    constructor(game: GameManager) {
        this.keys = new Map();
        this.game = game;
        this.leftScreenTouch = false;
        this.rightScreenTouch = false;
        this.bindEventHandlers();
        this.attachEventListeners();
    }

    bindEventHandlers() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.touchStartHandler = this.touchStartHandler.bind(this);
        this.touchEndHandler = this.touchEndHandler.bind(this);
        this.resetLevel = this.resetLevel.bind(this);
    }

    attachEventListeners() {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
        this.attachLevelResetListeners();
        const canvasContainer = document.getElementById("canvas");
        canvasContainer.addEventListener("touchstart", this.touchStartHandler.bind(this));
        canvasContainer.addEventListener("touchend", this.touchEndHandler);
        canvasContainer.addEventListener("touchmove", this.touchMoveHandler.bind(this));
        canvasContainer.addEventListener("click", this.handleMouseClick.bind(this));
        canvasContainer.addEventListener("mousemove", this.handleMouseMove.bind(this));
        canvasContainer.addEventListener("wheel", this.handleScroll.bind(this));
    }

    handleScroll(event: WheelEvent) {
        event.preventDefault();

        const canvasContainer = document.getElementById("canvas");
        const rect = canvasContainer.getBoundingClientRect();

        const verticalMovement = Math.sign(event.deltaY) * (event.deltaY / event.deltaY) * 25;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        uiManager.handleScroll(new Vector(mouseX - rect.left, mouseY - rect.top), verticalMovement);
    }

    handleMouseMove(event: MouseEvent) {
        const canvasContainer = document.getElementById("canvas");
        const rect = canvasContainer.getBoundingClientRect();
        uiManager.handleMouseMovement(new Vector(event.clientX - rect.left, event.clientY - rect.top));
    }

    handleMouseClick(event: MouseEvent) {
        const canvasContainer = document.getElementById("canvas");
        const rect = canvasContainer.getBoundingClientRect();
        uiManager.handleMouseClick(new Vector(event.clientX - rect.left, event.clientY - rect.top));
    }

    attachLevelResetListeners() {
        const levels = ["grasslands", "tarmac", "ice", "hell", "moon", "holymoly"];
        levels.forEach((level) => document.getElementById(`reset-level-${level}`).addEventListener("click", () => this.resetLevel(level)));
    }

    handleKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.keys.get(event.key) || this.keys.get(event.key).cooldown <= performance.now()) {
            this.keys.set(event.key, new PressEvent(true, 0));
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        const pressEvent = this.keys.get(event.key);
        pressEvent.pressed = false;
        this.keys.set(event.key, pressEvent);
    }

    isLeftPressed(): boolean {
        return this.leftScreenTouch || (this.keys.get("a") && this.keys.get("a").pressed) || false;
    }

    isRightPressed(): boolean {
        return this.rightScreenTouch || (this.keys.get("d") && this.keys.get("d").pressed) || false;
    }

    isJumpPressed(): boolean {
        const pressEvent = this.keys.get(" ");
        if (pressEvent && pressEvent.pressed) {
            const now = performance.now();
            const canJump = pressEvent.pressed && pressEvent.cooldown <= now;
            this.keys.get(" ").cooldown = now + 100;
            pressEvent.cooldown = now + 100;
            this.keys.set(" ", pressEvent);
            return canJump;
        } else {
            return false;
        }
    }

    touchStartHandler(event: TouchEvent) {
        const touch = event.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        this.touchYPosition = touchY;

        const canvasWidth = document.getElementById("canvas").clientWidth;

        this.leftScreenTouch = touchX < canvasWidth / 2;
        this.rightScreenTouch = !this.leftScreenTouch;
    }

    touchEndHandler() {
        this.leftScreenTouch = false;
        this.rightScreenTouch = false;
    }

    touchMoveHandler(event: TouchEvent) {
        event.preventDefault();

        const touch = event.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        const changeInY: number = this.touchYPosition - touchY;
        this.touchYPosition = touchY;

        const canvasContainer = document.getElementById("canvas");
        const rect = canvasContainer.getBoundingClientRect();
        uiManager.handleScroll(new Vector(touchX - rect.left, touchY - rect.top), changeInY);

        this.leftScreenTouch = touchX < canvasContainer.clientWidth / 2;
        this.rightScreenTouch = !this.leftScreenTouch;
    }

    resetLevelGrasslands() {
        this.game.resetLevel("grasslands");
    }

    resetLevelTarmac() {
        this.game.resetLevel("tarmac");
    }

    resetLevelIce() {
        this.game.resetLevel("ice");
    }

    resetLevelHell() {
        this.game.resetLevel("hell");
    }

    resetLevelMoon() {
        this.game.resetLevel("moon");
    }

    resetLevelHolyMoly() {
        this.game.resetLevel("holymoly");
    }

    resetLevel(level: string) {
        this.game.resetLevel(level);
    }
}

export { InputManager };
