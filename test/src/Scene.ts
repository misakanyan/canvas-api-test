interface SceneObserver {
    onChange(task: Task);
}

class SceneService {

    private observerList: SceneObserver[] = [];
    public taskList: Task[] = [];
    public monsterList: Monster[] = [];
    private static instance;
    private callback: Function;
    //private monsterPanel: MonsterPanel = new MonsterPanel();;

    public static getInstance() {
        if (SceneService.instance == null) {
            SceneService.instance = new SceneService;
        }
        return SceneService.instance;
    }

    init() {
        var data = RES.getRes("gameconfig_json");
        for (var i: number = 0; i < data.monsters.length; i++) {
            this.monsterList.push(new Monster(data.monsters[i].image, data.monsters[i].id, data.monsters[i].linkTaskId));
            let task = TaskService.getInstance().taskList[data.monsters[i].linkTaskId];
            this.taskList.push(task);
        }
        //this.monsterList.push(new Monster("monster_jpg","0","1"));
        //this.taskList.push(TaskService.getInstance().taskList[1]); //临时往里面塞一个任务触发用
        for (var i: number = 0; i < this.monsterList.length; i++) {
            this.observerList.push(this.monsterList[i]);
        }
        this.observerList.push(new KillMonsterTaskCondition());
    }

    wakeUpMonster(id: string) {
        for (var i: number = 0; i < this.monsterList.length; i++) {
            if (this.monsterList[i].id == id) {
                this.monsterList[i].onAwake();
            }
        }
    }

    killMonster(id: string) {
        //console.log(id);
        for (var i: number = 0; i < this.monsterList.length; i++) {
            if (this.monsterList[i].id == id) {
                this.monsterList[i].onSleep();
                this.callback();
                Bag.getInstance().addItemToBag("血腥砍刀")//掉落
                //console.log("make monster sleep");
            }
        }
    }

    addObserver(o: Observer) {
        this.observerList.push(o);
    }

    notify(task: Task) {
        for (var i: number = 0; i < SceneService.getInstance().observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    }

    commandFight(linkTaskId: string, callback: Function) {
        this.callback = callback;
        this.accept(linkTaskId);
        //console.log("commandFight");
    }

    accept(id: string) {
        //console.log("accept monster:"+id);
        for (var i: number = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == id) {
                console.log("accept success");
                let task = this.taskList[i];
                this.notify(task);
                break;
            }
        }
        //this.notify(this.taskList[0]);  //这个是临时的任务
    }

    submit(id: string) {

    }

}

/*class MonsterPanel extends egret.DisplayObjectContainer {
    private bg: egret.Bitmap = new egret.Bitmap;
    private currentMonster: Monster;
    constructor() {
        super();
    }
    private onClick() {
        SceneService.getInstance().accept(this.currentMonster._linkTaskId);
    }
    public Awake(monster:Monster){
        this.currentMonster = monster;
        this.bg.texture = RES.getRes("monster_jpg");
        this.bg.x = this.currentMonster.x + 50;
        this.bg.y = this.currentMonster.y + 50;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.bg.touchEnabled = true;
        this.addChild(this.bg);
        //this.addChild(this.bg);
        console.log("monster panel awake");
        console.log(this.bg);
    }
    public Sleep(){
        this.removeChild(this.bg);
    }
}*/

class Monster extends egret.DisplayObjectContainer implements SceneObserver {

    public _image: egret.Bitmap = new egret.Bitmap;
    public _count: egret.Shape = new egret.Shape;
    public _id: string;
    public _linkTaskId: string;
    public isFight: boolean = false;
    private count: number = 9;

    constructor(image: string, id: string, taskId: string) {
        super();
        this._id = id;
        this._linkTaskId = taskId;
        this._image.texture = RES.getRes(image);
        this._count.graphics.clear();
        this._count.graphics.beginFill(0xff0000, 1.0);
        this._count.graphics.drawRect(0, 0, 50, 5);
        this._count.graphics.endFill();
        this.width = 50;
        this.height = 50;
        this.x = 200;
        this.y = 350;
        this._image.touchEnabled = true;
        //this.addChild(this._image);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    public get id() {
        return this._id;
    }

    public get linkTaskId() {
        return this._linkTaskId;
    }

    private onClick(e: egret.TouchEvent) {
        var startx: number = Math.floor((GameScene.chara._body.x) / 50);
        var starty: number = Math.floor(GameScene.chara._body.y / 50);
        var endx: number = Math.floor(e.stageX / 50);
        var endy: number = Math.floor(e.stageY / 50);
        var path: Point[] = GameScene.map.astarPath(startx, starty, endx, endy);
        //console.log("startx " + startx + "starty " + starty + "endx " + endx + "endy " + endy);
        path.pop(); //去掉Monster所在的点

        if (path.length > 0 && !this.isFight) {
            CommandList.getInstance().addCommand(new WalkCommand(e.localX, e.localY, path, GameScene.chara));
            CommandList.getInstance().addCommand(new FightCommand(this._linkTaskId));
            CommandList.getInstance().execute();
            this.isFight = true;
        } else if (this.isFight) {
            CommandList.getInstance().addCommand(new FightCommand(this._linkTaskId));
            CommandList.getInstance().execute();
            this.count--;
            this._count.graphics.clear();
            this._count.graphics.beginFill(0xff0000, 1.0);
            this._count.graphics.drawRect(0, 0, 50 * (this.count / 9), 5);
            this._count.graphics.endFill();
        }
        //SceneService.getInstance().accept(this._linkTaskId);//移至Command
    }

    onAwake() {
        this.addChild(this._image);
        this.addChild(this._count);
    }

    onSleep() {
        this.removeChild(this._image);
        this.removeChild(this._count);
    }

    onChange(task: Task) {

    }

}

class GameScene {

    private static scene: GameScene;
    static map: TileMap;
    static chara: Character;

    constructor(main: Main) {
        GameScene.map = new TileMap();
        main.addChild(GameScene.map);
        GameScene.chara = new Character(main);
        main.addChild(GameScene.chara);
        GameScene.chara.idle();
        GameScene.map.initEventListener(GameScene.chara);
    }

    public static replaceScene(scene: GameScene) {
        GameScene.scene = scene;
    }

    public static getCurrentScene(): GameScene {
        return GameScene.scene;
    }

    public moveTo(x: number, y: number, callback: Function) {
        console.log("开始移动")
        egret.setTimeout(function () {
            console.log("结束移动")
            callback();
        }, this, 500)
    }

    public stopMove(callback: Function) {
        console.log("取消移动")
        callback();
    }

}