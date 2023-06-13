"use strict";

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
      ["upgrade-acceleration-button", this.upgradeSpeed],
      ["upgrade-grip-button", this.upgradeGrip],
      ["upgrade-jumps-button", this.upgradeJump],
      ["upgrade-max-rps-button", this.upgradeMaxSpeed],
      ["reset-level-grasslands", this.resetLevelGrass],
      ["reset-level-tarmac", this.resetLevelTarmac],
      ["reset-level-ice", this.resetLevelIce],
    ];
    upgradeButtons.forEach(([id, method]) => {
      document.getElementById(id).addEventListener("click", method.bind(this));
    });
    const canvasContainer = document.getElementById("canvas-container");
    canvasContainer.addEventListener("touchstart", this.touchStartHandler);
    canvasContainer.addEventListener("touchend", this.touchEndHandler);
  }

  // current state: jump works ish... I can jump, cooldown isn't taken into account currently
  // jump should only reset after landing and assuming cooldown is complete
  handleKeyDown(event) {
    if (!this.keys[event.key] || this.keys[event.key].cooldown <= performance.now()) {
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
      const now = performance.now();
      const canJump = this.keys[" "].pressed && this.keys[" "].cooldown <= now; // if space is pressed and it isn't on cooldown
      this.keys[" "].cooldown = now + 100; // add a cooldown to the key
      return canJump;
    } else {
      return false;
    }
  }

  upgradeSpeed() {
    if (this.game.totalPoints >= this.game.ball.stats.getStat("acceleration").nextUpgradeCost()) {
      this.game.totalPoints -= this.game.ball.stats.getStat("acceleration").nextUpgradeCost();
      this.game.ball.stats.getStat("acceleration").upgrade();

      document.getElementById("acceleration-attribute").innerText =
        this.game.ball.stats.getStat("acceleration").currentValue;

      document.getElementById("upgrade-acceleration-cost").innerText = this.game.ball.stats
        .getStat("acceleration")
        .nextUpgradeCost();

      if (this.game.ball.stats.getStat("acceleration").nextUpgradeCost() == Infinity) {
        document.getElementById("upgrade-acceleration-button").setAttribute("disabled", "");
      }
    } else {
      alert("Not enough points to upgrade acceleration!");
    }
  }

  upgradeGrip() {
    if (this.game.totalPoints >= this.game.ball.stats.getStat("grip").nextUpgradeCost()) {
      this.game.totalPoints -= this.game.ball.stats.getStat("grip").nextUpgradeCost();
      this.game.ball.stats.getStat("grip").upgrade();
      // document.getElementById("grip-attribute").innerText =
      //   Math.round((1 - this.game.ball.stats.getStat("grip").currentValue) * 1000) / 100;
    } else {
      alert("Not enough points to upgrade grip!");
    }
  }

  upgradeJump() {
    if (this.game.totalPoints >= this.game.ball.stats.getStat("jumps").nextUpgradeCost()) {
      this.game.totalPoints -= this.game.ball.stats.getStat("jumps").nextUpgradeCost();
      this.game.ball.stats.getStat("jumps").upgrade();

      document.getElementById("jumps-attribute").innerText = this.game.ball.stats.getStat("jumps").currentValue;

      document.getElementById("upgrade-jumps-cost").innerText = this.game.ball.stats.getStat("jumps").nextUpgradeCost();

      if (this.game.ball.stats.getStat("jumps").nextUpgradeCost() == Infinity) {
        document.getElementById("upgrade-jumps-button").setAttribute("disabled", "");
      }
    } else {
      alert("Not enough points to upgrade jumps!");
    }
  }

  upgradeMaxSpeed() {
    if (this.game.totalPoints >= this.game.ball.stats.getStat("max-rps").nextUpgradeCost()) {
      this.game.totalPoints -= this.game.ball.stats.getStat("max-rps").nextUpgradeCost();
      this.game.ball.stats.getStat("max-rps").upgrade();

      document.getElementById("max-rps-attribute").innerText = this.game.ball.stats.getStat("max-rps").currentValue;

      document.getElementById("upgrade-max-rps-cost").innerText = this.game.ball.stats
        .getStat("max-rps")
        .nextUpgradeCost();

      if (this.game.ball.stats.getStat("max-rps").nextUpgradeCost() == Infinity) {
        document.getElementById("upgrade-max-rps-button").setAttribute("disabled", "");
      }
    } else {
      alert("Not enough points to upgrade max rps!");
    }
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

  resetLevelGrass() {
    this.game.resetLevel("grass");
  }

  resetLevelTarmac() {
    this.game.resetLevel("tarmac");
  }

  resetLevelIce() {
    this.game.resetLevel("ice");
  }
}

export default InputManager;
