//地图配置
var config: TileData[] = [
    { x: 1, y: 1, walkable: false, image: "1_png" },
    { x: 2, y: 1, walkable: false, image: "1_png" },
    { x: 3, y: 1, walkable: false, image: "2_png" },
    { x: 4, y: 1, walkable: false, image: "2_png" },
    { x: 5, y: 1, walkable: false, image: "1_png" },
    { x: 6, y: 1, walkable: false, image: "1_png" },
    { x: 7, y: 1, walkable: false, image: "1_png" },
    { x: 8, y: 1, walkable: false, image: "1_png" },
    { x: 9, y: 1, walkable: false, image: "1_png" },
    { x: 10, y: 1, walkable: false, image: "1_png" },
    { x: 1, y: 2, walkable: false, image: "1_png" },
    { x: 2, y: 2, walkable: false, image: "2_png" },
    { x: 3, y: 2, walkable: false, image: "1_png" },
    { x: 4, y: 2, walkable: false, image: "1_png" },
    { x: 5, y: 2, walkable: false, image: "1_png" },
    { x: 6, y: 2, walkable: false, image: "2_png" },
    { x: 7, y: 2, walkable: false, image: "2_png" },
    { x: 8, y: 2, walkable: false, image: "1_png" },
    { x: 9, y: 2, walkable: false, image: "2_png" },
    { x: 10, y: 2, walkable: false, image: "1_png" },
    { x: 1, y: 3, walkable: false, image: "2_png" },
    { x: 2, y: 3, walkable: false, image: "1_png" },
    { x: 3, y: 3, walkable: false, image: "1_png" },
    { x: 4, y: 3, walkable: false, image: "2_png" },
    { x: 5, y: 3, walkable: false, image: "1_png" },
    { x: 6, y: 3, walkable: true, image: "1_png" },
    { x: 7, y: 3, walkable: true, image: "1_png" },
    { x: 8, y: 3, walkable: true, image: "1_png" },
    { x: 9, y: 3, walkable: true, image: "1_png" },
    { x: 10, y: 3, walkable: true, image: "1_png" }, //此处有npc
    { x: 1, y: 4, walkable: true, image: "2_png" },
    { x: 2, y: 4, walkable: true, image: "1_png" },
    { x: 3, y: 4, walkable: true, image: "2_png" },
    { x: 4, y: 4, walkable: true, image: "2_png" },
    { x: 5, y: 4, walkable: true, image: "1_png" },
    { x: 6, y: 4, walkable: true, image: "2_png" },
    { x: 7, y: 4, walkable: true, image: "2_png" },
    { x: 8, y: 4, walkable: false, image: "1_png" },
    { x: 9, y: 4, walkable: false, image: "2_png" },
    { x: 10, y: 4, walkable: true, image: "1_png" },
    { x: 1, y: 5, walkable: true, image: "1_png" }, //此处有npc
    { x: 2, y: 5, walkable: false, image: "1_png" },
    { x: 3, y: 5, walkable: false, image: "1_png" },
    { x: 4, y: 5, walkable: false, image: "1_png" },
    { x: 5, y: 5, walkable: false, image: "1_png" },
    { x: 6, y: 5, walkable: true, image: "1_png" },
    { x: 7, y: 5, walkable: true, image: "2_png" },
    { x: 8, y: 5, walkable: false, image: "1_png" },
    { x: 9, y: 5, walkable: false, image: "2_png" },
    { x: 10, y: 5, walkable: true, image: "1_png" },
    { x: 1, y: 6, walkable: true, image: "1_png" },
    { x: 2, y: 6, walkable: false, image: "2_png" },
    { x: 3, y: 6, walkable: false, image: "1_png" },
    { x: 4, y: 6, walkable: true, image: "2_png" },
    { x: 5, y: 6, walkable: true, image: "1_png" },
    { x: 6, y: 6, walkable: true, image: "1_png" },
    { x: 7, y: 6, walkable: false, image: "1_png" },
    { x: 8, y: 6, walkable: false, image: "1_png" },
    { x: 9, y: 6, walkable: false, image: "1_png" },
    { x: 10, y: 6, walkable: true, image: "1_png" },
    { x: 1, y: 7, walkable: true, image: "1_png" },
    { x: 2, y: 7, walkable: false, image: "2_png" },
    { x: 3, y: 7, walkable: false, image: "1_png" },
    { x: 4, y: 7, walkable: true, image: "2_png" },
    { x: 5, y: 7, walkable: false, image: "2_png" },
    { x: 6, y: 7, walkable: true, image: "1_png" },
    { x: 7, y: 7, walkable: true, image: "2_png" },
    { x: 8, y: 7, walkable: true, image: "2_png" },
    { x: 9, y: 7, walkable: true, image: "1_png" },
    { x: 10, y: 7, walkable: true, image: "2_png" },
    { x: 1, y: 8, walkable: true, image: "1_png" },
    { x: 2, y: 8, walkable: true, image: "1_png" },
    { x: 3, y: 8, walkable: true, image: "1_png" },
    { x: 4, y: 8, walkable: true, image: "1_png" },
    { x: 5, y: 8, walkable: true, image: "1_png" },
    { x: 6, y: 8, walkable: true, image: "1_png" },
    { x: 7, y: 8, walkable: true, image: "2_png" },
    { x: 8, y: 8, walkable: false, image: "1_png" },
    { x: 9, y: 8, walkable: false, image: "1_png" },
    { x: 10, y: 8, walkable: true, image: "2_png" },
    { x: 1, y: 9, walkable: true, image: "1_png" },
    { x: 2, y: 9, walkable: false, image: "2_png" },
    { x: 3, y: 9, walkable: false, image: "1_png" },
    { x: 4, y: 9, walkable: false, image: "2_png" },
    { x: 5, y: 9, walkable: true, image: "2_png" },
    { x: 6, y: 9, walkable: true, image: "1_png" },
    { x: 7, y: 9, walkable: true, image: "1_png" },
    { x: 8, y: 9, walkable: false, image: "1_png" },
    { x: 9, y: 9, walkable: false, image: "2_png" },
    { x: 10, y: 9, walkable: true, image: "1_png" },
    { x: 1, y: 10, walkable: true, image: "1_png" },
    { x: 2, y: 10, walkable: false, image: "1_png" },
    { x: 3, y: 10, walkable: false, image: "1_png" },
    { x: 4, y: 10, walkable: false, image: "1_png" },
    { x: 5, y: 10, walkable: false, image: "1_png" },
    { x: 6, y: 10, walkable: false, image: "1_png" },
    { x: 7, y: 10, walkable: true, image: "2_png" },
    { x: 8, y: 10, walkable: true, image: "2_png" },
    { x: 9, y: 10, walkable: true, image: "1_png" },
    { x: 10, y: 10, walkable: true, image: "1_png" },
]

