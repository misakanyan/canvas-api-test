namespace engine {

    export class EventManager {
        targets: DisplayObject[];
        static eventManager: EventManager;
        constructor() {

        }
        static getInstance() {
            if (EventManager.eventManager == null) {
                EventManager.eventManager = new EventManager();
                EventManager.eventManager.targets = new Array();
                return EventManager.eventManager;
            } else {
                return EventManager.eventManager;
            }
        }
    }

    export class TheEvent {
        type = "";
        ifCapture = false;
        target: DisplayObject;
        func: Function;
        constructor(eventType: string, func: Function, target: DisplayObject, ifCapture: boolean) {
            this.type = eventType;
            this.ifCapture = ifCapture;
            this.func = func;
            this.target = target;
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