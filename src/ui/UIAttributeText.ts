import { Vector } from "../utils/Vector.js";
import { UIText, UITextOptions } from "./UIText.js";

class UIAttributeText extends UIText {
    originalText: string;
    attribute: () => number;
    lastAttribute: number;

    constructor(name: string, position: Vector, text: string, maxWidth: number, attribute: () => number, uiTextOptions: UITextOptions) {
        super(name, position, text.replace("{0}", attribute.toString()), maxWidth, uiTextOptions);
        this.originalText = text;
        this.attribute = attribute;
    }

    draw(context: CanvasRenderingContext2D): void {
        const newAttribute = this.attribute();
        if (this.lastAttribute != newAttribute) {
            if (newAttribute % 1 == 0) {
                this.text = this.originalText.replace("{0}", this.attribute().toFixed(0));
            } else {
                this.text = this.originalText.replace("{0}", this.attribute().toFixed(2));
            }

            this.lastAttribute = this.attribute();
        }
        super.draw(context);
    }
}

export { UIAttributeText };
