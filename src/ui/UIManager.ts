import { Vector } from "../utils/Vector.js";
import { UIButton } from "./UIButton.js";
import { UIContainer } from "./UIContainer.js";
import { UIElement } from "./UIElement.js";

class UIManager {
    windowContainer: UIContainer;

    currentClickableElement: UIButton;
    currentScrollableElement: UIContainer;

    constructor() {}

    setWindowContainer(windowContainer: UIContainer) {
        this.windowContainer = windowContainer;
    }

    handleMouseMovement(mousePosition: Vector): void {
        const allElementsAtPosition: Array<UIElement> = this.windowContainer.getElementsAtPosition(mousePosition, new Vector(0, 0));
        const allButtonsAtPosition: Array<UIButton> = allElementsAtPosition.filter((element) => element instanceof UIButton);
        const allScrollableContainersAtPosition: Array<UIContainer> = allElementsAtPosition
            .filter((element) => element instanceof UIContainer)
            .filter((element) => element.maxHeight <= element.size.y);
        const identifiedButton = allButtonsAtPosition.at(-1);
        const identifiedScrollableContainer = allScrollableContainersAtPosition.at(-1);

        if (identifiedButton) {
            if (this.currentClickableElement != identifiedButton) {
                if (this.currentClickableElement) {
                    this.currentClickableElement.state = "default";
                    this.currentClickableElement = identifiedButton;
                    this.currentClickableElement.state = "hover";
                } else {
                    this.currentClickableElement = identifiedButton;
                    this.currentClickableElement.state = "hover";
                }
            }
        } else {
            if (this.currentClickableElement) {
                this.currentClickableElement.state = "default";
            }
            this.currentClickableElement = null;
        }

        this.currentScrollableElement = identifiedScrollableContainer;
    }

    handleMouseClick(mousePosition: Vector): void {
        this.handleMouseMovement(mousePosition);
        if (this.currentClickableElement) {
            this.currentClickableElement.onClick();
        }
    }

    handleScroll(mousePosition: Vector, scrollAmount: number): void {
        this.handleMouseMovement(mousePosition);
        if (this.currentScrollableElement) {
            if (scrollAmount >= 0) {
                this.currentScrollableElement.scrollDown(scrollAmount);
            } else {
                this.currentScrollableElement.scrollUp(scrollAmount);
            }
        }
    }

    getElementByName(name: string): UIElement | undefined {
        return this.windowContainer.getElement(name);
    }
}

const uiManager: UIManager = new UIManager();

export { uiManager };