interface TileData {
    x: number;
    y: number;
    walkable: boolean;
    image: string;
}


//格子类
class Tile extends engine.DisplayObjectContainer {

    data: TileData;

    constructor(data: TileData) {
        super();
        this.data = data;
        var bitmap = new engine.Bitmap;
        var size: number = 50;
        //bitmap.img.src = "resource/assets/" + data.image;
        bitmap.x = (data.x - 1) * size;
        bitmap.y = (data.y - 1) * size;
        this.addChild(bitmap);
        //console.log(data.image)
    }

    public clickEvent(): void {
        console.log(this.x);
        console.log(this.y);
    }
}

//地图类
class TileMap extends engine.DisplayObjectContainer {

    public static TILE_SIZE = 100;
    public map: engine.Bitmap = new engine.Bitmap;
    //private static instance;

    //public static getInstance() {
    //    if (TileMap.instance == null) {
    //        TileMap.instance = new TileMap;
    //    }
    //    return TileMap.instance;
    //}

    constructor() {
        super();
        this.init();
    }

    private init() {

        for (var i = 0; i < config.length; i++) {
            var data = config[i];
            var tile = new Tile(data);
            this.addChild(tile);
            //console.log("init success")
        }
        this.map.img.src = "resource/assets/map.png";
        this.addChild(this.map);
        //this.touchEnabled = true;



    }

    public initEventListener(chara: Character) {
        this.addEventListener(engine.TouchType.TOUCH_TAP, (e:MouseEvent) => {
            //console.log(e.currentTarget);
            var startx: number = Math.floor((chara._body.x) / 50);
            var starty: number = Math.floor(chara._body.y / 50);
            var endx: number = Math.floor(e.offsetX/ 50);
            var endy: number = Math.floor(e.offsetY / 50);
            //console.log("stageX:" + e.stageX + "stageY:" + e.stageY);
            //if (e.localX >= 450 && e.localX <= 500 && e.localY >= 100 && e.localY <= 150) {
            //    endx = 8;
            //    endy = 2;
            //}
            //console.log("endx:" + endx + "endy:" + endy);
            var path: Point[] = this.astarPath(startx, starty, endx, endy);
            if (path.length > 1) {
                if (startx != endx || starty != endy) {
                    CommandList.getInstance().addCommand(new WalkCommand(e.offsetX, e.offsetY, path, chara));
                    CommandList.getInstance().execute();
                    //console.log("addWalkCommand and execute");
                    //chara.move(e.localX, e.localY, path);
                }
            }
        });
    }

    private grid: Grid = new Grid(10, 10);
    private astar: AStar = new AStar();

    public astarPath(beginX: number, beginY: number, endX: number, endY: number): Point[] {

        var path: Point[] = new Array();
        this.grid.setStartPoint(beginX, beginY);
        this.grid.setEndPoint(endX, endY);

        if (this.astar.findPath(this.grid)) {
            path = this.astar.getPath();
        }

        return path;

    }

}

