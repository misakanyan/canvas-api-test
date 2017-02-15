var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var stage = new DisplayObjectContainer();
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    context2D.fillStyle = "#FFFF0000";
    context2D.strokeStyle = "#00FF00";
    context2D.setTransform(1, 0, 0, 1, 50, 50);
    context2D.rect(0, 0, 100, 100);
    context2D.fill();
    //var image = new Bitmap();
    //image.image.src = "/assets/monster.jpg"
    //image.draw(context2D);
    setInterval(function () {
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);
    }, 30);
    var text = new TextField();
    text.text = "喵喵喵喵喵";
    text.draw(context2D);
    var image = document.createElement("img");
    image.src = "assets/monster.jpg";
    image.onload = function () {
        var exo = new Bitmap();
        exo.image = image;
        exo.width = 100;
        exo.height = 100;
        stage.addChild(exo);
        stage.addChild(text);
    };
    context2D.clearRect(0, 0, 400, 400);
    console.log(canvas);
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
    }
    DisplayObject.prototype.draw = function (context2D) {
    };
    return DisplayObject;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.apply(this, arguments);
        this.width = 0;
        this.height = 0;
    }
    Bitmap.prototype.draw = function (context2D) {
        context2D.drawImage(this.image, this.x, this.y, this.width, this.height);
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
    TextField.prototype.draw = function (context2D) {
        context2D.fillStyle = this.color;
        context2D.font = "18px 微软雅黑";
        context2D.fillText(this.text, this.x, 0);
    };
    return TextField;
}(DisplayObject));
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.array = [];
    }
    DisplayObjectContainer.prototype.draw = function (context2D) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var Drawable = _a[_i];
            Drawable.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (child) {
        this.array.push(child);
    };
    return DisplayObjectContainer;
}());
//# sourceMappingURL=main.js.map