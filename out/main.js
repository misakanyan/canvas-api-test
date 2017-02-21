var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var stage = new DisplayObjectContainer();
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    var image = new Bitmap();
    image.src = "assets/monster.jpg";
    image.scaleX = 2;
    image.scaleY = 2;
    image.y = 10;
    image.relativeAlpha = 0.9;
    image.rotation = 15;
    var text = new TextField();
    text.text = "喵喵喵喵喵";
    text.x = 0;
    text.y = 20;
    text.relativeAlpha = 0.5;
    stage.addChild(image);
    stage.addChild(text);
    setInterval(function () {
        context2D.setTransform(1, 0, 0, 1, 0, 0);
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        text.x++;
        image.x++;
        image.y++;
        stage.draw(context2D);
    }, 30);
    console.log(canvas);
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.globalAppha = 1;
        this.relativeAlpha = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
    }
    DisplayObject.prototype.draw = function (context2D) {
        context2D.save();
        this.relativeMatrix = new math.Matrix();
        this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        if (this.parent) {
            this.globalAppha = this.parent.globalAppha * this.relativeAlpha;
            this.globalMatrix = math.matrixAppendMatrix(this.relativeMatrix, this.parent.globalMatrix);
        }
        else {
            this.globalAppha = this.relativeAlpha;
            this.globalMatrix = new math.Matrix(1, 0, 0, 1, 0, 0);
        }
        context2D.globalAlpha = this.globalAppha;
        context2D.setTransform(this.relativeMatrix.m11, this.relativeMatrix.m12, this.relativeMatrix.m21, this.relativeMatrix.m22, this.relativeMatrix.dx, this.relativeMatrix.dy);
        this.render(context2D);
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
        set: function (value) {
            this._src = value;
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
    return DisplayObjectContainer;
}(DisplayObject));
//# sourceMappingURL=main.js.map