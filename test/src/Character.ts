class Character extends egret.DisplayObjectContainer {

    static chara:Character;
    private callback:Function;
    _main: Main;
    _stateMachine: StateMachine;
    _body: egret.Bitmap;
    _ifidle: boolean;
    _ifmove: boolean;
    _idleState: CharacterIdleState = new CharacterIdleState(this);
    _moveState: CharacterMoveState = new CharacterMoveState(this);

    private timer:egret.Timer;

    constructor(main:Main) {
        super();
        this._main = main;
        this._body = new egret.Bitmap;
        this._body.texture = RES.getRes("chara1_png");
        this._main.addChild(this._body);
        this._body.width = 50;
        this._body.height = 50;
        this._body.anchorOffsetX = this._body.width * 0.5;
        console.log("anchorx :" + this._body.anchorOffsetX);
        this._body.anchorOffsetY = this._body.height * 0;
        this._stateMachine = new StateMachine();
        this._body.x = this._main.stage.stageWidth * 0.1 - 25;
        this._body.y = this._main.stage.stageHeight * 0.9;
        console.log(this._body.x);
        this._ifidle = true;
        this._ifmove = false;
    }

    /*public static setChara(chara:Character){
        this.chara = chara;
    }

    public static getChara():Character{
        return this.chara;
    }*/

    public commandMove(x:number,y:number,path:Point[],callback:Function){
        console.log("开始移动");
        this.move(x,y,path);
        this.callback = callback;
        //console.log(callback);
    }

    public commandStop(){
        egret.Tween.removeTweens(this._body);
        if (this.timer != null) {
            this.timer.stop();
        }
        this.idle();
    }

    public move(targetX: number, targetY: number, path: Point[]) {

        //中止缓动动画，达到实现运动中更换目标点的目的
        egret.Tween.removeTweens(this._body);
        if (this.timer != null) {
            this.timer.stop();
        }


        //触发状态机
        this._stateMachine.setState(this._moveState);

        //如果状态机将_ifwalk变量调整为true,则进入运动状态
        if (this._ifmove) {
            console.log("move");
            if (targetX > this._body.x) {
                this._body.skewY = 0;
            }
            else {
                this._body.skewY = 180;
            }
            this.startMove();

            //用Timer来实现固定间隔顺序读取路径数组中的点并移动
            var interval:number = 250;
            this.timer = new egret.Timer(interval, path.length - 1);

            this.timer.addEventListener(egret.TimerEvent.TIMER, function (e: egret.TimerEvent): void {
                egret.Tween.get(this._body).to({ x: (path[this.timer.currentCount].x + 1) * 50 - 25, y: (path[this.timer.currentCount].y) * 50 }, interval);
                console.log("target:" + path[this.timer.currentCount - 1].x + " , " + path[this.timer.currentCount - 1].y);
            }, this);

            this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function (e: egret.TimerEvent): void {
                this.idle();
                this.callback();
            }, this);

            this.timer.start();
            console.log(path.length);
        }
    }


    public idle() {

        this._stateMachine.setState(this._idleState);

        //如果状态机将_ifidle变量调整为true,则进入停止状态
        if (this._ifidle) {
            console.log("idle");
            this.startidle();
        }
    }

    //播放运动动画
    public startMove() {
        var list = ["chara1_png", "chara2_png", "chara3_png"];
        var count = 0;
        //this._body.texture = RES.getRes("3_png");
        //循环执行
        egret.Ticker.getInstance().register(() => {

            if (this._ifmove) {
                count　+= 0.2;
                if (count >= list.length) {
                    count = 0;
                }

                this._body.texture = RES.getRes(list[Math.floor(count)]);
            }

        }, this);

    }

    public startidle() {

        this._body.texture = RES.getRes("chara1_png");

    }

}