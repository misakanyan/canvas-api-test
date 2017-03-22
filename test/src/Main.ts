// var canvas = document.getElementById("app") as HTMLCanvasElement;
// var stage = engine.run(canvas);
// var image = new engine.Bitmap();
// image.img.src = "monster.jpg";
//     image.scaleX = 2;
//     image.scaleY = 2;
//     image.x = 60;
//     image.y = 10;
//     image.relativeAlpha = 0.9;
//     image.rotation = 15;
// stage.addChild(image);
// let speed = 10;

// engine.Ticker.getInstance().register((deltaTime) => {
//     console.log("aaa")
//     image.x += 1;
// });

var canvas = document.getElementById("canvas") as HTMLCanvasElement;
var stage = engine.run(canvas);
console.log("loading")
setTimeout(function() {
    var main= new Main(stage);
    stage.addChild(main);
    console.log("loaded")
}, 5000);

class Main extends engine.DisplayObjectContainer {

    stage:engine.DisplayObjectContainer;

    //public list = new CommandList();
    //public panel = new Panel();

    constructor(stage:engine.DisplayObjectContainer){
        super();
        this.stage=stage;
        this.createGameScene();
    }

        /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {

        var scene:GameScene = new GameScene(this);

        //添加地图
        //var map: TileMap = new TileMap();
        //this.addChild(map);
        //this.astarPath(9,0);
        //TileMap.getInstance().init(chara);
        //this.addChild(TileMap.getInstance());

        //var chara: Character = new Character(this);
        //this.addChild(chara);
        //chara.idle();

        //TileMap.getInstance().initEventListener(chara);
        

        //添加点击监听
        /*this.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e: egret.TouchEvent): void {
            //console.log(e.currentTarget);
                var startx: number = Math.floor((chara._body.x) / 50);
                var starty: number = Math.floor(chara._body.y / 50);
                var endx: number = Math.floor(e.stageX / 50);
                var endy: number = Math.floor(e.localY / 50);
                console.log("stageX:" + e.stageX + "stageY:" + e.stageY);
                if (e.stageX >= 450 && e.stageX <= 500 && e.stageY >= 100 && e.stageY <= 150) {
                    endx = 8;
                    endy = 2;
                }
                console.log("endx:" + endx + "endy:" + endy);
                var path: Point[] = map.astarPath(startx - 1, starty, endx, endy);
                if (path.length > 0) {
                    chara.move(e.localX, e.localY, path);
                }
        }, this);*/

        TaskService.getInstance().init();
        SceneService.getInstance().init();
        
        for (var i: number = 0; i < NPCManager.getInstance().NPCList.length; i++) {
            this.addChild(NPCManager.getInstance().NPCList[i]);
        }
        for (var i: number = 0; i < SceneService.getInstance().monsterList.length; i++) {
            this.addChild(SceneService.getInstance().monsterList[i]);
        }

        var panel = new TaskPanel();
        panel.x = 0;
        panel.y = 0;
        this.addChild(panel);
        TaskService.getInstance().addObserver(panel);

        this.addChild(NPCManager.getInstance().dialog);

        //Bag.getInstance().initBag();
        //this.addChild(Bag.getInstance());
        //Bag.getInstance().addItemToBag("灰烬使者（双持）");


        /* TaskService.getInstance().init();
        for(var i:number = 0;i<NPCManager.NPCList.length;i++){
            this.addChild(NPCManager.NPCList[i]);
        }

        var panel = new TaskPanel();
        panel.x = 0;
        panel.y = 0;
        this.addChild(panel);
        TaskService.getInstance().addObserver(panel);*/

    }
}

