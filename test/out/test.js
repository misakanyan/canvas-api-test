var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//AStar寻路
var AStar = (function () {
    //private _diagCost: number = Math.SQRT2;
    function AStar() {
        this._heuristic = this.euclidian;
        this._straightCost = 1;
    }
    AStar.prototype.findPath = function (grid) {
        this._grid = grid;
        this._openList = new Array();
        this._closeList = new Array();
        this._startPoint = this._grid.getStartPoint();
        this._endPoint = this._grid.getEndPoint();
        this._startPoint.g = 0;
        this._startPoint.h = this._heuristic(this._startPoint);
        this._startPoint.f = this._startPoint.g + this._startPoint.h;
        //console.log("findpath");
        return this.search();
    };
    //主搜寻方法
    AStar.prototype.search = function () {
        var searchpoint = this._startPoint;
        while (searchpoint != this._endPoint) {
            //获取当前点的周围点
            var startX = Math.max(0, searchpoint.x - 1);
            var endX = Math.min(this._grid.getNumCols() - 1, searchpoint.x + 1);
            var startY = Math.max(0, searchpoint.y - 1);
            var endY = Math.min(this._grid.getNumRows() - 1, searchpoint.y + 1);
            //循环处理每个点
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var test = this._grid.getPoint(i, j);
                    //剔除：当前点、不可经过的点、斜线方向的点（即只能直线移动）
                    if (test == searchpoint || !test.walkable || Math.abs(i - searchpoint.x) + Math.abs(j - searchpoint.y) == 2) {
                        continue;
                    }
                    var cost = this._straightCost;
                    /*if (!((searchpoint.x == test.x) || (searchpoint.y == test.y))) {
                        cost = this._diagCost;
                    }*/
                    var g = searchpoint.g + cost;
                    var h = this._heuristic(test);
                    var f = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = searchpoint;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = searchpoint;
                        this._openList.push(test);
                    }
                }
            }
            this._closeList.push(searchpoint);
            if (this._openList.length == 0) {
                alert("no path found");
                return false;
            }
            this._openList.sort(function (a, b) {
                return a.f - b.f;
            });
            searchpoint = this._openList.shift();
        }
        this.buildPath();
        //console.log("buildpath");
        return true;
    };
    //根据建立的点链表回推路径
    AStar.prototype.buildPath = function () {
        this._path = new Array();
        var point = this._endPoint;
        this._path.push(point);
        while (point != this._startPoint) {
            point = point.parent;
            this._path.unshift(point);
        }
        //console.log(point);
    };
    //获取路径
    AStar.prototype.getPath = function () {
        return this._path;
    };
    //判断是否处于O表内
    AStar.prototype.isOpen = function (point) {
        for (var i = 0; i < this._openList.length; i++) {
            if (this._openList[i] == point) {
                return true;
            }
        }
        return false;
    };
    //判断是否处于C表内
    AStar.prototype.isClosed = function (point) {
        for (var i = 0; i < this._closeList.length; i++) {
            if (this._closeList[i] == point) {
                return true;
            }
        }
        return false;
    };
    //欧几里得启发函数
    AStar.prototype.euclidian = function (point) {
        var result = Math.sqrt(Math.pow(point.x - this._endPoint.x, 2) + Math.pow(point.y - this._endPoint.y, 2));
        return result;
    };
    AStar.prototype.visited = function () {
        return this._closeList.concat(this._openList);
    };
    return AStar;
}());
var Grid = (function () {
    function Grid(numCols, numRows) {
        this._points = [];
        this._numCols = numCols;
        this._numRows = numRows;
        this._points = new Array();
        for (var i = 0; i < this._numCols; i++) {
            this._points[i] = new Array();
            for (var j = 0; j < this._numRows; j++) {
                this._points[i][j] = new Point(i, j);
            }
        }
    }
    Grid.prototype.getPoint = function (x, y) {
        return this._points[x][y];
    };
    Grid.prototype.setEndPoint = function (x, y) {
        this._endPoint = this._points[x][y];
    };
    Grid.prototype.setStartPoint = function (x, y) {
        this._startPoint = this._points[x][y];
    };
    Grid.prototype.setWalkable = function (x, y, value) {
        this._points[x][y].walkable = value;
    };
    Grid.prototype.getStartPoint = function () {
        return this._startPoint;
    };
    Grid.prototype.getEndPoint = function () {
        return this._endPoint;
    };
    Grid.prototype.getNumCols = function () {
        return this._numCols;
    };
    Grid.prototype.getNumRows = function () {
        return this._numRows;
    };
    return Grid;
}());
var Point = (function () {
    function Point(x, y) {
        this.walkable = true;
        this.x = x;
        this.y = y;
        this.walkable = config[x + y * 10].walkable; //通过config数组获取walkable
        //console.log(this.walkable);
    }
    return Point;
}());
//地图配置
var config = [
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
    { x: 10, y: 3, walkable: true, image: "1_png" },
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
    { x: 1, y: 5, walkable: true, image: "1_png" },
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
];
//格子类
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(data) {
        _super.call(this);
        this.data = data;
        var bitmap = new engine.Bitmap;
        var size = 50;
        bitmap.texture = "resource/assets/" + data.image;
        bitmap.x = (data.x - 1) * size;
        bitmap.y = (data.y - 1) * size;
        this.addChild(bitmap);
        //console.log(data.image)
    }
    Tile.prototype.clickEvent = function () {
        console.log(this.x);
        console.log(this.y);
    };
    return Tile;
}(engine.DisplayObjectContainer));
//地图类
var TileMap = (function (_super) {
    __extends(TileMap, _super);
    //private static instance;
    //public static getInstance() {
    //    if (TileMap.instance == null) {
    //        TileMap.instance = new TileMap;
    //    }
    //    return TileMap.instance;
    //}
    function TileMap() {
        _super.call(this);
        this.map = new engine.Bitmap;
        // public initEventListener(chara: Character) {
        //     this.addEventListener(engine.TouchEvent.TOUCH_TAP, (e:MouseEvent) => {
        //         //console.log(e.currentTarget);
        //         var startx: number = Math.floor((chara._body.x) / 50);
        //         var starty: number = Math.floor(chara._body.y / 50);
        //         var endx: number = Math.floor(e.localX / 50);
        //         var endy: number = Math.floor(e.localY / 50);
        //         //console.log("stageX:" + e.stageX + "stageY:" + e.stageY);
        //         //if (e.localX >= 450 && e.localX <= 500 && e.localY >= 100 && e.localY <= 150) {
        //         //    endx = 8;
        //         //    endy = 2;
        //         //}
        //         //console.log("endx:" + endx + "endy:" + endy);
        //         var path: Point[] = this.astarPath(startx, starty, endx, endy);
        //         if (path.length > 1) {
        //             if (startx != endx || starty != endy) {
        //                 CommandList.getInstance().addCommand(new WalkCommand(e.localX, e.localY, path, chara));
        //                 CommandList.getInstance().execute();
        //                 //console.log("addWalkCommand and execute");
        //                 //chara.move(e.localX, e.localY, path);
        //             }
        //         }
        //     }, this,false);
        // }
        this.grid = new Grid(10, 10);
        this.astar = new AStar();
        this.init();
    }
    TileMap.prototype.init = function () {
        for (var i = 0; i < config.length; i++) {
            var data = config[i];
            var tile = new Tile(data);
            this.addChild(tile);
        }
        this.map.texture = "resource/assets/map.png";
        this.addChild(this.map);
        //this.touchEnabled = true;
    };
    TileMap.prototype.astarPath = function (beginX, beginY, endX, endY) {
        var path = new Array();
        this.grid.setStartPoint(beginX, beginY);
        this.grid.setEndPoint(endX, endY);
        if (this.astar.findPath(this.grid)) {
            path = this.astar.getPath();
        }
        return path;
    };
    TileMap.TILE_SIZE = 100;
    return TileMap;
}(engine.DisplayObjectContainer));
// let mapJason=[
//     { x: 0, y: 0, walkAble: false },
//     { x: 64, y: 0, walkAble: false },
//     { x: 128, y: 0, walkAble: false },
//     { x: 192, y: 0, walkAble: false },
//     { x: 256, y: 0, walkAble: false },
//     { x: 320, y: 0, walkAble: false },
//     { x: 384, y: 0, walkAble: false },
//     { x: 448, y: 0, walkAble: false },
//     { x: 512, y: 0, walkAble: false },
//     { x: 576, y: 0, walkAble: false },
//     { x: 0, y: 64, walkAble: false },
//     { x: 64, y: 64, walkAble: false },
//     { x: 128, y: 64, walkAble: false },
//     { x: 192, y: 64, walkAble: false },
//     { x: 256, y: 64, walkAble: false },
//     { x: 320, y: 64, walkAble: false },
//     { x: 384, y: 64, walkAble: false },
//     { x: 448, y: 64, walkAble: false },
//     { x: 512, y: 64, walkAble: false },
//     { x: 576, y: 64, walkAble: false },
//     { x: 0, y: 128, walkAble: false },
//     { x: 64, y: 128, walkAble: false },
//     { x: 128, y: 128, walkAble: false },
//     { x: 192, y: 128, walkAble: false },
//     { x: 256, y: 128, walkAble: false },
//     { x: 320, y: 128, walkAble: false },
//     { x: 384, y: 128, walkAble: false },
//     { x: 448, y: 128, walkAble: false },
//     { x: 512, y: 128, walkAble: false },
//     { x: 576, y: 128, walkAble: false },
//     { x: 0, y: 192, walkAble: false },
//     { x: 64, y: 192, walkAble: false },
//     { x: 128, y: 192, walkAble: false },
//     { x: 192, y: 192, walkAble: false },
//     { x: 256, y: 192, walkAble: false },
//     { x: 320, y: 192, walkAble: false },
//     { x: 384, y: 192, walkAble: false },
//     { x: 448, y: 192, walkAble: false },
//     { x: 512, y: 192, walkAble: false },
//     { x: 576, y: 192, walkAble: false },
//     { x: 0, y: 256, walkAble: false },
//     { x: 64, y: 256, walkAble: false },
//     { x: 128, y: 256, walkAble: false },
//     { x: 192, y: 256, walkAble: false },
//     { x: 256, y: 256, walkAble: false },
//     { x: 320, y: 256, walkAble: false },
//     { x: 384, y: 256, walkAble: false },
//     { x: 448, y: 256, walkAble: false },
//     { x: 512, y: 256, walkAble: false },
//     { x: 576, y: 256, walkAble: false },
//     { x: 0, y: 320, walkAble: false },
//     { x: 64, y: 320, walkAble: false },
//     { x: 128, y: 320, walkAble: false },
//     { x: 192, y: 320, walkAble: false },
//     { x: 256, y: 320, walkAble: false },
//     { x: 320, y: 320, walkAble: false },
//     { x: 384, y: 320, walkAble: false },
//     { x: 448, y: 320, walkAble: false },
//     { x: 512, y: 320, walkAble: false },
//     { x: 576, y: 320, walkAble: false },
//     { x: 0, y: 384, walkAble: false },
//     { x: 64, y: 384, walkAble: false },
//     { x: 128, y: 384, walkAble: false },
//     { x: 192, y: 384, walkAble: false },
//     { x: 256, y: 384, walkAble: false },
//     { x: 320, y: 384, walkAble: false },
//     { x: 384, y: 384, walkAble: false },
//     { x: 448, y: 384, walkAble: false },
//     { x: 512, y: 384, walkAble: false },
//     { x: 576, y: 384, walkAble: false },
//     { x: 0, y: 448, walkAble: false },
//     { x: 64, y: 448, walkAble: false },
//     { x: 128, y: 448, walkAble: false },
//     { x: 192, y: 448, walkAble: false },
//     { x: 256, y: 448, walkAble: false },
//     { x: 320, y: 448, walkAble: false },
//     { x: 384, y: 448, walkAble: false },
//     { x: 448, y: 448, walkAble: false },
//     { x: 512, y: 448, walkAble: false },
//     { x: 576, y: 448, walkAble: false },
//     { x: 0, y: 512, walkAble: false },
//     { x: 64, y: 512, walkAble: false },
//     { x: 128, y: 512, walkAble: false },
//     { x: 192, y: 512, walkAble: false },
//     { x: 256, y: 512, walkAble: false },
//     { x: 320, y: 512, walkAble: false },
//     { x: 384, y: 512, walkAble: false },
//     { x: 448, y: 512, walkAble: false },
//     { x: 512, y: 512, walkAble: false },
//     { x: 576, y: 512, walkAble: false },
//     { x: 0, y: 576, walkAble: false },
//     { x: 64, y: 576, walkAble: false },
//     { x: 128, y: 576, walkAble: false },
//     { x: 192, y: 576, walkAble: false },
//     { x: 256, y: 576, walkAble: false },
//     { x: 320, y: 576, walkAble: false },
//     { x: 384, y: 576, walkAble: false },
//     { x: 448, y: 576, walkAble: false },
//     { x: 512, y: 576, walkAble: false },
//     { x: 576, y: 576, walkAble: false },
// ];
// let ROW=10;
// let LIST=10;
// let STONEPROBBILITY=0.2;
// let ONETILESIZE=64;
// let manhadun=0;
// let ojilide=1;
// let duijiaoxian=2;
// class tile extends engine.DisplayObjectContainer{
//     constructor(){
//         super();
//         this.bitmap=new engine.Bitmap();
//         this.bitmap.x=0;
//         this.bitmap.y=0;
//         this.addChild(this.bitmap);
//         this.weight=0;
//         this.preTile=null;
//         this.touchEnabled=true;
//     }
//     public walkAble:boolean;
//     public bitmap:engine.Bitmap;
//     public weight:number;
//     public preTile:tile;
// }
// class MainMap extends engine.DisplayObjectContainer{
//     private myMap:tile[];
//     private path:tile[];
//     private hasPath:boolean;
//     constructor(){
//         super();
//         this.myMap=new Array();
//         this.path=new Array();
//         for(let i=0;i<ROW*LIST;i++){
//             if(Math.random()<=STONEPROBBILITY){
//                 mapJason[i].walkAble=false;
//             }else{
//                 mapJason[i].walkAble=true;
//             }
//         }
//         //人物初始位置不能为障碍物
//         mapJason[0].walkAble=true;
//         mapJason[22].walkAble=true;
//         mapJason[44].walkAble=true;
//         mapJason[99].walkAble=true;
//         for(let i=0;i<ROW*LIST;i++){
//             this.myMap[i]=new tile();
//             this.myMap[i].walkAble=mapJason[i].walkAble;
//             this.myMap[i].x=mapJason[i].x;
//             this.myMap[i].y=mapJason[i].y;
//             if(this.myMap[i].walkAble){
//                 this.myMap[i].bitmap.texture="path.jpg";
//             }else{
//                 this.myMap[i].bitmap.texture="wall.jpg";
//             }
//             this.addChild(this.myMap[i]);
//         }
//     }
//     private estimulate(start:tile,end:tile,method:number):number{
//         if (method == 0){
//             return Math.abs(end.x / ONETILESIZE - start.x / ONETILESIZE) + Math.abs(end.y / ONETILESIZE - start.y / ONETILESIZE);
//         }
//         if (method == 1) {
//             return Math.sqrt((start.x - end.x) * (start.x - end.x) + (start.y - end.y) * (start.y - end.y));
//         }
//         if(method==2){
//             return  Math.sqrt((start.x - Math.abs(end.x-start.x)/2) * (start.x - Math.abs(end.x-start.x)/2) + (start.y - end.y/2) * (start.y - end.y/2))+Math.abs(end.x-start.x)/2;
//         }
//     }
//     private sortWeight(a:tile,b:tile){
//         return a.weight-b.weight;
//     }
//     private generatePath(start:tile,end:tile){
//         //清空路径
//         let x=this.path.length;
//         for(let i=0;i<x;i++){
//             this.path.pop();
//         }
//         this.path.pop();
//         //起终点是否相同
//         if (start != end) {
//             for (let temp = end; temp != start; temp = temp.preTile) {
//                 this.path.push(temp);
//             }
//         } else if (start = end) {
//             this.path.push(start);
//         }
//         this.path.reverse();
//     }
//     public findWay(startTile: tile, endTile: tile): boolean {
//         startTile = this.myMap[startTile.y * ROW + startTile.x];
//         endTile = this.myMap[endTile.y * ROW + endTile.x];
//         if (endTile.walkAble == false) {
//             console.log("(" + endTile.x + "," + endTile.y + ")" + "不可达");
//             return false;
//         }else if(startTile==endTile){
//             console.log("起点终点相同" + "  不移动");
//             this.generatePath(startTile,endTile);
//             return true;
//         }
//         let currentTile: tile = startTile;
//         currentTile.weight = 0;
//         currentTile.preTile=null;
//         let openList: tile[] = new Array();
//         let closedList: tile[] = new Array();
//         while (currentTile != endTile) {
//             closedList.push(currentTile);
//             let tempOpenList: tile[] = new Array();
//             for (let i = currentTile.x - 1 * ONETILESIZE; i < currentTile.x + 2 * ONETILESIZE; i += ONETILESIZE) {
//                 for (let j = currentTile.y - 1 * ONETILESIZE; j < currentTile.y + 2 * ONETILESIZE; j += ONETILESIZE) {
//                     //判断是否超出地图
//                     if (i < 0 || j < 0 || j > 9 * ONETILESIZE || i > 9 * ONETILESIZE) {
//                         continue;
//                     }
//                     //判断斜线是否可走
//                     if (i == currentTile.x - 1 * ONETILESIZE && j == currentTile.y - 1 * ONETILESIZE ) {
//                         if(this.myMap[(j / ONETILESIZE) * ROW + i / ONETILESIZE+1].walkAble==false &&this.myMap[((j / ONETILESIZE)+1) * ROW + i / ONETILESIZE].walkAble==false){
//                             continue;
//                         }
//                     }else if(i == currentTile.x - 1 * ONETILESIZE && j == currentTile.y + 1 * ONETILESIZE){
//                         if(this.myMap[(j / ONETILESIZE) * ROW + i / ONETILESIZE+1].walkAble==false &&this.myMap[((j / ONETILESIZE)-1) * ROW + i / ONETILESIZE].walkAble==false){
//                             continue;
//                         }
//                     }else if(i == currentTile.x + 1 * ONETILESIZE && j == currentTile.y - 1 * ONETILESIZE){
//                         if(this.myMap[(j / ONETILESIZE) * ROW + i / ONETILESIZE-1].walkAble==false &&this.myMap[((j / ONETILESIZE)+1) * ROW + i / ONETILESIZE].walkAble==false){
//                             continue;
//                         }
//                     }else if(i == currentTile.x + 1 * ONETILESIZE && j == currentTile.y + 1 * ONETILESIZE){
//                         if(this.myMap[(j / ONETILESIZE) * ROW + i / ONETILESIZE-1].walkAble==false &&this.myMap[((j / ONETILESIZE)-1) * ROW + i / ONETILESIZE].walkAble==false){
//                             continue;
//                         }
//                     }
//                     //计算G函数步进
//                     let dg = 0;
//                     if ((i == currentTile.x - 1 * ONETILESIZE && j == currentTile.y) || (i == currentTile.x + 1 * ONETILESIZE && j == currentTile.y) || (i == currentTile.x && j == currentTile.y - 1 * ONETILESIZE) || (i == currentTile.x && j == currentTile.y + 1 * ONETILESIZE)) {
//                         dg = 1;
//                     } else {
//                         dg = 1.4;
//                     }
//                     let testTile: tile = this.myMap[(j / ONETILESIZE) * ROW + i / ONETILESIZE];
//                     // console.log("当前判断砖块坐标：" + "(" + i / ONETILESIZE + "," + j / ONETILESIZE + ")");
//                     //判断是否为当前地面
//                     if (testTile==currentTile) {
//                         continue;
//                     }
//                     //判断8向联通的地面是否可走，不可走则跳过此次判断
//                     else if (testTile.walkAble == false) {
//                         continue;
//                     }
//                     //判断是否在未考察序列
//                     else if (testTile.walkAble) {
//                         //testTile到达endtile
//                         if (testTile == endTile) {
//                             endTile.preTile = currentTile;
//                             // console.log("(" + endTile.x + "," + endTile.y + ")" + "已达到");
//                             this.generatePath(startTile,endTile);
//                             return true;
//                         }
//                         //计算testtile权值
//                         else if (openList.indexOf(testTile) == -1 && closedList.indexOf(testTile) == -1) {
//                             tempOpenList.push(testTile);
//                             // console.log("openlist +"+"("+testTile.x+","+testTile.y+")");
//                             testTile.weight = currentTile.weight + dg + this.estimulate(testTile, endTile, ojilide);
//                             testTile.preTile = currentTile;
//                         }
//                     }
//                 }
//             }
//             if (openList.indexOf(currentTile) != -1) {
//                 let p = openList.indexOf(currentTile);
//                 for (let i = p; i < openList.length - 1; i++) {
//                     openList[i] = openList[i + 1];
//                 }
//                 openList.pop();
//                 // console.log("openlist -"+"("+currentTile.x+","+currentTile.y+")");
//             }
//             if (tempOpenList.length != 0) {
//                 tempOpenList.sort(this.sortWeight);
//                 currentTile = tempOpenList.shift();;
//                 for (let i = 0; i < tempOpenList.length; i++) {
//                     openList.push(tempOpenList[i]);
//                 }
//                 // console.log("此次判断最小权值：" + currentTile.weight);
//                 // console.log("此次选择点坐标：（" + currentTile.x + "," + currentTile.y + ")");
//             }
//             else if (openList.length != 0) {
//                 openList.sort(this.sortWeight);
//                 currentTile = openList[0];
//                 // console.log("当前点已经无路可走");
//                 // console.log("选择开放列表中的最小权值：" + currentTile.weight);
//                 // console.log("开放列表中选择点坐标：（" + currentTile.x + "," + currentTile.y + ")");
//             } else {
//                 console.log("当前判断列表为空且开放列表为空，未找到路径");
//                 return false;
//             }
//         }
//     }
//     public getPath():tile[]{
//         if(this.path.length!=0){
//             return this.path;
//         }else{
//             console.log("暂时无路");
//             return null;
//         }
//     }
// } 
var canvas = document.getElementById("app");
var stage = engine.run(canvas);
var newMap = new TileMap();
newMap.x = 0;
newMap.y = 0;
stage.addChild(newMap);
// var Character: Player = new Player();
// Character.x = 0;
// Character.y = 0;
// stage.addChild(Character);
// var taskService: TaskService = TaskService.getInstance();
// var task_0: Task = TaskFactory.createOneTask("task_0");
// var task_1: Task = TaskFactory.createOneTask("task_1");
// var npc_0: NPC = new NPC("npc_0", "npc_0.png");
// npc_0.x = 128;
// npc_0.y = 128;
// stage.addChild(npc_0);
// var npc_1: NPC = new NPC("npc_1", "npc_1.png");
// npc_1.x = 576;
// npc_1.y = 576;
// stage.addChild(npc_1);
// var monster: Monster = MonsterFactory.createOneMonster("monster.png");
// monster.x = 256;
// monster.y = 256;
// stage.addChild(monster);
// var user: User = User.getInstance();
// var hero: Hero = new Hero(10, 10);
// var equipment: Equipment = new Equipment(10, "w1.jpg");
// var equipment1: Equipment = new Equipment(20, "w2.jpg");
// var equipment2: Equipment = new Equipment(999, "w3.jpg");
// var jewll: Jewll = new Jewll(10);
// var jewll1: Jewll = new Jewll(20);
// var jewll2: Jewll = new Jewll(999);
// user.addHero(hero);
// hero.addEquipment(equipment);
// hero.addEquipment(equipment1);
// hero.addEquipment(equipment2);
// equipment.addJewll(jewll);
// equipment1.addJewll(jewll1);
// equipment2.addJewll(jewll2);
// var gameScene: GameScene = new GameScene(Character, newMap, npc_0, npc_1, monster, stage);
// GameScene.replaceScene(gameScene); 
// var UImanager: UiManager = new UiManager(stage);
// UiManager.replaceCurrentUiManager(UImanager);
//# sourceMappingURL=test.js.map