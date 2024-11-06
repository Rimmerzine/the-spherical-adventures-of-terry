import {Ball} from './ball/Ball.js';
import {BallSkill} from './ball/BallSkills.js';
import {GameManager} from './GameManager.js';
import {playerStats} from './player/PlayerStats.js';

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
    this.bindEventHandlers();
    this.attachEventListeners();
  }

  bindEventHandlers() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchEndHandler = this.touchEndHandler.bind(this);
    this.upgradeStat = this.upgradeStat.bind(this);
    this.feedTerry = this.feedTerry.bind(this);
    this.burpTerry = this.burpTerry.bind(this);
    this.addFivePoints = this.addFivePoints.bind(this);
    this.resetLevel = this.resetLevel.bind(this);
  }

  attachEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.attachButtonClickListeners();
    const canvasContainer = document.getElementById('canvas');
    canvasContainer.addEventListener('touchstart', this.touchStartHandler);
    canvasContainer.addEventListener('touchend', this.touchEndHandler);
  }

  attachButtonClickListeners() {
    const statNames = ["acceleration", "max-rps", "jumps", "grip", "shock-absorber"];
    statNames.forEach(key =>
      document.getElementById(`upgrade-${key}-button`).addEventListener('click', () => this.upgradeStat(key))
    );
    document.getElementById('upgrade-feed-button').addEventListener('click', this.feedTerry);
    document.getElementById('upgrade-burp-button').addEventListener('click', this.burpTerry);
    document.getElementById('add-free-points').addEventListener('click', this.addFivePoints);
    this.attachLevelResetListeners();
  }

  attachLevelResetListeners() {
    const levels = ['grasslands', 'tarmac', 'ice', 'hell', 'moon', 'holymoly', 'experimental'];
    levels.forEach(level =>
      document.getElementById(`reset-level-${level}`).addEventListener('click', () => this.resetLevel(level))
    );
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
    return this.leftScreenTouch || (this.keys.get('a') && this.keys.get('a').pressed) || false;
  }

  isRightPressed(): boolean {
    return this.rightScreenTouch || (this.keys.get('d') && this.keys.get('d').pressed) || false;
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
    const ball: Ball = this.game.player.ball;
    if(ball.attributes.radius < 200) {
      ball.attributes.radius += 10;
      ball.position.y -= 10;
    }
  }
  
  burpTerry(): void {
    const ball: Ball = this.game.player.ball;
    if(ball.attributes.radius > 10) {
      ball.attributes.radius -= 10;
      ball.position.y += 10;
    }
  }

  addFivePoints(): void {
    this.game.totalPoints += 5;
    document.getElementById('total-points-attribute').innerText = this.game.totalPoints.toFixed(1).toString();
  }
  
  touchStartHandler(event: TouchEvent) {
    const touchX = event.touches[0].clientX;
    const canvasWidth = document.getElementById('canvas').clientWidth;
    this.leftScreenTouch = touchX < canvasWidth / 2;
    this.rightScreenTouch = !this.leftScreenTouch;
  }

  touchEndHandler() {
    this.leftScreenTouch = false;
    this.rightScreenTouch = false;
  }

  resetLevel(level: string) {
    this.game.resetLevel(level);
  }
}

export {InputManager};
