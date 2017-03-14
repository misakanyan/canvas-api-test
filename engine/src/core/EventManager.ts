namespace engine{

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

    export class TouchEvent {

        static TOUCH_MOVE: "touchMove";
        static TOUCH_BEGIN: "touchBegin";
        static TOUCH_END: "mouseup";
        static TOUCH_CANCEL: "touchCancel";
        static TOUCH_TAP: "mousedown";

    }

    export class TimerEvent {

        static TIMER: "timerStart";
        static TIMER_COMPLETE: "timerComplete";

    }

}