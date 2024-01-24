import {Game} from './Game.js';

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
  game: Game;
  leftScreenTouch: boolean;
  rightScreenTouch: boolean;

  constructor(game: Game) {
    this.keys = new Map();
    this.game = game;
    this.leftScreenTouch = false;
    this.rightScreenTouch = false;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchEndHandler = this.touchEndHandler.bind(this);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    document
      .getElementById('upgrade-acceleration-button')
      .addEventListener('click', this.upgradeSpeed.bind(this));
    document
      .getElementById('upgrade-grip-button')
      .addEventListener('click', this.upgradeGrip.bind(this));
    document
      .getElementById('upgrade-jumps-button')
      .addEventListener('click', this.upgradeJump.bind(this));
    document
      .getElementById('upgrade-max-rps-button')
      .addEventListener('click', this.upgradeMaxSpeed.bind(this));
    document
      .getElementById('reset-level-grasslands')
      .addEventListener('click', this.resetLevelGrass.bind(this));
    document
      .getElementById('reset-level-tarmac')
      .addEventListener('click', this.resetLevelTarmac.bind(this));
    document
      .getElementById('reset-level-ice')
      .addEventListener('click', this.resetLevelIce.bind(this));
    // const canvasContainer = document.getElementById('canvas-container');
    // canvasContainer.addEventListener('touchstart', this.touchStartHandler);
    // canvasContainer.addEventListener('touchend', this.touchEndHandler);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (
      !this.keys.get(event.key) ||
      this.keys.get(event.key).cooldown <= performance.now()
    ) {
      const pressEvent = new PressEvent(true, 0);
      this.keys.set(event.key, pressEvent);
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    const pressEvent = this.keys.get(event.key);
    pressEvent.pressed = false;
    this.keys.set(event.key, pressEvent);
  }

  isLeftPressed(): boolean {
    if (this.leftScreenTouch) {
      return true;
    } else if (this.keys.get('a')) {
      return this.keys.get('a').pressed;
    } else {
      return false;
    }
  }

  isRightPressed(): boolean {
    if (this.rightScreenTouch) {
      return true;
    } else if (this.keys.get('d')) {
      return this.keys.get('d').pressed;
    } else {
      return false;
    }
  }

  isJumpPressed(): boolean {
    const pressEvent = this.keys.get(' ');
    if (pressEvent && pressEvent.pressed) {
      const now = performance.now();
      const canJump = pressEvent.pressed && pressEvent.cooldown <= now;
      this.keys.get(' ').cooldown = now + 100;
      pressEvent.cooldown = now + 100;
      this.keys.set(' ', pressEvent);
      return canJump;
    } else {
      return false;
    }
  }

  upgradeSpeed(): void {
    if (
      this.game.totalPoints >=
      this.game.ball.stats.getStat('acceleration').nextUpgradeCost()
    ) {
      this.game.totalPoints -= this.game.ball.stats
        .getStat('acceleration')
        .nextUpgradeCost();
      this.game.ball.stats.getStat('acceleration').upgrade();

      document.getElementById('acceleration-attribute').innerText =
        this.game.ball.stats.getStat('acceleration').currentValue.toString();

      document.getElementById('upgrade-acceleration-cost').innerText =
        this.game.ball.stats
          .getStat('acceleration')
          .nextUpgradeCost()
          .toString();

      if (
        this.game.ball.stats.getStat('acceleration').nextUpgradeCost() ===
        Infinity
      ) {
        document
          .getElementById('upgrade-acceleration-button')
          .setAttribute('disabled', '');
      }
    } else {
      alert('Not enough points to upgrade acceleration!');
    }
  }

  upgradeGrip() {
    if (
      this.game.totalPoints >=
      this.game.ball.stats.getStat('grip').nextUpgradeCost()
    ) {
      this.game.totalPoints -= this.game.ball.stats
        .getStat('grip')
        .nextUpgradeCost();
      this.game.ball.stats.getStat('grip').upgrade();
      // document.getElementById("grip-attribute").innerText =
      //   Math.round((1 - this.game.ball.stats.getStat("grip").currentValue) * 1000) / 100;
    } else {
      alert('Not enough points to upgrade grip!');
    }
  }

  upgradeJump() {
    if (
      this.game.totalPoints >=
      this.game.ball.stats.getStat('jumps').nextUpgradeCost()
    ) {
      this.game.totalPoints -= this.game.ball.stats
        .getStat('jumps')
        .nextUpgradeCost();
      this.game.ball.stats.getStat('jumps').upgrade();

      document.getElementById('jumps-attribute').innerText =
        this.game.ball.stats.getStat('jumps').currentValue.toString();

      document.getElementById('upgrade-jumps-cost').innerText =
        this.game.ball.stats.getStat('jumps').nextUpgradeCost().toString();

      if (
        this.game.ball.stats.getStat('jumps').nextUpgradeCost() === Infinity
      ) {
        document
          .getElementById('upgrade-jumps-button')
          .setAttribute('disabled', '');
      }
    } else {
      alert('Not enough points to upgrade jumps!');
    }
  }

  upgradeMaxSpeed() {
    if (
      this.game.totalPoints >=
      this.game.ball.stats.getStat('max-rps').nextUpgradeCost()
    ) {
      this.game.totalPoints -= this.game.ball.stats
        .getStat('max-rps')
        .nextUpgradeCost();
      this.game.ball.stats.getStat('max-rps').upgrade();

      document.getElementById('max-rps-attribute').innerText =
        this.game.ball.stats.getStat('max-rps').currentValue.toString();

      document.getElementById('upgrade-max-rps-cost').innerText =
        this.game.ball.stats.getStat('max-rps').nextUpgradeCost().toString();

      if (
        this.game.ball.stats.getStat('max-rps').nextUpgradeCost() === Infinity
      ) {
        document
          .getElementById('upgrade-max-rps-button')
          .setAttribute('disabled', '');
      }
    } else {
      alert('Not enough points to upgrade max rps!');
    }
  }

  touchStartHandler() {
    // const {clientX, target} = event.touches[0];
    // const {left, width} = target.getBoundingClientRect();
    // const touchX = clientX - left;
    // if (touchX < width / 2) {
    //   this.leftScreenTouch = true;
    // } else {
    //   this.rightScreenTouch = true;
    // }
  }

  touchEndHandler() {
    this.leftScreenTouch = false;
    this.rightScreenTouch = false;
  }

  resetLevelGrass() {
    this.game.resetLevel('grass');
  }

  resetLevelTarmac() {
    this.game.resetLevel('tarmac');
  }

  resetLevelIce() {
    this.game.resetLevel('ice');
  }
}

export default InputManager;
