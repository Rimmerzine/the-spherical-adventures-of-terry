import { Vector } from "../utils/Vector.js";

abstract class UIElement {
    name: string;
    position: Vector;
    size: Vector;
    visible: boolean = true;

    constructor(name: string, position: Vector, size: Vector) {
        this.name = name;
        this.position = position;
        this.size = size;
    }

    abstract draw(context: CanvasRenderingContext2D): void;
    abstract handleMouseMovement(position: Vector, offset: Vector): void;
    abstract handleMouseClick(position: Vector, offset: Vector): void;
    abstract handleScroll(position: Vector, offset: Vector, scrollAmount: number): void;
    abstract scale(value: number): void;
    abstract getElement(name: string): UIElement | undefined;
    abstract getElementsAtPosition(position: Vector, offset: Vector): Array<UIElement>;

    containsPoint(position: Vector, offset: Vector): boolean {
        const absolutePosition = this.position.add(offset);
        const left = absolutePosition.x;
        const top = absolutePosition.y;
        const right = absolutePosition.x + this.size.x;
        const bottom = absolutePosition.y + this.size.y;

        return position.x > left && position.x < right && position.y > top && position.y < bottom;
    }
}

export { UIElement };
