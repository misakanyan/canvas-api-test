window.onload = () => {

    var stage = new DisplayObjectContainer();
    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");

    var blank = new DisplayObjectContainer();
    blank.addEventListener("onclick", () => {
        console.log("click:blank");
    }, this, false);
    stage.addChild(blank);

    var image = new Bitmap();
    image.src = "assets/monster.jpg";
    image.scaleX = 2;
    image.scaleY = 2;
    image.x = 60;
    image.y = 10;
    image.relativeAlpha = 0.9;
    image.rotation = 15;
    image.addEventListener("onclick", () => {
        console.log("click:image");
    }, this, false);
    image.addEventListener("onmove",()=>{
        console.log("move:image");
        let dx = currentX - lastX;
        image.x+=dx;
        let dy = currentY - lastY;
        image.y+=dy;
    },this,false);
    //stage.addChild(image);
    blank.addChild(image);

    let text = new TextField();
    text.text = "喵喵喵喵喵";
    text.x = 20;
    text.y = 50;
    text.relativeAlpha = 0.5;
    //stage.addChild(text);

    setInterval(() => {
        context2D.setTransform(1, 0, 0, 1, 0, 0);
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        //text.x++;
        //image.x++;
        //image.y++;
        stage.draw(context2D);
    }, 30)

    var hitResult: DisplayObject;
    var currentX: number;
    var currentY: number;
    var lastX: number;
    var lastY: number;
    var isMouseDown: boolean = false;

    window.onmousedown = (e) => {
        isMouseDown = true;
        let targetArray = EventManager.getInstance().targets;
        targetArray.splice(0, targetArray.length);
        hitResult = stage.hitTest(e.offsetX, e.offsetY);
        console.log(hitResult);
        currentX = e.offsetX;
        currentY = e.offsetY;
        console.log("hit:" + currentX + " " + currentY);
    }
    window.onmousemove = (e) => {
        let targetArray = EventManager.getInstance().targets;
        lastX = currentX;
        lastY = currentY;
        currentX = e.offsetX;
        currentY = e.offsetY;
        if (isMouseDown) {
            for (let i = 0; i < targetArray.length; i++) {
                for (let x of targetArray[i].eventArray) {
                    if (x.type.match("onmove") &&
                        x.ifCapture == true) {
                        x.func(e);
                        console.log("moving");
                    }
                }
            }
            for (let i = targetArray.length - 1; i >= 0; i--) {
                for (let x of targetArray[i].eventArray) {
                    if (x.type.match("onmove") &&
                        x.ifCapture == false) {
                        x.func(e);
                    }
                }
            }
        }
    }
    window.onmouseup = (e) => {
        isMouseDown = false;
        let targetArray = EventManager.getInstance().targets;
        targetArray.splice(0, targetArray.length);
        let newHitRusult = stage.hitTest(e.offsetX, e.offsetY)
        for (let i = targetArray.length - 1; i >= 0; i--) {
            for (let x of targetArray[i].eventArray) {
                if (x.type.match("onclick")&&
                    newHitRusult == hitResult) {
                    x.func(e);
                }
            }
        }
    }

};

interface Drawable {

    draw(context2D: CanvasRenderingContext2D);

}

abstract class DisplayObject implements Drawable {

    x: number = 0;
    y: number = 0;
    globalAlpha: number = 1;
    relativeAlpha: number = 1;
    scaleX: number = 1;
    scaleY: number = 1;
    rotation: number = 0;
    globalMatrix: math.Matrix;
    relativeMatrix: math.Matrix;
    parent: DisplayObjectContainer;
    eventArray: TheEvent[] = new Array();

    draw(context2D: CanvasRenderingContext2D) {

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

    }

    addEventListener(eventType: string, func: Function, target: DisplayObject, ifCapture: boolean) {
        let e = new TheEvent(eventType, ifCapture, target, func);
        this.eventArray.push(e);
    }

    render(context2D: CanvasRenderingContext2D) {

    }

    abstract hitTest(x: number, y: number);


}

class Bitmap extends DisplayObject {

    image: HTMLImageElement;
    private _src: string = "";

    private isLoaded = false;

    constructor() {

        super();
        this.image = document.createElement('img');

    }

    set src(src: string) {
        this._src = src;
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

    hitTest(x: number, y: number) {
        if (this.image) {
            var rect = new math.Rectangle(0, 0, this.image.width, this.image.height);
            console.log("width:"+rect.width+" height"+rect.height);
            if (rect.isPointInRectangle(x, y)) {
                var eventManager = EventManager.getInstance();
                if (this.eventArray.length != 0) {
                    eventManager.targets.push(this);
                }
                return this;
            } else {
                return null;
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

    hitTest(x: number, y: number) {
        return false;
    }
}

class DisplayObjectContainer extends DisplayObject implements Drawable {

    array: DisplayObject[] = [];

    render(context2D: CanvasRenderingContext2D) {
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

    hitTest(x, y) {
        for (let i = this.array.length - 1; i >= 0; i--) {
            console.log("length:"+this.array.length);
            let target = this.array[i];
            console.log("target:"+target);
            let point = new math.Point(x, y);
            let invertChildLocalMatrix = math.invertMatrix(target.relativeMatrix);
            let pointBaseOnChild = math.pointAppendMatrix(point, invertChildLocalMatrix);
            let hitTestResult = target.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
            console.log("pointBaseOnChild.x:"+pointBaseOnChild.x+" pointBaseOnChild.y"+pointBaseOnChild.y);
            if (hitTestResult) {
                return hitTestResult;
            } else {
                return null;
            }

        }
    }

}

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

class EventManager {
    targets: DisplayObject[];
    static instance: EventManager;

    static getInstance() {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
            EventManager.instance.targets = new Array();
        }
        return EventManager.instance;
    }
}

class TheEvent {
    type: string = "";
    ifCapture: boolean = false;
    target: DisplayObject;
    func: Function;
    constructor(type: string, ifCapture: boolean, target: DisplayObject, func: Function) {
        this.type = type;
        this.ifCapture = ifCapture;
        this.target = target;
        this.func = func;
    }
}

