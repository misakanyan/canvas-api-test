var math;
(function (math) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    math.Point = Point;
    function pointAppendMatrix(point, m) {
        var x = m.m11 * point.x + m.m12 * point.y + m.dx;
        var y = m.m21 * point.x + m.m22 * point.y + m.dy;
        return new Point(x, y);
    }
    math.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
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
    math.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.m11 = m1.m11 * m2.m11 + m1.m21 * m2.m12;
        result.m21 = m1.m11 * m2.m21 + m1.m21 * m2.m22;
        result.m12 = m2.m11 * m1.m12 + m2.m12 * m1.m22;
        result.m22 = m2.m21 * m1.m12 + m1.m22 * m2.m22;
        result.dx = m2.m11 * m1.dx + m2.m12 * m1.dy + m2.dx;
        result.dy = m2.m21 * m1.dx + m2.m22 * m1.dy + m2.dy;
        return result;
    }
    math.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(m11, m21, m12, m22, dx, dy) {
            if (m11 === void 0) { m11 = 1; }
            if (m21 === void 0) { m21 = 0; }
            if (m12 === void 0) { m12 = 0; }
            if (m22 === void 0) { m22 = 1; }
            if (dx === void 0) { dx = 0; }
            if (dy === void 0) { dy = 0; }
            this.m11 = m11;
            this.m21 = m21;
            this.m12 = m12;
            this.m22 = m22;
            this.dx = dx;
            this.dy = dy;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.m11 + ", b=" + this.m21 + ", c=" + this.m12 + ", d=" + this.m22 + ", tx=" + this.dx + ", ty=" + this.dy + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
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
        };
        return Matrix;
    }());
    math.Matrix = Matrix;
})(math || (math = {}));
//# sourceMappingURL=math.js.map