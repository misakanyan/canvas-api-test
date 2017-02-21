window.onload = () => {

    var stage = new DisplayObjectContainer();
    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");

    var image = new Bitmap();
    image.src = "assets/monster.jpg";
    image.scaleX = 2;
    image.scaleY = 2;
    image.y = 10;
    image.relativeAlpha = 0.9;
    image.rotation = 15;

    let text = new TextField();
    text.text = "喵喵喵喵喵";
    text.x = 0;
    text.y = 20;
    text.relativeAlpha = 0.5;

    stage.addChild(image);
    stage.addChild(text);

    setInterval(() => {
        context2D.setTransform(1, 0, 0, 1, 0, 0);
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        text.x++;
        image.x++;
        image.y++;
        stage.draw(context2D);
    }, 30)

    console.log(canvas);

};

interface Drawable {

    draw(context2D: CanvasRenderingContext2D);

}

class DisplayObject implements Drawable {

    x: number = 0;
    y: number = 0;
    globalAppha: number = 1;
    relativeAlpha: number = 1;
    scaleX: number = 1;
    scaleY: number = 1;
    rotation: number = 0;
    globalMatrix: math.Matrix;
    relativeMatrix: math.Matrix;
    parent: DisplayObjectContainer;

    draw(context2D: CanvasRenderingContext2D) { 

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

    }

    render(context2D: CanvasRenderingContext2D) {

    }

    
}

class Bitmap extends DisplayObject {

    image: HTMLImageElement;
    private _src:string = "";

    private isLoaded = false;

    constructor() {

        super();
        this.image = document.createElement('img');

    }

    set src(value: string) {
        this._src = value;
        this.isLoaded = false;
    }

    render(context2D: CanvasRenderingContext2D) {

        context2D.globalAlpha = this.relativeAlpha;

        if (this.isLoaded) {
            context2D.drawImage(this.image, 0, 0);
        }

        else {
            this.image.src = this._src;
            this.image.onload = () => {
                context2D.drawImage(this.image, 0, 0);
                this.isLoaded = true;
            }
        }

    }
}



class TextField extends DisplayObject {

    text: string = "";
    color: string = "";

    render(context2D: CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.font = "18px 微软雅黑";
        context2D.fillText(this.text, this.x, 0);
    }
}

class DisplayObjectContainer extends DisplayObject implements Drawable {

    array: Drawable[] = [];

    render(context2D) {
        for (let Drawable of this.array) {
            Drawable.draw(context2D);
        }
    }

    addChild(child: DisplayObject) {
        if (this.array.indexOf(child) == -1) {
            this.array.push(child);
            child.parent = this;
        }
    }

}

