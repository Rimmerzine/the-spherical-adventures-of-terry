import { Vector } from "../utils/Vector.js";
import { UIElement } from "./UIElement.js";

class UIContainer extends UIElement {
    elements: Array<UIElement> = Array<UIElement>();
    backgroundColour: string;
    containerBorder: boolean;
    maxHeight: number;
    scrollPosition: number;

    constructor(name: string, position: Vector, size: Vector, backgroundColour: string, maxHeight: number = Infinity, containerBorder: boolean = true) {
        super(name, position, size);
        this.backgroundColour = backgroundColour;
        this.containerBorder = containerBorder;
        this.maxHeight = maxHeight;
        this.scrollPosition = 0;
    }

    draw(context: CanvasRenderingContext2D): void {
        if (this.visible) {
            context.lineWidth = 2;

            context.save();

            context.translate(this.position.x, this.position.y);

            context.beginPath();
            context.fillStyle = this.backgroundColour;

            context.rect(0, 0, this.size.x, this.size.y);
            context.fill();

            if (this.containerBorder) {
                context.stroke();
            }

            context.clip();

            context.translate(0, -this.scrollPosition);

            this.elements.forEach((element) => element.draw(context));

            context.restore();

            if (this.maxHeight < this.size.y) {
                context.beginPath();
                context.fillStyle = "lightgray";
                context.roundRect(
                    this.position.x + this.size.x - 15,
                    this.position.y + this.scrollPosition * (this.maxHeight / this.size.y),
                    10,
                    this.maxHeight ** 2 / this.size.y,
                    10,
                );
                context.fill();
            }
        }
    }

    handleMouseMovement(position: Vector, offset: Vector): void {
        const newOffset: Vector = offset.add(this.position).add(new Vector(0, -this.scrollPosition));
        this.elements.filter((element) => element.visible).forEach((element) => element.handleMouseMovement(position, newOffset));
    }

    handleMouseClick(position: Vector, offset: Vector): void {
        const newOffset: Vector = offset.add(this.position).add(new Vector(0, -this.scrollPosition));
        this.elements
            .filter((element) => element.visible && element.containsPoint(position, newOffset))
            .forEach((element) => element.handleMouseClick(position, newOffset));
    }

    handleScroll(position: Vector, offset: Vector, scrollAmount: number): void {
        this.elements.filter((element) => element.visible).forEach((element) => element.handleScroll(position, offset.add(this.position), scrollAmount));
        if (this.containsPoint(position, offset) && this.maxHeight < this.size.y) {
            if (scrollAmount >= 0) {
                this.scrollDown(scrollAmount);
            } else {
                this.scrollUp(scrollAmount);
            }
        }

        this.handleMouseMovement(position, offset);
    }

    scale(value: number): void {
        this.elements.forEach((element) => element.scale(value));
        this.position = this.position.multiply(value);
        this.size = this.size.multiply(value);
    }

    getElement(name: string): UIElement | undefined {
        if (this.name == name) {
            return this;
        } else {
            for (const element of this.elements) {
                const found = element.getElement(name);
                if (found) return found;
            }
            return undefined;
        }
    }

    getElementsAtPosition(position: Vector, offset: Vector): Array<UIElement> {
        const newOffset: Vector = offset.add(this.position).add(new Vector(0, -this.scrollPosition));
        if (this.visible && this.containsPoint(position, offset)) {
            const elementsAtPosition: Array<UIElement> = this.elements
                .filter((element) => element.visible)
                .flatMap((element) => element.getElementsAtPosition(position, newOffset));

            const lastElement = elementsAtPosition.pop();

            const containerElements = elementsAtPosition.filter((element) => element instanceof UIContainer);

            return Array(this, ...containerElements, lastElement);
        } else {
            return Array();
        }
    }

    scrollDown(value: number): void {
        this.scrollPosition = Math.min(this.scrollPosition + value, this.size.y - this.maxHeight);
    }

    scrollUp(value: number): void {
        this.scrollPosition = Math.max(this.scrollPosition + value, 0);
    }

    addElement(element: UIElement): void {
        this.elements.push(element);
    }

    addElements(...elements: UIElement[]): void {
        elements.forEach((element) => this.addElement(element));
    }
}

export { UIContainer };
