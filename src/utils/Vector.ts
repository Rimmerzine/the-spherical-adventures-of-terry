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

    dot(vector: Vector): number {
        return this.x * vector.x + this.y * vector.y
    }

    cross(vector: Vector): number {
        return this.x * vector.y - this.y * vector.x
    }
}

export {Vector}
