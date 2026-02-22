import { Vector } from "../utils/Vector.js";
import { UIElement } from "./UIElement.js";
import { UITextOptions } from "./UIText.js";

class UIButton extends UIElement {
    label: string;
    onClick: () => void;
    uiButtonOptions: UIButtonOptions;
    uiTextOptions: UITextOptions;
    state: ButtonState = "default";

    constructor(
        name: string,
        position: Vector,
        size: Vector,
        label: string,
        onClick: () => void,
        uiButtonOptions: UIButtonOptions,
        uiTextOptions: UITextOptions,
    ) {
        super(name, position, size);
        this.label = label;
        this.onClick = onClick;
        this.uiButtonOptions = uiButtonOptions;
        this.uiTextOptions = uiTextOptions;
    }

    draw(context: CanvasRenderingContext2D): void {
        if (this.visible) {
            if (this.state == "hover") {
                this.drawHoverButton(context);
            } else {
                this.drawBasicButton(context);
            }
        }
    }

    handleMouseMovement(position: Vector, offset: Vector): void {
        if (this.state == "default" && this.containsPoint(position, offset)) {
            this.state = "hover";
        } else if (this.state == "hover" && !this.containsPoint(position, offset)) {
            this.state = "default";
        }
    }

    handleMouseClick(position: Vector, offset: Vector): void {
        if (this.containsPoint(position, offset)) {
            this.onClick();
        }
    }

    handleScroll(position: Vector, offset: Vector, scrollAmount: number): void {}

    scale(value: number): void {
        this.position = this.position.multiply(value);
        this.size = this.size.multiply(value);
    }

    getElement(name: string): UIElement | undefined {
        if (this.name == name) return this;
        else return undefined;
    }

    getElementsAtPosition(position: Vector, offset: Vector): Array<UIElement> {
        if (this.visible && this.containsPoint(position, offset)) {
            return Array(this);
        } else {
            return Array();
        }
    }

    drawButtonText(context: CanvasRenderingContext2D, colour: string): void {
        this.uiTextOptions.applyTextOptions(context);
        context.beginPath();
        context.fillStyle = colour;
        context.fillText(this.label, this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
    }

    drawBasicButton(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.rect(this.position.x, this.position.y, this.size.x, this.size.y);

        context.fillStyle = this.uiButtonOptions.defaultBackgroundColour;
        context.fill();

        if (this.uiButtonOptions.buttonBorder) {
            context.strokeStyle = "black";
            context.stroke();
        }

        this.drawButtonText(context, this.uiTextOptions.colour);
    }

    drawHoverButton(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.rect(this.position.x, this.position.y, this.size.x, this.size.y);

        context.fillStyle = this.uiButtonOptions.hoverTrimColour;
        context.fill();

        context.beginPath();
        context.rect(this.position.x + 3, this.position.y + 3, this.size.x - 6, this.size.y - 6);

        context.fillStyle = this.uiButtonOptions.hoverBackgroundColour;
        context.fill();

        if (this.uiButtonOptions.buttonBorder) {
            context.strokeStyle = "black";
            context.stroke();
        }

        this.drawButtonText(context, this.uiButtonOptions.hoverTextColour);
    }
}

type UIButtonOptionsParams = {
    defaultBackgroundColour: string;
    hoverBackgroundColour: string;
    hoverTrimColour: string;
    hoverTextColour: string;
    buttonBorder?: boolean;
};

class UIButtonOptions {
    defaultBackgroundColour: string;
    hoverBackgroundColour: string;
    hoverTrimColour: string;
    hoverTextColour: string;
    buttonBorder: boolean;

    constructor({ defaultBackgroundColour, hoverBackgroundColour, hoverTrimColour, hoverTextColour, buttonBorder = true }: UIButtonOptionsParams) {
        this.defaultBackgroundColour = defaultBackgroundColour;
        this.hoverBackgroundColour = hoverBackgroundColour;
        this.hoverTrimColour = hoverTrimColour;
        this.hoverTextColour = hoverTextColour;
        this.buttonBorder = buttonBorder;
    }
}

type ButtonState = "default" | "hover";

export { UIButton, UIButtonOptions };
