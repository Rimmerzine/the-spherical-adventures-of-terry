class InputManager {
  constructor() {
    this.keys = {};

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    this.keys[event.key] = true;
  }

  handleKeyUp(event) {
    this.keys[event.key] = false;
  }

  isLeftPressed() {
    return this.keys["a"];
  }

  isRightPressed() {
    return this.keys["d"];
  }
}

export default InputManager;
