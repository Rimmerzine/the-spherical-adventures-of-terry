class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector): Vector {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    multiply(scaler: number): Vector {
        return new Vector(this.x * scaler, this.y * scaler);
    }

    unit(): Vector {
        const magnitude = this.magnitude();
        if(magnitude !== 0) {
            return new Vector(this.x / magnitude, this.y / magnitude);
        } else {
            return new Vector(0, 0);
        }
    }

    normal(clockwise: boolean = false): Vector {
        if (clockwise) {
            return new Vector(-this.y, this.x).unit();
        } else {
            return new Vector(this.y, -this.x).unit();
        }
    }

    static dot(vectorOne: Vector, vectorTwo: Vector): number {
        return vectorOne.x * vectorTwo.x + vectorOne.y * vectorTwo.y;
    }

    static cross(vectorOne: Vector, vectorTwo: Vector): number {
        return vectorOne.x * vectorTwo.y - vectorOne.y * vectorTwo.x;
    }
}

export {Vector}
