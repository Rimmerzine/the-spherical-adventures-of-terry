import { Vector } from "../utils/Vector.js";
import { UIElement } from "./UIElement.js";

class UIText extends UIElement {
    text: string;
    maxWidth: number;
    uiTextOptions: UITextOptions;

    constructor(name: string, position: Vector, text: string, maxWidth: number, uiTextOptions: UITextOptions) {
        super(name, position, new Vector(maxWidth, uiTextOptions.fontSize));

        this.maxWidth = maxWidth;
        this.uiTextOptions = uiTextOptions;
        this.text = text;
    }

    draw(context: CanvasRenderingContext2D): void {
        if (this.visible) {
            this.uiTextOptions.applyTextOptions(context);
            let textLines = getLines(context, this.text, this.maxWidth);
            this.size = new Vector(
                Math.ceil(Math.min(this.maxWidth, context.measureText(this.text).width)),
                this.uiTextOptions.fontSize * textLines.length + this.uiTextOptions.fontSize * 0.5 * (textLines.length - 1),
            );

            this.uiTextOptions.applyTextOptions(context);

            textLines.forEach((line, index) => context.fillText(line, this.position.x, this.position.y + index * this.uiTextOptions.fontSize * 1.5));
        }
    }

    handleMouseMovement(position: Vector, offset: Vector): void {}

    handleMouseClick(position: Vector, offset: Vector): void {}

    handleScroll(position: Vector, offset: Vector, scrollAmount: number): void {}

    scale(value: number): void {}

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

    changeText(newText: string): void {
        this.text = newText;
    }
}

type UITextOptionsParams = {
    fontSize: number;
    fontFamily?: string;
    fontModifier?: string;
    colour?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
};

class UITextOptions {
    fontSize: number;
    fontFamily: string;
    fontModifier: string;
    colour: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;

    constructor({ fontSize, fontFamily = "Arial", fontModifier = "", colour = "black", textAlign = "left", textBaseline = "top" }: UITextOptionsParams) {
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.fontModifier = fontModifier;
        this.colour = colour;
        ((this.textAlign = textAlign), (this.textBaseline = textBaseline));
    }

    applyTextOptions(context: CanvasRenderingContext2D) {
        context.font = `${this.fontModifier} ${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.colour;
        context.textAlign = this.textAlign;
        context.textBaseline = this.textBaseline;
    }
}

function getLines(context: CanvasRenderingContext2D, text: string, maxWidth: number): Array<string> {
    const words: Array<string> = text.split(" ");
    const lines: Array<string> = Array<string>();
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

export { UIText, UITextOptions };
