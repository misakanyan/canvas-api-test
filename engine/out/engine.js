var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engine;
(function (engine) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    engine.Point = Point;
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rectangle.prototype.isPointInRectangle = function (testX, testY) {
            if (isInRange(this.x, testX, this.x + this.width) && isInRange(this.y, testY, this.y + this.height)) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    engine.Rectangle = Rectangle;
    function isInRange(min, testNum, max) {
        if (testNum >= min && testNum <= max) {
            return true;
        }
        else {
            return false;
        }
    }
    engine.isInRange = isInRange;
    function pointAppendMatrix(point, m) {
        var x = m.m11 * point.x + m.m12 * point.y + m.dx;
        var y = m.m21 * point.x + m.m22 * point.y + m.dy;
        return new Point(x, y);
    }
    engine.pointAppendMatrix = pointAppendMatrix;
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
    engine.invertMatrix = invertMatrix;
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
    engine.matrixAppendMatrix = matrixAppendMatrix;
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
    engine.Matrix = Matrix;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var Ticker = (function () {
        function Ticker() {
            this.listeners = [];
        }
        Ticker.getInstance = function () {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        };
        Ticker.prototype.register = function (listener) {
            this.listeners.push(listener);
        };
        Ticker.prototype.unregister = function (listener) {
        };
        Ticker.prototype.notify = function (deltaTime) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(deltaTime);
            }
        };
        return Ticker;
    }());
    engine.Ticker = Ticker;
})(engine || (engine = {}));
var engine;
(function (engine) {
    var DisplayObject = (function () {
        function DisplayObject() {
            this.x = 0;
            this.y = 0;
            this.globalAlpha = 1;
            this.relativeAlpha = 1;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.eventArray = new Array();
        }
        DisplayObject.prototype.draw = function (context2D) {
            context2D.save();
            this.relativeMatrix = new engine.Matrix();
            this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.relativeAlpha;
                this.globalMatrix = engine.matrixAppendMatrix(this.relativeMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalAlpha = this.relativeAlpha;
                this.globalMatrix = new engine.Matrix(1, 0, 0, 1, 0, 0);
            }
            context2D.globalAlpha = this.globalAlpha;
            context2D.setTransform(this.relativeMatrix.m11, this.relativeMatrix.m12, this.relativeMatrix.m21, this.relativeMatrix.m22, this.relativeMatrix.dx, this.relativeMatrix.dy);
            this.render(context2D);
        };
        DisplayObject.prototype.addEventListener = function (eventType, func, target, ifCapture) {
            var e = new engine.TheEvent(eventType, ifCapture, target, func);
            this.eventArray.push(e);
        };
        DisplayObject.prototype.render = function (context2D) {
        };
        return DisplayObject;
    }());
    engine.DisplayObject = DisplayObject;
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            _super.call(this);
            this._width = -1;
            this._height = -1;
            this._src = "";
            this.isLoaded = false;
            this._visible = true; //暂无用
            this.image = document.createElement('img');
        }
        Object.defineProperty(Bitmap.prototype, "src", {
            set: function (src) {
                this._src = src;
                this.isLoaded = false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bitmap.prototype, "width", {
            set: function (width) {
                this.width = width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bitmap.prototype, "height", {
            set: function (height) {
                this.height = height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bitmap.prototype, "visible", {
            set: function (visible) {
                this.visible = visible;
            },
            enumerable: true,
            configurable: true
        });
        Bitmap.prototype.render = function (context2D) {
            var _this = this;
            context2D.globalAlpha = this.relativeAlpha;
            if (this.isLoaded) {
                if (this.width == -1 || this.height == -1) {
                    context2D.drawImage(this.image, 0, 0);
                }
                else {
                    context2D.drawImage(this.image, 0, 0, this.width, this.height);
                }
            }
            else {
                this.image.src = this._src;
                this.image.onload = function () {
                    if (_this.width == -1 || _this.height == -1) {
                        context2D.drawImage(_this.image, 0, 0);
                    }
                    else {
                        context2D.drawImage(_this.image, 0, 0, _this.width, _this.height);
                    }
                    _this.isLoaded = true;
                };
            }
        };
        Bitmap.prototype.hitTest = function (x, y) {
            if (this.image) {
                var rect = new engine.Rectangle(0, 0, this.image.width, this.image.height);
                console.log("width:" + rect.width + " height" + rect.height);
                if (rect.isPointInRectangle(x, y)) {
                    var eventManager = engine.EventManager.getInstance();
                    if (this.eventArray.length != 0) {
                        eventManager.targets.push(this);
                    }
                    return this;
                }
                else {
                    return null;
                }
            }
        };
        return Bitmap;
    }(DisplayObject));
    engine.Bitmap = Bitmap;
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            _super.apply(this, arguments);
            this.text = "";
            this.color = "";
            this._size = 18;
            this._font = "微软雅黑";
        }
        Object.defineProperty(TextField.prototype, "size", {
            set: function (size) {
                this.size = size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "font", {
            set: function (font) {
                this._font = font;
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.render = function (context2D) {
            context2D.fillStyle = this.color;
            context2D.font = this._size + " " + this._font;
            context2D.fillText(this.text, this.x, 0);
        };
        TextField.prototype.hitTest = function (x, y) {
            if (this.text) {
                var rect = new engine.Rectangle(0, 0, this.text.length * 10, 10);
                console.log("width:" + rect.width + " height" + rect.height);
                if (rect.isPointInRectangle(x, y)) {
                    var eventManager = engine.EventManager.getInstance();
                    if (this.eventArray.length != 0) {
                        eventManager.targets.push(this);
                    }
                    return this;
                }
                else {
                    return null;
                }
            }
        };
        return TextField;
    }(DisplayObject));
    engine.TextField = TextField;
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            _super.call(this);
            this.fillColor = "#000000";
            this.alpha = 1;
        }
        Shape.prototype.beginFill = function (fillColor, alpha) {
            var type = "^#[0-9a-fA-F]{6}{1}$";
            var test = new RegExp(type);
            if (fillColor.match(test) != null) {
                this.fillColor = fillColor;
            }
            else {
                console.log("invaild color value");
            }
            if (engine.isInRange(0, alpha, 1)) {
                this.alpha = alpha;
            }
            else {
                console.log("invaild alpha value");
            }
        };
        Shape.prototype.endFill = function () {
            this.fillColor = "#000000";
            this.alpha = 1;
        };
        Shape.prototype.drawRect = function (x, y, width, height, context2D) {
            context2D.globalAlpha = this.alpha;
            context2D.fillStyle = this.fillColor;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.render(context2D);
        };
        Shape.prototype.render = function (context2D) {
            context2D.globalAlpha = this.alpha;
            context2D.fillStyle = this.fillColor;
            context2D.fillRect(this.x, this.y, this.width, this.height);
        };
        //let a = new engine.Rectangle();
        Shape.prototype.hitTest = function (x, y) {
        };
        return Shape;
    }(DisplayObject));
    engine.Shape = Shape;
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            _super.apply(this, arguments);
            this.array = [];
        }
        DisplayObjectContainer.prototype.render = function (context2D) {
            for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
                var Drawable = _a[_i];
                Drawable.draw(context2D);
            }
        };
        DisplayObjectContainer.prototype.addChild = function (child) {
            if (this.array.indexOf(child) == -1) {
                this.array.push(child);
                child.parent = this;
            }
        };
        DisplayObjectContainer.prototype.hitTest = function (x, y) {
            for (var i = this.array.length - 1; i >= 0; i--) {
                console.log("length:" + this.array.length);
                var target = this.array[i];
                console.log("target:" + target);
                var point = new engine.Point(x, y);
                var invertChildLocalMatrix = engine.invertMatrix(target.relativeMatrix);
                var pointBaseOnChild = engine.pointAppendMatrix(point, invertChildLocalMatrix);
                var hitTestResult = target.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                console.log("pointBaseOnChild.x:" + pointBaseOnChild.x + " pointBaseOnChild.y" + pointBaseOnChild.y);
                if (hitTestResult) {
                    return hitTestResult;
                }
                else {
                    return null;
                }
            }
        };
        return DisplayObjectContainer;
    }(DisplayObject));
    engine.DisplayObjectContainer = DisplayObjectContainer;
    /*export class Rectangle {
    
        x = 0;
        y = 0;
        width = 1;
        height = 1;
        isPointInRectangle(point: Point) {
            let rect = this;
            if (point.x < rect.width + rect.x && point.y < rect.height + rect.y && point.x < rect.x && point.y > rect.y) {
                return true;
            }
        }
    
    }*/
    var Timer = (function () {
        function Timer(interval, loopNum, delayTime) {
            this.interval = 1000;
            this.loopNum = 1;
            this.delayTime = 0;
            this.interval = interval;
            this.loopNum = loopNum;
            if (arguments.length >= 3) {
                this.delayTime = delayTime;
            }
        }
        Timer.prototype.addEventListener = function () {
        };
        return Timer;
    }());
    engine.Timer = Timer;
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(data) {
            var _this = this;
            _super.call(this);
            this.advancedTime = 0;
            this.ticker = function (deltaTime) {
                // this.removeChild();
                _this.advancedTime += deltaTime;
                if (_this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                    _this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
                }
                _this.currentFrameIndex = Math.floor(_this.advancedTime / MovieClip.FRAME_TIME);
                var data = _this.data;
                var frameData = data.frames[_this.currentFrameIndex];
                var url = frameData.image;
            };
            this.setMovieClipData(data);
            this.play();
        }
        MovieClip.prototype.play = function () {
            engine.Ticker.getInstance().register(this.ticker);
        };
        MovieClip.prototype.stop = function () {
            engine.Ticker.getInstance().unregister(this.ticker);
        };
        MovieClip.prototype.setMovieClipData = function (data) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 
        };
        MovieClip.FRAME_TIME = 20;
        MovieClip.TOTAL_FRAME = 10;
        return MovieClip;
    }(Bitmap));
    engine.MovieClip = MovieClip;
})(engine || (engine = {}));
var engine;
(function (engine) {
    engine.run = function (canvas) {
        var stage = new engine.DisplayObjectContainer();
        var context2D = canvas.getContext("2d");
        var lastNow = Date.now();
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            engine.Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.draw(context2D);
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        window.onmousedown = function () {
            // stage.hitTest(100, 100);
        };
        window.onmousedown = function (e) {
        };
        return stage;
    };
})(engine || (engine = {}));
var engine;
(function (engine) {
    var EventManager = (function () {
        function EventManager() {
        }
        EventManager.getInstance = function () {
            if (!EventManager.instance) {
                EventManager.instance = new EventManager();
                EventManager.instance.targets = new Array();
            }
            return EventManager.instance;
        };
        return EventManager;
    }());
    engine.EventManager = EventManager;
    var TheEvent = (function () {
        function TheEvent(type, ifCapture, target, func) {
            this.type = "";
            this.ifCapture = false;
            this.type = type;
            this.ifCapture = ifCapture;
            this.target = target;
            this.func = func;
        }
        return TheEvent;
    }());
    engine.TheEvent = TheEvent;
    var TouchEvent = (function () {
        function TouchEvent() {
        }
        return TouchEvent;
    }());
    engine.TouchEvent = TouchEvent;
    var TimerEvent = (function () {
        function TimerEvent() {
        }
        return TimerEvent;
    }());
    engine.TimerEvent = TimerEvent;
})(engine || (engine = {}));
