import { Vector } from "../utils/Vector.js";
import { UIButton, UIButtonOptions } from "./UIButton.js";
import { UITextOptions } from "./UIText.js";

class UIAttributeButton extends UIButton {
    attribute: () => number;
    lastAttribute: number;
    originalLabel: string;

    constructor(
        name: string,
        position: Vector,
        size: Vector,
        label: string,
        attribute: () => number,
        onClick: () => void,
        uiButtonOptions: UIButtonOptions,
        uiTextOptions: UITextOptions,
    ) {
        super(name, position, size, label, onClick, uiButtonOptions, uiTextOptions);
        this.attribute = attribute;
        this.originalLabel = label;
    }

    draw(context: CanvasRenderingContext2D) {
        const newAttribute = this.attribute();
        if (this.lastAttribute != newAttribute) {
            if (newAttribute % 1 == 0) {
                this.label = this.originalLabel.replace("{0}", this.attribute().toFixed(0));
            } else {
                this.label = this.originalLabel.replace("{0}", this.attribute().toFixed(2));
            }

            this.lastAttribute = this.attribute();
        }
        super.draw(context);
    }
}

export { UIAttributeButton };
