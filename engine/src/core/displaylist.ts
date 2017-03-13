namespace engine {


    type MovieClipData = {

        name: string,
        frames: MovieClipFrameData[]
    }

    type MovieClipFrameData = {
        "image": string
    }

export interface Drawable {

    draw(context2D: CanvasRenderingContext2D);

}

export abstract class DisplayObject implements Drawable {

    x: number = 0;
    y: number = 0;
    globalAlpha: number = 1;
    relativeAlpha: number = 1;
    scaleX: number = 1;
    scaleY: number = 1;
    rotation: number = 0;
    globalMatrix: Matrix;
    relativeMatrix: Matrix;
    parent: DisplayObjectContainer;
    eventArray: TheEvent[] = new Array();

    draw(context2D: CanvasRenderingContext2D) {

        context2D.save();
        this.relativeMatrix = new Matrix();
        this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);

        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.relativeAlpha;
            this.globalMatrix = matrixAppendMatrix(this.relativeMatrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.relativeAlpha;
            this.globalMatrix = new Matrix(1, 0, 0, 1, 0, 0);
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

export class Bitmap extends DisplayObject {

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



export class TextField extends DisplayObject {

    text: string = "";
    color: string = "";

    render(context2D: CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.font = "18px 微软雅黑";
        context2D.fillText(this.text, this.x, 0);
    }

    hitTest(x: number, y: number) {
        if (this.text) {
            var rect = new Rectangle(0, 0, this.text.length * 10, 10);
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

export class DisplayObjectContainer extends DisplayObject implements Drawable {

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
            let point = new Point(x, y);
            let invertChildLocalMatrix = invertMatrix(target.relativeMatrix);
            let pointBaseOnChild = pointAppendMatrix(point, invertChildLocalMatrix);
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

export class EventManager {
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

export class TheEvent {
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

export class MovieClip extends Bitmap {

        private advancedTime: number = 0;

        private static FRAME_TIME = 20;

        private static TOTAL_FRAME = 10;

        private currentFrameIndex: number;

        private data: MovieClipData;

        constructor(data: MovieClipData) {
            super();
            this.setMovieClipData(data);
            this.play();
        }

        ticker = (deltaTime) => {
            // this.removeChild();
            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            let data = this.data;

            let frameData = data.frames[this.currentFrameIndex];
            let url = frameData.image;
        }

        play() {
            engine.Ticker.getInstance().register(this.ticker);
        }

        stop() {
            engine.Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 

        }
    }

