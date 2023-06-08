import { gravity } from "./Settings.js";

("use strict");

class InputManager {
  constructor(game) {
    this.keys = {};
    this.game = game;
    this.leftScreenTouch = false;
    this.rightScreenTouch = false;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchEndHandler = this.touchEndHandler.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    const upgradeButtons = [
      ["upgrade-speed-button", "upgradeSpeed"],
      ["upgrade-grip-button", "upgradeGrip"],
      ["upgrade-jump-button", "upgradeJump"],
      ["upgrade-max-rpm-button", "upgradeMaxSpeed"],
      ["reset-level-button", "resetLevel"],
    ];
    upgradeButtons.forEach(([id, method]) => {
      document
        .getElementById(id)
        .addEventListener("click", this[method].bind(this));
    });
    const canvasContainer = document.getElementById("canvas-container");
    canvasContainer.addEventListener("touchstart", this.touchStartHandler);
    canvasContainer.addEventListener("touchend", this.touchEndHandler);
  }

  // current state: jump works ish... I can jump, cooldown isn't taken into account currently
  // jump should only reset after landing and assuming cooldown is complete
  handleKeyDown(event) {
    if (
      !this.keys[event.key] ||
      this.keys[event.key].cooldown <= new Date().getTime()
    ) {
      this.keys[event.key] = {
        pressed: true,
        cooldown: 0,
      };
    }
  }

  handleKeyUp(event) {
    this.keys[event.key].pressed = false;
  }

  isLeftPressed() {
    if (this.leftScreenTouch) {
      return true;
    } else if (this.keys["a"]) {
      return this.keys["a"].pressed;
    } else {
      return false;
    }
  }

  isRightPressed() {
    if (this.rightScreenTouch) {
      return true;
    } else if (this.keys["d"]) {
      return this.keys["d"].pressed;
    } else {
      return false;
    }
  }

  isJumpPressed() {
    if (this.keys[" "] && this.keys[" "].pressed) {
      const now = new Date().getTime();
      const canJump = this.keys[" "].pressed && this.keys[" "].cooldown <= now; // if space is pressed and it isn't on cooldown
      this.keys[" "].cooldown = now + 100; // add a cooldown to the key
      return canJump;
    } else {
      return false;
    }
  }

  upgradeSpeed() {
    this.game.ball.stats.getStat("acceleration").upgrade();
    document.getElementById("acceleration-attribute").innerText =
      Math.round(
        this.game.ball.stats.getStat("acceleration").currentValue * 2000
      ) / 100;
  }

  upgradeGrip() {
    this.game.ball.stats.getStat("grip").upgrade();
    document.getElementById("grip-attribute").innerText =
      Math.round(
        (1 - this.game.ball.stats.getStat("grip").currentValue) * 1000
      ) / 100;
  }

  upgradeJump() {
    this.game.ball.stats.getStat("jumps").upgrade();
    document.getElementById("jump-attribute").innerText =
      this.game.ball.stats.getStat("jumps").currentValue;
  }

  upgradeMaxSpeed() {
    this.game.ball.stats.getStat("max-rpm").upgrade();
    document.getElementById("max-rpm-attribute").innerText =
      this.game.ball.stats.getStat("max-rpm").currentValue;
  }

  touchStartHandler(event) {
    const { clientX, target } = event.touches[0];
    const { left, width } = target.getBoundingClientRect();
    const touchX = clientX - left;

    if (touchX < width / 2) {
      this.leftScreenTouch = true;
    } else {
      this.rightScreenTouch = true;
    }
  }

  touchEndHandler() {
    this.leftScreenTouch = false;
    this.rightScreenTouch = false;
  }

  resetLevel() {
    this.game.resetLevel();
  }
}

export default InputManager;
