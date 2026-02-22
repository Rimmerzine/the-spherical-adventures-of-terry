import { Vector } from "../utils/Vector.js";
import { UIAttributeButton } from "./UIAttributeButton.js";
import { UIAttributeText } from "./UIAttributeText.js";
import { UIButton, UIButtonOptions } from "./UIButton.js";
import { UIContainer } from "./UIContainer.js";
import { UIText, UITextOptions } from "./UIText.js";

class UISkillUpgradeSection extends UIContainer {
    heading: UIText;
    attribute: UIAttributeText;
    button: UIAttributeButton;

    originalButtonText: string;

    constructor(
        name: string,
        position: Vector,
        width: number,
        heading: string,
        attributeText: string,
        attribute: () => number,
        buttonText: string,
        buttonAttribute: () => number,
        buttonAction: () => void,
    ) {
        super(name, position, new Vector(width, 90), "rgba(0, 0, 0, 0)", Infinity, false);

        this.originalButtonText = buttonText;

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

        const buttonElement = new UIAttributeButton(
            `${name}-button`,
            new Vector(0, 50),
            new Vector(width, 40),
            buttonText,
            buttonAttribute,
            buttonAction,
            new UIButtonOptions({
                defaultBackgroundColour: "rgb(25, 135, 84)",
                hoverBackgroundColour: "rgb(0, 100, 0)",
                hoverTextColour: "white",
                hoverTrimColour: "rgb(255, 255, 0)",
                buttonBorder: false,
            }),
            new UITextOptions({
                fontSize: 16,
                colour: "white",
                textAlign: "center",
                textBaseline: "middle",
            }),
        );

        this.heading = headingElement;
        this.attribute = attributeElement;
        this.button = buttonElement;

        this.addElements(headingElement, attributeElement, buttonElement);
    }
}

export { UISkillUpgradeSection };
