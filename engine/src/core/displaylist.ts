namespace engine {


    type MovieClipData = {

        name: string,
        frames: MovieClipFrameData[]
    }

    type MovieClipFrameData = {
        "image": string
    }

    export interface Drawable {

    }

    export abstract class DisplayObject implements Drawable {

        x = 0;
        y = 0;
        scaleX = 1;
        scaleY = 1;
        rotation = 0;
        relativeAlpha = 1;
        globalAlpha = 1;
        relativeMatrix: Matrix;
        globalMatrix: Matrix;
        parent: DisplayObjectContainer;
        touchEnabled: boolean;
        type: string;
        eventArray: TheEvent[];

        constructor(type: string) {
            this.relativeMatrix = new Matrix();
            this.globalMatrix = new Matrix();
            this.eventArray = new Array();
            this.type = type;
        }

        update() {
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
        }

        addEventListener(eventType: string, func: Function, target: DisplayObject, ifCapture: boolean) {
            //if this.eventArray doesn't contain e
            let e = new TheEvent(eventType, func, target, ifCapture);
            this.eventArray.push(e);
        }

        abstract hitTest(x: number, y: number): DisplayObject

    }


    export class Bitmap extends DisplayObject {

        image: HTMLImageElement;
        texture: string;

        constructor() {
            super("Bitmap");
        }

        hitTest(x: number, y: number) {
            if (this.image) {
                var rect = new Rectangle(0, 0, this.image.width, this.image.height);
                rect.x = rect.y = 0;
                if (rect.isPointInRectangle(x, y)) {
                    let eventManager = EventManager.getInstance();
                    eventManager.targets.push(this);
                    return this;
                }
                else {
                    return null;
                }
            }
        }
    }

    export class TextField extends DisplayObject {

        text: string = "";

        constructor() {
            super("TextField");
        }

        _measureTextWidth: number = 0;

        hitTest(x: number, y: number) {
            var rect = new Rectangle(0, 0, this._measureTextWidth, 20);
            if (rect.isPointInRectangle(x,y)) {
                let eventManager = EventManager.getInstance();
                eventManager.targets.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }

    export class DisplayObjectContainer extends DisplayObject {

        array: DisplayObject[] = [];

        constructor() {
            super("DisplayObjectContainer");
        }

        update() {
            super.update();
            for (let displayobject of this.array) {
                displayobject.update();
            }
        }

        addChild(child: DisplayObject) {
            let x = this.array.indexOf(child);
            if (x < 0) {
                this.array.push(child);
                child.parent = this;
            } else {
                //如需遮罩，则需在此处将已有子物体移至第一位
            }
        }

        removeChild(child: DisplayObject) {
            let x = this.array.indexOf(child);
            if (x >= 0) {
                this.array.splice(x, 1);
            }
        }

        hitTest(x, y) {
            for (let i = this.array.length - 1; i >= 0; i--) {
                let child = this.array[i];
                let point = new Point(x, y);
                let invertChildLocalMatrix = invertMatrix(child.relativeMatrix);
                let pointBaseOnChild = pointAppendMatrix(point, invertChildLocalMatrix);
                let hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                if (hitTestResult) {
                    let eventManager = EventManager.getInstance();
                    eventManager.targets.push(this);
                    return hitTestResult;
                }
            }
            return null;
        }

    }

    export class Shape extends DisplayObject {

        width: number;
        height: number;
        fillColor: string = "#000000"
        alpha: number = 1;

        constructor() {
            super("Shape");
        }

        beginFill(fillColor: string, alpha: number) {
            var type = "^#[0-9a-fA-F]{6}{1}$";
            var test = new RegExp(type);
            if (fillColor.match(test) != null) {
                this.fillColor = fillColor;
            } else {
                console.log("invaild color value");
            }
            if (isInRange(0, alpha, 1)) {
                this.alpha = alpha
            } else {
                console.log("invaild alpha value");
            }
        }

        endFill() {
            this.fillColor = "#000000";
            this.alpha = 1;
        }

        drawRect(x: number, y: number, width: number, height: number, context2D: CanvasRenderingContext2D) {
            context2D.globalAlpha = this.alpha;
            context2D.fillStyle = this.fillColor;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.render(context2D);
        }

        render(context2D: CanvasRenderingContext2D) {
            context2D.globalAlpha = this.alpha;
            context2D.fillStyle = this.fillColor;
            context2D.fillRect(this.x, this.y, this.width, this.height);
        }

        //let a = new engine.Rectangle();


        hitTest(x: number, y: number) {
            var rect = new Rectangle(0, 0, this.width, this.height);
            if (rect.isPointInRectangle(x,y)) {
                let eventManager = EventManager.getInstance();
                eventManager.targets.push(this);
                return this;
            }
            else {
                return null;
            }
        }
    }


    class MovieClip extends Bitmap {

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
            Ticker.getInstance().register(this.ticker);
        }

        stop() {
            Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 

        }
    }

    export class Timer {

        interval: number = 1000;
        loopNum: number = 1;
        delayTime: number = 0;

        constructor(interval: number, loopNum: number, delayTime: number) {
            this.interval = interval;
            this.loopNum = loopNum;
            if (arguments.length >= 3) {
                this.delayTime = delayTime;
            }
        }

        addEventListener() {

        }

    }

    export class Tween {

        target:any;
        totalStep:number = 10;
        currentStep:number = 0;

        get(target:any){
            this.target = target;
        }

        to(x:number,y:number){

        }

    }

}