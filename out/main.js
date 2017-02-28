var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
window.onload = function () {
    var stage = new DisplayObjectContainer();
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    var blank = new DisplayObjectContainer();
    blank.addEventListener("onclick", function () {
        console.log("click:blank");
    }, _this, false);
    stage.addChild(blank);
    var image = new Bitmap();
    image.src = "assets/monster.jpg";
    image.scaleX = 2;
    image.scaleY = 2;
    image.x = 60;
    image.y = 10;
    image.relativeAlpha = 0.9;
    image.rotation = 15;
    image.addEventListener("onclick", function () {
        console.log("click:image");
    }, _this, false);
    image.addEventListener("onmove", function () {
        console.log("move:image");
        var dx = currentX - lastX;
        image.x += dx;
        var dy = currentY - lastY;
        image.y += dy;
    }, _this, false);
    //stage.addChild(image);
    blank.addChild(image);
    var text = new TextField();
    text.text = "喵喵喵喵喵";
    text.x = 20;
    text.y = 50;
    text.relativeAlpha = 0.5;
    //stage.addChild(text);
    setInterval(function () {
        context2D.setTransform(1, 0, 0, 1, 0, 0);
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        //text.x++;
        //image.x++;
        //image.y++;
        stage.draw(context2D);
    }, 30);
    var hitResult;
    var currentX;
    var currentY;
    var lastX;
    var lastY;
    var isMouseDown = false;
    window.onmousedown = function (e) {
        isMouseDown = true;
        var targetArray = EventManager.getInstance().targets;
        targetArray.splice(0, targetArray.length);
        hitResult = stage.hitTest(e.offsetX, e.offsetY);
        console.log(hitResult);
        currentX = e.offsetX;
        currentY = e.offsetY;
        console.log("hit:" + currentX + " " + currentY);
    };
    window.onmousemove = function (e) {
        var targetArray = EventManager.getInstance().targets;
        lastX = currentX;
        lastY = currentY;
        currentX = e.offsetX;
        currentY = e.offsetY;
        if (isMouseDown) {
            for (var i = 0; i < targetArray.length; i++) {
                for (var _i = 0, _a = targetArray[i].eventArray; _i < _a.length; _i++) {
                    var x = _a[_i];
                    if (x.type.match("onmousemove") &&
                        x.ifCapture == true) {
                        x.func(e);
                    }
                }
            }
            for (var i = targetArray.length - 1; i >= 0; i--) {
                for (var _b = 0, _c = targetArray[i].eventArray; _b < _c.length; _b++) {
                    var x = _c[_b];
                    if (x.type.match("onmousemove") &&
                        x.ifCapture == false) {
                        x.func(e);
                    }
                }
            }
        }
    };
    window.onmouseup = function (e) {
        isMouseDown = false;
        var targetArray = EventManager.getInstance().targets;
        targetArray.splice(0, targetArray.length);
        var newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
        for (var i = targetArray.length - 1; i >= 0; i--) {
            for (var _i = 0, _a = targetArray[i].eventArray; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x.type.match("onclick") &&
                    newHitRusult == hitResult) {
                    x.func(e);
                }
            }
        }
    };
};
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
        this.relativeMatrix = new math.Matrix();
        this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.relativeAlpha;
            this.globalMatrix = math.matrixAppendMatrix(this.relativeMatrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.relativeAlpha;
            this.globalMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.relativeMatrix.m11, this.relativeMatrix.m12, this.relativeMatrix.m21, this.relativeMatrix.m22, this.relativeMatrix.dx, this.relativeMatrix.dy);
        this.render(context2D);
    };
    DisplayObject.prototype.addEventListener = function (eventType, func, target, ifCapture) {
        var e = new TheEvent(eventType, ifCapture, target, func);
        this.eventArray.push(e);
    };
    DisplayObject.prototype.render = function (context2D) {
    };
    return DisplayObject;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.call(this);
        this._src = "";
        this.isLoaded = false;
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
    Bitmap.prototype.render = function (context2D) {
        var _this = this;
        context2D.globalAlpha = this.relativeAlpha;
        if (this.isLoaded) {
            context2D.drawImage(this.image, 0, 0);
        }
        else {
            this.image.src = this._src;
            this.image.onload = function () {
                context2D.drawImage(_this.image, 0, 0);
                _this.isLoaded = true;
            };
        }
    };
    Bitmap.prototype.hitTest = function (x, y) {
        if (this.image) {
            var rect = new math.Rectangle(0, 0, this.image.width, this.image.height);
            console.log("width:" + rect.width + " height" + rect.height);
            if (rect.isPointInRectangle(x, y)) {
                var eventManager = EventManager.getInstance();
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
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
    }
    TextField.prototype.render = function (context2D) {
        context2D.fillStyle = this.color;
        context2D.font = "18px 微软雅黑";
        context2D.fillText(this.text, this.x, 0);
    };
    TextField.prototype.hitTest = function (x, y) {
        return false;
    };
    return TextField;
}(DisplayObject));
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
            var point = new math.Point(x, y);
            var invertChildLocalMatrix = math.invertMatrix(target.relativeMatrix);
            var pointBaseOnChild = math.pointAppendMatrix(point, invertChildLocalMatrix);
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
//# sourceMappingURL=main.js.map