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
        draw(context2D: CanvasRenderingContext2D): any;
    }
    abstract class DisplayObject implements Drawable {
        x: number;
        y: number;
        globalAlpha: number;
        relativeAlpha: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        globalMatrix: Matrix;
        relativeMatrix: Matrix;
        parent: DisplayObjectContainer;
        eventArray: TheEvent[];
        draw(context2D: CanvasRenderingContext2D): void;
        addEventListener(eventType: string, func: Function, target: DisplayObject, ifCapture: boolean): void;
        render(context2D: CanvasRenderingContext2D): void;
        abstract hitTest(x: number, y: number): any;
    }
    class Bitmap extends DisplayObject {
        image: HTMLImageElement;
        private _width;
        private _height;
        private _src;
        private isLoaded;
        constructor();
        src: string;
        width: number;
        height: number;
        render(context2D: CanvasRenderingContext2D): void;
        hitTest(x: number, y: number): this;
    }
    class TextField extends DisplayObject {
        text: string;
        color: string;
        render(context2D: CanvasRenderingContext2D): void;
        hitTest(x: number, y: number): this;
    }
    class Shape extends DisplayObject {
        width: number;
        height: number;
        fillColor: string;
        alpha: number;
        constructor();
        beginfill(fillColor: string, alpha: number): void;
        endfill(): void;
        drawRect(x: number, y: number, width: number, height: number, context2D: CanvasRenderingContext2D): void;
        render(context2D: CanvasRenderingContext2D): void;
        hitTest(x: number, y: number): void;
    }
    class DisplayObjectContainer extends DisplayObject implements Drawable {
        array: DisplayObject[];
        render(context2D: CanvasRenderingContext2D): void;
        addChild(child: DisplayObject): void;
        hitTest(x: any, y: any): any;
    }
    class EventManager {
        targets: DisplayObject[];
        static instance: EventManager;
        static getInstance(): EventManager;
    }
    class TheEvent {
        type: string;
        ifCapture: boolean;
        target: DisplayObject;
        func: Function;
        constructor(type: string, ifCapture: boolean, target: DisplayObject, func: Function);
    }
    type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[];
    };
    type MovieClipFrameData = {
        "image": string;
    };
    class MovieClip extends Bitmap {
        private advancedTime;
        private static FRAME_TIME;
        private static TOTAL_FRAME;
        private currentFrameIndex;
        private data;
        constructor(data: MovieClipData);
        ticker: (deltaTime: any) => void;
        play(): void;
        stop(): void;
        setMovieClipData(data: MovieClipData): void;
    }
}
declare namespace engine {
    let run: (canvas: HTMLCanvasElement) => DisplayObjectContainer;
}
