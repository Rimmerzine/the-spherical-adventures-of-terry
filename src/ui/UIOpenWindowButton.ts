import { Vector } from "../utils/Vector.js";
import { UIButton, UIButtonOptions } from "./UIButton.js";
import { UITextOptions } from "./UIText.js";
import { UIWindow } from "./UIWindow.js";

class UIOpenWindowButton extends UIButton {
    window: UIWindow;

    constructor(name: string, position: Vector, size: Vector, label: string, window: UIWindow, uiButtonOptions: UIButtonOptions, uiTextOptions: UITextOptions) {
        super(
            name,
            position,
            size,
            label,
            () => {
                window.visible = true;
            },
            uiButtonOptions,
            uiTextOptions,
        );
        this.window = window;
    }
}

export { UIOpenWindowButton };
