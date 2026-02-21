import { Vector } from "../utils/Vector.js";
import { UIAttributeText } from "./UIAttributeText.js";
import { UIContainer } from "./UIContainer.js";
import { UIText, UITextOptions } from "./UIText.js";

class UILabelledAttribute extends UIContainer {
    heading: UIText;
    attribute: UIAttributeText;

    constructor(name: string, position: Vector, width: number, heading: string, attributeText: string, attribute: () => number) {
        super(name, position, new Vector(width, 90), "rgba(0, 0, 0, 0)", Infinity, false);

        const headingElement = new UIText(
            `${name}-heading`,
            new Vector(0, 0),
            heading,
            width,
            new UITextOptions({
                fontSize: 16,
                fontModifier: "bold",
            }),
        );

        const attributeElement = new UIAttributeText(
            `${name}-attribute`,
            new Vector(0, 25),
            attributeText,
            width,
            attribute,
            new UITextOptions({
                fontSize: 16,
            }),
        );

        this.heading = headingElement;
        this.attribute = attributeElement;

        this.addElements(headingElement, attributeElement);
    }
}

export { UILabelledAttribute };
