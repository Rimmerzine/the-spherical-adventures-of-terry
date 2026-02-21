import { Ball } from "./ball/Ball.js";
import { camera } from "./Camera.js";
import { Vector } from "./utils/Vector.js";
import { BackgroundObject } from "./background/BackgroundObject.js";
import { DebugSettings, GameSettings } from "./Settings.js";
import { Segment, Terrain } from "./terrain/Terrain.js";
import { CollectablePoint, Level } from "./level/Level.js";
import { uiManager } from "./ui/UIManager.js";

class CanvasRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    draw(level: Level, ball: Ball): void {
        this.drawSky(level.skyColour);
        this.drawBackgroundObjects(level.backgroundObjects);
        this.drawCollectables(level.collectables);
        this.drawQuadraticFloor(level.terrain);

        this.drawBall(ball);
        this.drawFps(GameSettings.fps);
        this.drawUserInterface();
        if (DebugSettings.debugMode) {
            this.drawDebugInformation(ball);
        }
    }

    drawFps(fps: number): void {
        this.context.font = "24px arial";
        this.context.textBaseline = "top";
        this.context.fillText(`${fps} fps`, 20, 20);
    }

    drawUserInterface(): void {
        uiManager.windowContainer.draw(this.context);
    }

    drawBall(ball: Ball): void {
        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;
        const cameraCanvasOffsetX: number = camera.getPosition().x - canvasWidth / 2;
        const cameraCanvasOffsetY: number = camera.getPosition().y - canvasHeight / 2;

        ball.draw(this.context, cameraCanvasOffsetX, cameraCanvasOffsetY);
    }

    drawSky(skyColour: string): void {
        this.context.fillStyle = skyColour;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawQuadraticFloor(terrain: Terrain): void {
        const cameraPosition: Vector = camera.getPosition();
        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;
        const canvasMapLeft: number = cameraPosition.x - canvasWidth / 2;
        const canvasMapRight: number = canvasMapLeft + canvasWidth;
        const cameraCanvasOffsetX: number = camera.getPosition().x - canvasWidth / 2;
        const cameraCanvasOffsetY: number = camera.getPosition().y - canvasHeight / 2;

        const visibleTerrain = terrain.segments.filter((floor) => {
            const previousMidPoint: number = floor.previousMidPoint.x;
            const nextMidPoint: number = floor.nextMidPoint.x;
            return nextMidPoint >= canvasMapLeft && previousMidPoint <= canvasMapRight;
        });

        this.context.lineWidth = 21;
        this.context.strokeStyle = terrain.settings.surfaceColour;
        this.context.fillStyle = terrain.settings.subsurfaceColour;

        this.context.beginPath();

        for (let i = 0; i < visibleTerrain.length; i++) {
            const currentSegment: Segment = visibleTerrain[i];

            const visualX1: number = currentSegment.previousMidPoint.x - cameraCanvasOffsetX;
            const visualY1: number = currentSegment.previousMidPoint.y - cameraCanvasOffsetY;
            const cpx = currentSegment.position.x - cameraCanvasOffsetX;
            const cpy = currentSegment.position.y - cameraCanvasOffsetY;
            const visualX2: number = currentSegment.nextMidPoint.x - cameraCanvasOffsetX;
            const visualY2: number = currentSegment.nextMidPoint.y - cameraCanvasOffsetY;

            this.context.moveTo(visualX1, visualY1);
            this.context.quadraticCurveTo(cpx, cpy, visualX2, visualY2);
        }

        this.context.stroke();

        this.context.beginPath();

        for (let i = 0; i < visibleTerrain.length; i++) {
            const currentSegment: Segment = visibleTerrain[i];

            const visualX1: number = Math.floor(currentSegment.previousMidPoint.x - cameraCanvasOffsetX);
            const visualY1: number = Math.floor(currentSegment.previousMidPoint.y - cameraCanvasOffsetY);
            const cpx = Math.floor(currentSegment.position.x - cameraCanvasOffsetX);
            const cpy = Math.floor(currentSegment.position.y - cameraCanvasOffsetY);
            const visualX2: number = Math.floor(currentSegment.nextMidPoint.x - cameraCanvasOffsetX);
            const visualY2: number = Math.floor(currentSegment.nextMidPoint.y - cameraCanvasOffsetY);

            let lowestY: number = Math.max(visualY1, visualY2, cpy);

            this.context.beginPath();
            this.context.moveTo(visualX1, lowestY);
            this.context.lineTo(visualX1, visualY1);
            this.context.quadraticCurveTo(cpx, cpy, visualX2, visualY2);
            this.context.lineTo(visualX2, lowestY);
            this.context.fill();

            this.context.fillRect(visualX1, lowestY, visualX2 - visualX1, canvasHeight - lowestY);
        }
    }

    drawBackgroundObjects(backgroundObjects: Array<BackgroundObject>) {
        const cameraPosition = camera.getPosition();
        const cameraPositionX = cameraPosition.x;
        const cameraPositionY = cameraPosition.y;

        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;

        const canvasMapLeft = cameraPositionX - canvasWidth / 2;
        const canvasMapRight = canvasMapLeft + canvasWidth;
        const canvasMapTop = cameraPositionY - canvasHeight / 2;
        const canvasMapBottom = canvasMapTop + canvasHeight;

        const cameraCanvasOffsetX: number = cameraPositionX - canvasWidth / 2;
        const cameraCanvasOffsetY: number = cameraPositionY - canvasHeight / 2;

        const visibleBackgroundObjects: Array<BackgroundObject> = backgroundObjects.filter((backgroundObject) => {
            const isHeightless: boolean = backgroundObject.type == "heightless";
            const objectLeft: number = backgroundObject.position.x - backgroundObject.width / 2;
            const objectUp: number = backgroundObject.position.y - backgroundObject.height / 2 + cameraCanvasOffsetY / 2;
            const objectRight: number = objectLeft + backgroundObject.width;
            const objectDown: number = objectUp + backgroundObject.height;

            const isNotOffscreenToTheLeft = objectRight >= canvasMapLeft;
            const isNotOffscreenToTheRight = objectLeft <= canvasMapRight;
            const isNotOffscreenAbove = objectDown >= canvasMapTop;
            const isNotOffscreenBelow = objectUp <= canvasMapBottom;

            return isNotOffscreenToTheLeft && isNotOffscreenToTheRight && (isHeightless || (isNotOffscreenAbove && isNotOffscreenBelow));
        });

        for (let i = 0; i < visibleBackgroundObjects.length; i++) {
            const backgroundObject = visibleBackgroundObjects[i];
            backgroundObject.draw(this.context, cameraCanvasOffsetX, cameraCanvasOffsetY);
        }
    }

    drawCollectables(collectables: Array<CollectablePoint>) {
        const cameraPosition = camera.getPosition();
        const cameraPositionX = cameraPosition.x;
        const cameraPositionY = cameraPosition.y;

        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;

        const canvasMapLeft = cameraPositionX - canvasWidth / 2;
        const canvasMapRight = canvasMapLeft + canvasWidth;
        const canvasMapTop = cameraPositionY - canvasHeight / 2;
        const canvasMapBottom = canvasMapTop + canvasHeight;

        const cameraCanvasOffsetX: number = cameraPositionX - canvasWidth / 2;
        const cameraCanvasOffsetY: number = cameraPositionY - canvasHeight / 2;

        const visibleCollectables = collectables.filter((collectable) => {
            const objectLeft: number = collectable.position.x - CollectablePoint.size / 2;
            const objectUp: number = collectable.position.y - CollectablePoint.size / 2;
            const objectRight: number = objectLeft + CollectablePoint.size;
            const objectDown: number = objectUp + CollectablePoint.size;

            const isNotOffscreenToTheLeft = objectRight >= canvasMapLeft;
            const isNotOffscreenToTheRight = objectLeft <= canvasMapRight;
            const isNotOffscreenAbove = objectDown >= canvasMapTop;
            const isNotOffscreenBelow = objectUp <= canvasMapBottom;

            return isNotOffscreenToTheLeft && isNotOffscreenToTheRight && isNotOffscreenAbove && isNotOffscreenBelow;
        });

        for (let i = 0; i < visibleCollectables.length; i++) {
            const collectable = visibleCollectables[i];
            collectable.draw(this.context, cameraCanvasOffsetX, cameraCanvasOffsetY);
        }
    }

    clearCanvas(backgroundColour: string) {
        this.context.fillStyle = backgroundColour;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawDebugInformation(ball: Ball) {
        this.drawClosestPositionOnFloor(ball);
        this.drawNormalisedDisplacementVector(ball);
        this.drawBallVelocity(ball);
        this.drawReflectionVector(ball);
        this.drawCollisionFloors(ball);
        this.drawMovementLines(ball);
    }

    drawMovementLines(ball: Ball) {
        const canvasWidth: number = this.canvas.width;
        const multiplier: number = (2 * Math.PI * ball.attributes.radius) / 8;

        if (DebugSettings.drawMovementLines) {
            for (let i = -3; i <= 3; i++) {
                const x: number = i * multiplier;

                this.context.beginPath();
                this.context.moveTo(x + canvasWidth / 2 - (ball.position.x % multiplier), this.canvas.height);
                this.context.lineTo(x + canvasWidth / 2 - (ball.position.x % multiplier), 0);
                this.context.lineWidth = 1;
                this.context.stroke();
            }
        }
    }

    drawClosestPositionOnFloor(ball: Ball) {
        const ballPosition = ball.position;
        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;
        const cameraCanvasOffsetX: number = ballPosition.x - canvasWidth / 2;
        const cameraCanvasOffsetY: number = ballPosition.y - canvasHeight / 2;

        if (DebugSettings.closestPoint) {
            const position = DebugSettings.closestPoint;

            this.context.strokeStyle = "black";
            this.context.fillStyle = "purple";
            this.context.lineWidth = 3;
            this.context.beginPath();
            this.context.arc(position.x - cameraCanvasOffsetX, position.y - cameraCanvasOffsetY, 5, 0, 2 * Math.PI);
            this.context.stroke();
            this.context.fill();
        }
    }

    drawNormalisedDisplacementVector(ball: Ball) {
        const ballPosition = ball.position;
        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;
        const cameraCanvasOffsetX: number = ballPosition.x - canvasWidth / 2;
        const cameraCanvasOffsetY: number = ballPosition.y - canvasHeight / 2;

        if (DebugSettings.closestPoint && DebugSettings.normalisedDisplacementVector) {
            const startPosition = DebugSettings.closestPoint;
            const vector = DebugSettings.normalisedDisplacementVector.multiply(100);
            const endPosition = startPosition.add(vector);
            this.context.beginPath();
            this.context.strokeStyle = "red";
            this.context.moveTo(startPosition.x - cameraCanvasOffsetX, startPosition.y - cameraCanvasOffsetY);
            this.context.lineTo(endPosition.x - cameraCanvasOffsetX, endPosition.y - cameraCanvasOffsetY);
            this.context.stroke();
        }
    }

    drawBallVelocity(ball: Ball) {
        const startPosition = ball.position;
        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;
        const cameraCanvasOffsetX: number = startPosition.x - canvasWidth / 2;
        const cameraCanvasOffsetY: number = startPosition.y - canvasHeight / 2;

        const endPosition = ball.position.add(ball.attributes.velocity.multiply(0.25));

        this.context.beginPath();
        this.context.strokeStyle = "green";
        this.context.moveTo(startPosition.x - cameraCanvasOffsetX, startPosition.y - cameraCanvasOffsetY);
        this.context.lineTo(endPosition.x - cameraCanvasOffsetX, endPosition.y - cameraCanvasOffsetY);
        this.context.stroke();
    }

    drawReflectionVector(ball: Ball) {
        const ballPosition = ball.position;
        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;
        const cameraCanvasOffsetX: number = ballPosition.x - canvasWidth / 2;
        const cameraCanvasOffsetY: number = ballPosition.y - canvasHeight / 2;

        if (DebugSettings.closestPoint && DebugSettings.reflectionVector) {
            const startPosition = DebugSettings.closestPoint;
            const vector = DebugSettings.reflectionVector;
            const endPosition = DebugSettings.closestPoint.add(vector.multiply(2));

            this.context.beginPath();
            this.context.strokeStyle = "purple";
            this.context.moveTo(startPosition.x - cameraCanvasOffsetX, startPosition.y - cameraCanvasOffsetY);
            this.context.lineTo(endPosition.x - cameraCanvasOffsetX, endPosition.y - cameraCanvasOffsetY);
            this.context.stroke();
            this.context.closePath();
        }
    }

    drawCollisionFloors(ball: Ball) {
        const ballPosition = ball.position;
        const canvasWidth: number = this.canvas.width;
        const canvasHeight: number = this.canvas.height;
        const cameraCanvasOffsetX: number = ballPosition.x - canvasWidth / 2;
        const cameraCanvasOffsetY: number = ballPosition.y - canvasHeight / 2;

        if (DebugSettings.collisionFloors) {
            this.context.beginPath();
            this.context.lineWidth = 3;
            this.context.strokeStyle = "yellow";

            this.context.beginPath();

            for (let i = 0; i < DebugSettings.collisionFloors.length; i++) {
                const currentSegment: Segment = DebugSettings.collisionFloors[i];

                const visualX1: number = currentSegment.previousMidPoint.x - cameraCanvasOffsetX;
                const visualY1: number = currentSegment.previousMidPoint.y - cameraCanvasOffsetY;
                const cpx = currentSegment.position.x - cameraCanvasOffsetX;
                const cpy = currentSegment.position.y - cameraCanvasOffsetY;
                const visualX2: number = currentSegment.nextMidPoint.x - cameraCanvasOffsetX;
                const visualY2: number = currentSegment.nextMidPoint.y - cameraCanvasOffsetY;

                this.context.moveTo(visualX1, visualY1);
                this.context.quadraticCurveTo(cpx, cpy, visualX2, visualY2);
            }

            this.context.stroke();

            for (let i = 0; i < DebugSettings.collisionFloors.length; i++) {
                const currentSegment: Segment = DebugSettings.collisionFloors[i];

                this.context.strokeStyle = "blue";

                this.context.beginPath();
                this.context.arc(
                    currentSegment.previousMidPoint.x - cameraCanvasOffsetX,
                    currentSegment.previousMidPoint.y - cameraCanvasOffsetY,
                    5,
                    0,
                    2 * Math.PI,
                );
                this.context.stroke();

                this.context.beginPath();
                this.context.arc(currentSegment.nextMidPoint.x - cameraCanvasOffsetX, currentSegment.nextMidPoint.y - cameraCanvasOffsetY, 5, 0, 2 * Math.PI);
                this.context.stroke();

                this.context.strokeStyle = "red";

                this.context.beginPath();
                this.context.arc(currentSegment.position.x - cameraCanvasOffsetX, currentSegment.position.y - cameraCanvasOffsetY, 10, 0, 2 * Math.PI);
                this.context.stroke();
            }
        }
    }
}

export { CanvasRenderer };
