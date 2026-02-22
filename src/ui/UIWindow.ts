import { Vector } from "../utils/Vector.js";
import { UIButton, UIButtonOptions } from "./UIButton.js";
import { UIContainer } from "./UIContainer.js";
import { UITextOptions } from "./UIText.js";

class UIWindow extends UIContainer {
    closeButton: UIButton;

    constructor(name: string, position: Vector, size: Vector, backgroundColour: string, maxHeight: number) {
        super(name, position, size, backgroundColour, maxHeight);

        this.closeButton = new UIButton(
            `${name}-close-button`,
            new Vector(size.x - 45, 10),
            new Vector(35, 35),
            "X",
            () => {
                this.visible = false;
            },
            new UIButtonOptions({
                defaultBackgroundColour: "rgba(180, 100, 200, 0)",
                hoverBackgroundColour: "rgba(235, 165, 255, 0)",
                hoverTextColour: "black",
                hoverTrimColour: "rgba(255, 255, 0, 0)",
                buttonBorder: false,
            }),
            new UITextOptions({
                fontSize: 24,
                colour: "gray",
                textAlign: "center",
                textBaseline: "middle",
            }),
        );

        this.visible = false;

        this.addElement(this.closeButton);
    }

    draw(context: CanvasRenderingContext2D): void {
        super.draw(context);
    }
}

export { UIWindow };
