namespace engine {

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
        eventArray: engine.TheEvent[] = new Array();

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

        addEventListener(eventType: string, func: Function, target: DisplayObject, ifCapture?: boolean) {
            let e = new engine.TheEvent(eventType, ifCapture, target, func);
            this.eventArray.push(e);
        }

        render(context2D: CanvasRenderingContext2D) {

        }

        abstract hitTest(x: number, y: number);


    }

    export class Bitmap extends DisplayObject {

        image: HTMLImageElement;
        private _width: number = -1;
        private _height: number = -1;
        private _src: string = "";
        private isLoaded: boolean = false;
        private _visible: boolean = true;  //暂无用

        constructor() {

            super();
            this.image = document.createElement('img');

        }

        set src(src: string) {
            this._src = src;
            this.isLoaded = false;
        }

        set width(width: number) {
            this.width = width;
        }

        set height(height: number) {
            this.height = height;
        }

        set visible(visible: boolean) {
            this.visible = visible;
        }

        render(context2D: CanvasRenderingContext2D) {

            context2D.globalAlpha = this.relativeAlpha;

            if (this.isLoaded) {
                if (this.width == -1 || this.height == -1) {
                    context2D.drawImage(this.image, 0, 0);
                } else {
                    context2D.drawImage(this.image, 0, 0, this.width, this.height);
                }
            }

            else {
                this.image.src = this._src;
                this.image.onload = () => {
                    if (this.width == -1 || this.height == -1) {
                        context2D.drawImage(this.image, 0, 0);
                    } else {
                        context2D.drawImage(this.image, 0, 0, this.width, this.height);
                    }
                    this.isLoaded = true;
                }
            }

        }

        hitTest(x: number, y: number) {
            if (this.image) {
                var rect = new Rectangle(0, 0, this.image.width, this.image.height);
                console.log("width:" + rect.width + " height" + rect.height);
                if (rect.isPointInRectangle(x, y)) {
                    var eventManager = engine.EventManager.getInstance();
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
        private _size: number = 18;
        private _font: string = "微软雅黑";

        set size(size: number) {
            this.size = size;
        }

        set font(font: string) {
            this._font = font;
        }

        render(context2D: CanvasRenderingContext2D) {
            context2D.fillStyle = this.color;
            context2D.font = this._size + " " + this._font;
            context2D.fillText(this.text, this.x, 0);
        }

        hitTest(x: number, y: number) {
            if (this.text) {
                var rect = new Rectangle(0, 0, this.text.length * 10, 10);
                console.log("width:" + rect.width + " height" + rect.height);
                if (rect.isPointInRectangle(x, y)) {
                    var eventManager = engine.EventManager.getInstance();
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


    export class Shape extends DisplayObject {

        width: number;
        height: number;
        fillColor: string = "#000000"
        alpha: number = 1;

        constructor() {
            super();
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
                console.log("length:" + this.array.length);
                let target = this.array[i];
                console.log("target:" + target);
                let point = new Point(x, y);
                let invertChildLocalMatrix = invertMatrix(target.relativeMatrix);
                let pointBaseOnChild = pointAppendMatrix(point, invertChildLocalMatrix);
                let hitTestResult = target.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                console.log("pointBaseOnChild.x:" + pointBaseOnChild.x + " pointBaseOnChild.y" + pointBaseOnChild.y);
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

    export type MovieClipData = {

        name: string,
        frames: MovieClipFrameData[]
    }

    export type MovieClipFrameData = {
        "image": string
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