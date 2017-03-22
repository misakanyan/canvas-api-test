declare namespace engine {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x: number, y: number, width: number, height: number);
        isPointInRectangle(testX: number, testY: number): boolean;
    }
    function isInRange(min: number, testNum: number, max: number): boolean;
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(m11?: number, m21?: number, m12?: number, m22?: number, dx?: number, dy?: number);
        m11: number;
        m21: number;
        m12: number;
        m22: number;
        dx: number;
        dy: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace engine {
    type Ticker_Listener_Type = (deltaTime: number) => void;
    class Ticker {
        private static instance;
        static getInstance(): Ticker;
        listeners: Ticker_Listener_Type[];
        register(listener: Ticker_Listener_Type): void;
        unregister(listener: Ticker_Listener_Type): void;
        notify(deltaTime: number): void;
    }
}
declare namespace engine {
    interface Drawable {
    }
    abstract class DisplayObject implements Drawable {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        relativeAlpha: number;
        globalAlpha: number;
        relativeMatrix: Matrix;
        globalMatrix: Matrix;
        parent: DisplayObjectContainer;
        touchEnabled: boolean;
        type: string;
        eventArray: TheEvent[];
        constructor(type: string);
        update(): void;
        addEventListener(eventType: string, func: Function, target: DisplayObject, ifCapture: boolean): void;
        abstract hitTest(x: number, y: number): DisplayObject;
    }
    class Bitmap extends DisplayObject {
        image: HTMLImageElement;
        texture: string;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class TextField extends DisplayObject {
        text: string;
        constructor();
        _measureTextWidth: number;
        hitTest(x: number, y: number): this;
    }
    class DisplayObjectContainer extends DisplayObject {
        array: DisplayObject[];
        constructor();
        update(): void;
        addChild(child: DisplayObject): void;
        removeChild(child: DisplayObject): void;
        hitTest(x: any, y: any): DisplayObject;
    }
    class Shape extends DisplayObject {
        width: number;
        height: number;
        fillColor: string;
        alpha: number;
        constructor();
        beginFill(fillColor: string, alpha: number): void;
        endFill(): void;
        drawRect(x: number, y: number, width: number, height: number, context2D: CanvasRenderingContext2D): void;
        render(context2D: CanvasRenderingContext2D): void;
        hitTest(x: number, y: number): this;
    }
    class Timer {
        interval: number;
        loopNum: number;
        delayTime: number;
        constructor(interval: number, loopNum: number, delayTime: number);
        addEventListener(): void;
    }
    class Tween {
        target: any;
        totalStep: number;
        currentStep: number;
        get(target: any): void;
        to(x: number, y: number): void;
    }
}
declare namespace engine {
    let run: (canvas: HTMLCanvasElement) => DisplayObjectContainer;
}
declare namespace engine {
    class EventManager {
        targets: DisplayObject[];
        static eventManager: EventManager;
        constructor();
        static getInstance(): EventManager;
    }
    class TheEvent {
        type: string;
        ifCapture: boolean;
        target: DisplayObject;
        func: Function;
        constructor(eventType: string, func: Function, target: DisplayObject, ifCapture: boolean);
    }
    class TouchEvent {
        static TOUCH_MOVE: "touchMove";
        static TOUCH_BEGIN: "touchBegin";
        static TOUCH_END: "mouseup";
        static TOUCH_CANCEL: "touchCancel";
        static TOUCH_TAP: "mousedown";
    }
    class TimerEvent {
        static TIMER: "timerStart";
        static TIMER_COMPLETE: "timerComplete";
    }
}
