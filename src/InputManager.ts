import { BallSkill } from './ball/BallSkills.js';
import {GameManager} from './GameManager.js';
import { playerStats } from './player/PlayerStats.js';

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

  constructor(game: GameManager) {
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

    const statNames: Array<string> = ["acceleration", "max-rps", "jumps", "grip", "shock-absorber"]
    statNames.forEach(key =>
      document.getElementById(`upgrade-${key}-button`).addEventListener('click', this.upgradeStat.bind(this, key))
    );
    document.getElementById('upgrade-feed-button').addEventListener('click', this.feedTerry.bind(this));
    document.getElementById('upgrade-burp-button').addEventListener('click', this.burpTerry.bind(this));
    document.getElementById('add-free-points').addEventListener('click', this.addFivePoints.bind(this));
    document.getElementById('reset-level-grasslands').addEventListener('click', this.resetLevelGrasslands.bind(this));
    document.getElementById('reset-level-tarmac').addEventListener('click', this.resetLevelTarmac.bind(this));
    document.getElementById('reset-level-ice').addEventListener('click', this.resetLevelIce.bind(this));
    document.getElementById('reset-level-hell').addEventListener('click', this.resetLevelHell.bind(this));
    document.getElementById('reset-level-moon').addEventListener('click', this.resetLevelMoon.bind(this));
    document.getElementById('reset-level-holymoly').addEventListener('click', this.resetLevelHolyMoly.bind(this));
    const canvasContainer = document.getElementById('canvas');
    canvasContainer.addEventListener('touchstart', this.touchStartHandler);
    canvasContainer.addEventListener('touchend', this.touchEndHandler);
  }

  handleKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (!this.keys.get(event.key) || this.keys.get(event.key).cooldown <= performance.now()) {
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

  upgradeStat(skillKey: string): void {
    const stat: BallSkill = this.game.player.ball.skills.getSkill(skillKey)
    const nextUpgradeCost: number = stat.nextUpgradeCost();

    if(this.game.totalPoints >= nextUpgradeCost) {
      this.game.totalPoints -= nextUpgradeCost;
      stat.upgrade();

      document.getElementById('total-points-attribute').innerText = this.game.totalPoints.toFixed(1).toString();
      document.getElementById(`${skillKey}-attribute`).innerText = stat.currentValue.toFixed(1).toString();
      document.getElementById(`upgrade-${skillKey}-cost`).innerText = stat.nextUpgradeCost().toString();

      playerStats.addUpgradeBought(skillKey, nextUpgradeCost);

      if(stat.nextUpgradeCost() === Infinity) {
        document.getElementById(`upgrade-${skillKey}-button`).setAttribute('disabled', '');
      }
    } else {
      alert(`Not enough points to upgrade ${skillKey}!`);
    }
  }

  feedTerry(): void {
    if(this.game.player.ball.attributes.radius < 200) {
      this.game.player.ball.attributes.radius += 10;
      this.game.player.ball.position.y -= 10;
    }
  }
  
  burpTerry(): void {
    if(this.game.player.ball.attributes.radius > 10) {
      this.game.player.ball.attributes.radius -= 10;
      this.game.player.ball.position.y += 10;
    }
  }

  addFivePoints(): void {
    this.game.totalPoints += 5;
    document.getElementById('total-points-attribute').innerText = this.game.totalPoints.toFixed(1).toString();
  }
  
  touchStartHandler(event: TouchEvent) {
    const touchX = event.touches[0].clientX;
    const canvasWidth = document.getElementById('canvas').clientWidth;
    
    if (touchX < canvasWidth / 2) {
      this.leftScreenTouch = true;
    } else {
      this.rightScreenTouch = true;
    }
  }

  touchEndHandler() {
    this.leftScreenTouch = false;
    this.rightScreenTouch = false;
  }

  resetLevelGrasslands() {
    this.game.resetLevel('grasslands');
  }

  resetLevelTarmac() {
    this.game.resetLevel('tarmac');
  }

  resetLevelIce() {
    this.game.resetLevel('ice');
  }

  resetLevelHell() {
    this.game.resetLevel('hell');
  }

  resetLevelMoon() {
    this.game.resetLevel('moon');
  }

  resetLevelHolyMoly() {
    this.game.resetLevel('holymoly');
  }
}

export default InputManager;
