import { ballSettings } from "./Settings.js";

class InputManager {
  constructor() {
    this.keys = {};
    this.leftScreenTouch = false;
    this.rightScreenTouch = false;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    document.addEventListener("keyup", this.handleKeyUp.bind(this));

    document
      .getElementById("upgrade-speed-button")
      .addEventListener("click", this.upgradeSpeed);

    document
      .getElementById("upgrade-weight-button")
      .addEventListener("click", this.upgradeWeight);

    document
      .getElementById("upgrade-grip-button")
      .addEventListener("click", this.upgradeGrip);

    document
      .getElementById("upgrade-jump-button")
      .addEventListener("click", this.upgradeJump);

    document
      .getElementById("upgrade-max-speed-button")
      .addEventListener("click", this.upgradeMaxSpeed);

    document
      .getElementById("canvas-container")
      .addEventListener("touchstart", this.touchStartHandler);

    document
      .getElementById("canvas-container")
      .addEventListener("touchend", this.touchEndHandler);

    document.addEventListener("keyup", function (event) {
      if (event.key == " ") {
        event.preventDefault();
      }
    });
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
      this.keys[" "].cooldown = now + 200; // add a cooldown to the key
      return canJump;
    } else {
      return false;
    }
  }

  upgradeSpeed() {
    if (ballSettings.acceleration <= 0.22) {
      ballSettings.acceleration += 0.02;
    }
    document.getElementById("acceleration-attribute").innerText =
      Math.round(ballSettings.acceleration * 2000) / 100;
  }

  upgradeWeight() {
    if (ballSettings.reflectionDampeningFactor >= 0.6) {
      ballSettings.reflectionDampeningFactor -= 0.05;
    }
    document.getElementById("weight-attribute").innerText =
      Math.round((1 - ballSettings.reflectionDampeningFactor) * 1000) / 100;
  }

  upgradeGrip() {
    if (ballSettings.gripFactor >= 0.6) {
      ballSettings.gripFactor -= 0.05;
    }
    document.getElementById("grip-attribute").innerText =
      Math.round((1 - ballSettings.gripFactor) * 1000) / 100;
  }

  upgradeJump() {
    if (ballSettings.totalJumps < 2) {
      ballSettings.totalJumps++;
    }
    document.getElementById("jump-attribute").innerText =
      ballSettings.totalJumps;
  }

  upgradeMaxSpeed() {
    if (ballSettings.maxSpeed < 15) {
      ballSettings.maxSpeed++;
    }
    document.getElementById("max-speed-attribute").innerText =
      ballSettings.maxSpeed;
  }

  touchStartHandler = (event) => {
    const { clientX, target } = event.touches[0];
    const { left, width } = target.getBoundingClientRect();
    const touchX = clientX - left;

    if (touchX < width / 2) {
      this.leftScreenTouch = true;
    } else {
      this.rightScreenTouch = true;
    }
  };

  touchEndHandler = () => {
    this.leftScreenTouch = false;
    this.rightScreenTouch = false;
  };
}

export default InputManager;
