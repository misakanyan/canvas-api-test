namespace engine {

    export class Point {
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    export class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x: number, y: number, width: number, height: number) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        
        isPointInRectangle(testX: number, testY: number) {
            if (isInRange(this.x, testX, this.x + this.width) && isInRange(this.y, testY, this.y + this.height)) {
                return true;
            } else {
                return false;
            }
        }
    }

    export function isInRange(min: number, testNum: number, max: number) {
        if (testNum >= min && testNum <= max) {
            return true;
        } else {
            return false;
        }
    }

    export function pointAppendMatrix(point: Point, m: Matrix): Point {
        var x = m.m11 * point.x + m.m12 * point.y + m.dx;
        var y = m.m21 * point.x + m.m22 * point.y + m.dy;
        return new Point(x, y);

    }

    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    export function invertMatrix(m: Matrix): Matrix {


        var a = m.m11;
        var b = m.m21;
        var c = m.m12;
        var d = m.m22;
        var tx = m.dx;
        var ty = m.dy;

        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }

        determinant = 1 / determinant;
        var k = result.m11 = d * determinant;
        b = result.m21 = -b * determinant;
        c = result.m12 = -c * determinant;
        d = result.m22 = a * determinant;
        result.dx = -(k * tx + c * ty);
        result.dy = -(b * tx + d * ty);
        return result;

    }

    export function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix {

        var result = new Matrix();
        result.m11 = m1.m11 * m2.m11 + m1.m21 * m2.m12;
        result.m21 = m1.m11 * m2.m21 + m1.m21 * m2.m22;
        result.m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22;
        result.m22 = m2.m21 * m1.m12 + m1.m22 * m2.m22;
        result.dx = m2.m11 * m1.dx + m2.m12 * m1.dy + m2.dx;
        result.dy = m2.m21 * m1.dx + m2.m22 * m1.dy + m2.dy;
        return result;
    }

    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD: number = Math.PI / 180;


    export class Matrix {

        constructor(m11: number = 1, m21: number = 0, m12: number = 0, m22: number = 1, dx: number = 0, dy: number = 0) {
            this.m11 = m11;
            this.m21 = m21;
            this.m12 = m12;
            this.m22 = m22;
            this.dx = dx;
            this.dy = dy;
        }

        public m11: number;

        public m21: number;

        public m12: number;

        public m22: number;

        public dx: number;

        public dy: number;

        public toString(): string {
            return "(a=" + this.m11 + ", b=" + this.m21 + ", c=" + this.m12 + ", d=" + this.m22 + ", tx=" + this.dx + ", ty=" + this.dy + ")";
        }

        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number) {
            this.dx = x;
            this.dy = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;

            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.m11 = Math.cos(skewY) * scaleX;
            this.m21 = Math.sin(skewY) * scaleX;
            this.m12 = -v * scaleY;
            this.m22 = u * scaleY;

        }
    }
}