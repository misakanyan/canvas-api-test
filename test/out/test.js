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
// class BagPanel extends engine.DisplayObjectContainer {
//     public bagBg:engine.Bitmap = new engine.Bitmap;
//     private items:engine.TextField[] = [new engine.TextField];
//     constructor(){
//         super();
//         this.bagBg.img.src = "resource/assets/bg2.jpg";
//         this.bagBg.x = 0;
//         this.bagBg.y = 300;
//         this.bagBg.width = 200;
//         this.bagBg.height = 100;
//         this.addChild(this.bagBg);
//         if(this.items.length>0){
//             for(var i:number = 0;i<this.items.length;i++){
//                 this.items[i].text = "血腥砍刀";
//                 this.items[i].x = 0;
//                 this.items[i].y = 300+i*20;
//                 this.items[i].size = 14;
//                 this.items[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.addItem, this)
//                 //this.items[i].touchEnabled = true;
//                 this.addChild(this.items[i]);
//             }
//         }
//     }
//     private addItem(e:egret.TouchEvent){
//         if(e.target.text == "佛丁二号"){
//         }
//     }
// }
// class Bag extends engine.DisplayObjectContainer {
//     private static instance;
//     private switchButton:engine.Bitmap = new engine.Bitmap;
//     private switch:engine.TextField = new engine.TextField;
//     //private BagPanel = new BagPanel();
//     private playerPanel:PlayerPanel;
//     private isShow:boolean = false;
//     public bagBg:engine.Bitmap = new engine.Bitmap;
//     private items:engine.TextField[] = [];
//     private player:Player;
//     private hero:Hero;
//     public static getInstance() {
//         if (Bag.instance == null) {
//             Bag.instance = new Bag;
//         }
//         return Bag.instance;
//     }
//     public initBag(){
//         this.initPanel();
//         console.log("init bag");
//         //this.initPanel();
//         this.switchButton.src = "resource/assets/button.jpg";
//         this.switchButton.x = 400;
//         this.switchButton.y = 475;
//         this.switchButton.width = 100;
//         this.switchButton.height = 25;
//         this.addChild(this.switchButton);
//         this.switch.text = "打开背包";
//         this.switch.size = 14;
//         this.switch.font = "微软雅黑";
//         //this.switch.anchorOffsetX = this.switch.width / 2;
//         //this.switch.anchorOffsetY = this.switch.height / 2;
//         this.switch.x = 450;
//         this.switch.y = 487.5;
//         this.addChild(this.switch);
//         this.bagBg.src = "resource/assets/panelBg_png";
//         this.bagBg.x = 0;
//         this.bagBg.y = 300;
//         this.bagBg.width = 200;
//         this.bagBg.height = 100;
//         this.addChild(this.bagBg);
//         this.bagBg.visible = false;
//         if(this.items.length>0){
//             for(var i:number = 0;i<this.items.length;i++){
//                 this.items[i].text = "";
//                 this.items[i].x = 0;
//                 this.items[i].y = 300+i*20;
//                 this.items[i].size = 14;
//                 //this.items[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.addItemToHero, this)
//                 //this.items[i].touchEnabled = true;
//                 this.addChild(this.items[i]);
//                 this.items[i].visible = false;
//             }
//         }
//         //this.switchButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkStatus, this);
//         //this.switchButton.touchEnabled = true;
//     }
//     private initPanel(){
//         console.log("initPanel");
//         this.player = new Player();
//         //console.log("英雄数量："+this.player.heroes.length);
//         this.hero = new Hero(0);
//         var weapon = new Weapon(0);
//         var weapon2 = new Weapon(1);
//         //var Ruby = new Jewel(0);
//         //Ashbringer.addJewel(Ruby);
//         this.hero.addWeapon(weapon);
//         //console.log("武器数量："+this.hero.weapons.length);
//         this.hero.addWeapon(weapon2);
//         this.player.addHero(this.hero);
//         //this.playerPanel = new PlayerPanel(this.stage, this.player);
//         //this.playerPanel.addWeapon();
//         this.playerPanel.setPanel();
//         //console.log("武器数量："+this.hero.weapons.length);
//         //this.addChild(this.playerPanel);
//         this.playerPanel.visible = false;
//     }
//     private checkStatus(){
//         if(!this.isShow){
//             this.showPanel();
//             this.switch.text = "关闭背包";
//             this.isShow = true;
//         }else{
//             this.hidePanel();
//             this.switch.text = "打开背包";
//             this.isShow = false;
//         }
//     }
//     private showPanel(){
//         this.playerPanel.visible = true;
//         this.bagBg.visible = true;
//         for(var i:number = 0;i<this.items.length;i++){
//             this.items[i].visible = true;
//         }
//         //this.addChild(this.BagPanel);
//     }
//     private hidePanel(){
//         this.playerPanel.visible = false;
//         this.bagBg.visible = false;
//         for(var i:number = 0;i<this.items.length;i++){
//             this.items[i].visible = false;
//         }
//         //this.removeChild(this.BagPanel);
//     }
//     // private addItemToHero(e:egret.TouchEvent){
//     //     console.log("add");
//     //     if(e.target.text == "血腥砍刀"){
//     //         console.log("addsuccess");
//     //         this.player.heroesInTeam.addWeapon(new Weapon(2));
//     //         this.playerPanel.updatePlayer(this.player);
//     //         this.playerPanel.setPanel();
//     //         e.target.text = null;
//     //     }
//     // }
//     public addItemToBag(item:string){
//         this.items.push(new engine.TextField());
//         this.items[this.items.length - 1].text = item;
//         this.items[this.items.length - 1].size = 16;
//         this.items[this.items.length - 1].x = 0;
//         this.items[this.items.length - 1].y = 300 + (this.items.length - 1)*20;
//         //this.items[this.items.length - 1].addEventListener(egret.TouchEvent.TOUCH_TAP, this.addItemToHero, this)
//         this.items[this.items.length - 1].touchEnabled = true;
//         //this.addChild(this.items[this.items.length - 1]);
//         this.items[this.items.length - 1].visible = false;
//     }
// } 
var Character = (function (_super) {
    __extends(Character, _super);
    // private timer:egret.Timer;
    function Character(main) {
        _super.call(this);
        this._idleState = new CharacterIdleState(this);
        this._moveState = new CharacterMoveState(this);
        this._main = main;
        this._body = new engine.Bitmap;
        this._body.img.src = "resource/assets/chara/chara1.png";
        this._main.addChild(this._body);
        this._body.width = 50;
        this._body.height = 50;
        // this._body.anchorOffsetX = this._body.width * 0.5;
        // console.log("anchorx :" + this._body.anchorOffsetX);
        // this._body.anchorOffsetY = this._body.height * 0;
        this._stateMachine = new StateMachine();
        this._body.x = 0;
        this._body.y = 100;
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
    Character.prototype.commandMove = function (x, y, path, callback) {
        console.log("开始移动");
        this.move(x, y, path);
        this.callback = callback;
        //console.log(callback);
    };
    Character.prototype.commandStop = function () {
        // egret.Tween.removeTweens(this._body);
        // if (this.timer != null) {
        //     this.timer.stop();
        // }
        this.idle();
    };
    Character.prototype.move = function (targetX, targetY, path) {
        // //中止缓动动画，达到实现运动中更换目标点的目的
        // egret.Tween.removeTweens(this._body);
        // if (this.timer != null) {
        //     this.timer.stop();
        // }
        var _this = this;
        //触发状态机
        this._stateMachine.setState(this._moveState);
        //如果状态机将_ifwalk变量调整为true,则进入运动状态
        if (this._ifmove) {
            console.log("move");
            // if (targetX > this._body.x) {
            //     this._body.skewY = 0;
            // }
            // else {
            //     this._body.skewY = 180;
            // }
            this.startMove();
            //用Timer来实现固定间隔顺序读取路径数组中的点并移动
            // var interval:number = 250;
            // this.timer = new engine.Timer(interval, path.length - 1,0);
            // this.timer.addEventListener(engine.TimerEvent.TIMER, function (e: egret.TimerEvent): void {
            //     egret.Tween.get(this._body).to({ x: (path[this.timer.currentCount].x + 1) * 50 - 25, y: (path[this.timer.currentCount].y) * 50 }, interval);
            //     console.log("target:" + path[this.timer.currentCount - 1].x + " , " + path[this.timer.currentCount - 1].y);
            // }, this);
            // this.timer.addEventListener(engine.TimerEvent.TIMER_COMPLETE, function (e: egret.TimerEvent): void {
            //     this.idle();
            //     this.callback();
            // }, this);
            // this.timer.start();
            // console.log(path.length);
            if (path.length != 0) {
                var counter = 0;
                var id = setInterval(function () {
                    _this._body.x = (path[counter].x) * 100;
                    _this._body.y = (path[counter].y) * 100;
                    counter++;
                    if (counter == path.length) {
                        clearInterval(id);
                    }
                }, 500);
            }
        }
    };
    Character.prototype.idle = function () {
        this._stateMachine.setState(this._idleState);
        //如果状态机将_ifidle变量调整为true,则进入停止状态
        if (this._ifidle) {
            console.log("idle");
            this.startidle();
        }
    };
    //播放运动动画
    Character.prototype.startMove = function () {
        var _this = this;
        var list = ["resource/assets/chara/chara1.png",
            "resource/assets/chara/chara2.png",
            "resource/assets/chara/chara3.png"];
        var count = 0;
        //this._body.texture = RES.getRes("3_png");
        //循环执行
        engine.Ticker.getInstance().register(function () {
            if (_this._ifmove) {
                count += 0.2;
                if (count >= list.length) {
                    count = 0;
                }
                _this._body.img.src = list[Math.floor(count)];
            }
        });
    };
    Character.prototype.startidle = function () {
        this._body.img.src = "resource/assets/chara/chara1.png";
    };
    return Character;
}(engine.DisplayObjectContainer));
var WalkCommand = (function () {
    function WalkCommand(x, y, path, chara) {
        this.x = x;
        this.y = y;
        this.path = path;
        this.chara = chara;
    }
    WalkCommand.prototype.execute = function (callback) {
        this.chara.commandMove(this.x, this.y, this.path, function () {
            callback();
            //console.log(callback);
        });
    };
    WalkCommand.prototype.cancel = function (callback) {
        this.chara.commandStop();
        callback();
        //GameScene.getCurrentScene().stopMove(function () {
        //    callback();
        //})
    };
    return WalkCommand;
}());
var FightCommand = (function () {
    function FightCommand(_linkTaskId) {
        /**
         * 所有的 Command 都需要有这个标记，应该如何封装处理这个问题呢？
         */
        this._hasBeenCancelled = false;
        this._linkTaskId = _linkTaskId;
    }
    FightCommand.prototype.execute = function (callback) {
        console.log("开始战斗");
        SceneService.getInstance().commandFight(this._linkTaskId, function () {
            callback();
        });
        //egret.setTimeout(() => {
        //    if (!this._hasBeenCancelled) {
        //        console.log("结束战斗")
        //        callback();
        //    }
        //}, this, 500)
    };
    FightCommand.prototype.cancel = function (callback) {
        console.log("脱离战斗");
        this._hasBeenCancelled = true;
        setInterval(function () {
            callback();
        }, this, 100);
    };
    return FightCommand;
}());
var TalkCommand = (function () {
    function TalkCommand(npc) {
        this.npc = npc;
    }
    TalkCommand.prototype.execute = function (callback) {
        console.log("打开对话框");
        for (var i = 0; i < this.npc._taskList.length; i++) {
            console.log("taskId: " + this.npc._taskList[i].id + " status: " + this.npc._taskList[i].status);
            if (this.npc._taskList[i].status == TaskStatus.ACCEPTABLE) {
                TaskService.getInstance().accept(this.npc._taskList[i].id);
                NPCManager.getInstance().commandTalk(this.npc._taskList[i].id, function () {
                    callback();
                });
                //CommandList.getInstance().addCommand(new TalkCommand(this.npc._taskList[i].id));
                //CommandList.getInstance().execute();
                //NPCManager.getInstance().openDialog(this._taskList[i].id);
                break;
            }
            else if (this.npc._taskList[i].status == TaskStatus.CAN_SUBMIT) {
                TaskService.getInstance().submit(this.npc._taskList[i].id);
            }
            else if (this.npc._taskList[i].status == TaskStatus.CAN_ACCEPT) {
                TaskService.getInstance().activate(this.npc._taskList[i].id);
            }
        }
        /*egret.setTimeout(function () {
            console.log("结束对话")
            callback();
        }, this, 500)*/
    };
    TalkCommand.prototype.cancel = function (callback) {
        console.log("关闭对话框");
    };
    return TalkCommand;
}());
var CommandList = (function () {
    function CommandList() {
        this._list = [];
        this._frozen = false;
    }
    CommandList.getInstance = function () {
        if (CommandList.instance == null) {
            CommandList.instance = new CommandList;
        }
        return CommandList.instance;
    };
    CommandList.prototype.addCommand = function (command) {
        this._list.push(command);
    };
    CommandList.prototype.cancel = function () {
        var _this = this;
        this._frozen = true;
        var command = this.currentCommand;
        setInterval(function () {
            if (_this._frozen) {
                _this._frozen = false;
            }
        }, this, 2000);
        if (command) {
            command.cancel(function () {
                _this._frozen = false;
            });
            this._list = [];
        }
    };
    CommandList.prototype.execute = function () {
        var _this = this;
        if (this._frozen) {
            setInterval(this.execute, this, 100);
            return;
        }
        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command);
            command.execute(function () {
                _this.execute();
            });
        }
        else {
            console.log("全部命令执行完毕");
        }
    };
    return CommandList;
}());
var WeaponConfig = [
    { id: "0", name: "阐释者", quality: 2, forge: 6, weight: 12, image: "weapon_1_png" },
    { id: "1", name: "永恒长枪", quality: 3, forge: 12, weight: 20, image: "weapon_2_png" },
    { id: "2", name: "血腥砍刀", quality: 4, forge: 20, weight: 30, image: "weapon_3_png" }
];
var Property = (function () {
    function Property() {
    }
    return Property;
}());
var WeaponProperty = (function (_super) {
    __extends(WeaponProperty, _super);
    function WeaponProperty(id, name, quality, forge, weight) {
        _super.call(this);
        this.quality = 5;
        this.forge = 0;
        this.weight = 0;
        this.configId = id;
        this.name = name;
        this.quality = quality;
        this.forge = forge;
        this.weight = weight;
    }
    return WeaponProperty;
}(Property));
var Weapon = (function () {
    //jewels: Jewel[] = [];
    function Weapon(id) {
        if (id < WeaponConfig.length) {
            this.property = new WeaponProperty(WeaponConfig[id].id, WeaponConfig[id].name, WeaponConfig[id].quality, WeaponConfig[id].forge, WeaponConfig[id].weight);
        }
        else {
            console.log("this weapon does not exist");
        }
    }
    Object.defineProperty(Weapon.prototype, "attack", {
        //addJewel(j: Jewel) {
        //    this.jewels.push(j);
        //}
        //getJewel(){
        //    return this.jewels;
        //}
        get: function () {
            var result = 0;
            //this.jewels.forEach(e => result += e.attack);
            result += this.property.forge * 10 * this.property.quality - this.property.weight;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapon.prototype, "name", {
        get: function () {
            return this.property.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapon.prototype, "quality", {
        get: function () {
            return this.property.quality;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weapon.prototype, "fightPower", {
        get: function () {
            var result = 0;
            //this.jewels.forEach(e => result += e.fightPower);
            result += this.attack * 5;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return Weapon;
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
var HeroConfig = [
    { id: "0", name: "Kiriko", quality: 1, level: 5, strength: 10 }
];
var HeroProperty = (function (_super) {
    __extends(HeroProperty, _super);
    function HeroProperty(id, name, quality, level, strength) {
        _super.call(this);
        this.quality = 1;
        this.level = 1;
        this.strength = 5;
        this.configId = id;
        this.name = name;
        this.quality = quality;
        this.level = level;
        this.strength = strength;
    }
    return HeroProperty;
}(Property));
var Hero = (function () {
    function Hero(id) {
        this.isInTeam = true;
        this.weapons = [];
        if (id < WeaponConfig.length) {
            this.property = new HeroProperty(HeroConfig[id].id, HeroConfig[id].name, HeroConfig[id].quality, HeroConfig[id].level, HeroConfig[id].strength);
        }
        else {
            console.log("this hero does not exist");
        }
    }
    Hero.prototype.addWeapon = function (w) {
        this.weapons.push(w);
    };
    //使用这个方法不知为何拿不到武器
    //getWeapon(){     
    //    return this.weapons;
    //}
    Hero.prototype.setInTeamStatus = function (status) {
        this.isInTeam = status;
    };
    Object.defineProperty(Hero.prototype, "maxHp", {
        //@Cache
        get: function () {
            return this.property.level * 100 * this.property.quality;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "name", {
        get: function () {
            return this.property.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "attack", {
        get: function () {
            var result = 0;
            this.weapons.forEach(function (e) { return result += e.attack; });
            result += this.property.level * 1.5 * this.property.strength * this.property.quality;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "level", {
        get: function () {
            return this.property.level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "fightPower", {
        get: function () {
            var result = 0;
            this.weapons.forEach(function (e) { return result += e.attack; });
            result += this.attack * 5;
            result += this.maxHp * 10;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return Hero;
}());
var JewelConfig = [
    { id: "0", name: "红宝石", quality: 1, edge: 3, purity: 0.50, image: "jewel_0_jpg" },
    { id: "1", name: "jewel_1", quality: 2, edge: 4, purity: 0.65, image: "jewel_1_jpg" },
    { id: "2", name: "jewel_2", quality: 3, edge: 5, purity: 0.75, image: "jewel_2_jpg" },
    { id: "3", name: "jewel_3", quality: 4, edge: 8, purity: 0.90, image: "jewel_3_jpg" }
];
var JewelProperty = (function () {
    function JewelProperty(name, quality, edge, purity) {
        this.quality = 0;
        this.edge = 0;
        this.purity = 0;
        this.name = name;
        this.quality = quality;
        this.edge = edge;
        this.purity = purity;
    }
    return JewelProperty;
}());
var Jewel = (function () {
    function Jewel(id) {
        this.property = new JewelProperty(JewelConfig[id].name, JewelConfig[id].quality, JewelConfig[id].edge, JewelConfig[id].purity);
    }
    Object.defineProperty(Jewel.prototype, "attack", {
        get: function () {
            var result = 0;
            result += this.property.edge * this.property.edge * (this.property.purity + 1) * this.property.quality / 10;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jewel.prototype, "name", {
        get: function () {
            return this.property.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jewel.prototype, "quality", {
        get: function () {
            return this.property.quality;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Jewel.prototype, "fightPower", {
        get: function () {
            var result = 0;
            result += this.attack * 5;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return Jewel;
}());
// //////////////////////////////////////////////////////////////////////////////////////
// //
// //  Copyright (c) 2014-2015, Egret Technology Inc.
// //  All rights reserved.
// //  Redistribution and use in source and binary forms, with or without
// //  modification, are permitted provided that the following conditions are met:
// //
// //     * Redistributions of source code must retain the above copyright
// //       notice, this list of conditions and the following disclaimer.
// //     * Redistributions in binary form must reproduce the above copyright
// //       notice, this list of conditions and the following disclaimer in the
// //       documentation and/or other materials provided with the distribution.
// //     * Neither the name of the Egret nor the
// //       names of its contributors may be used to endorse or promote products
// //       derived from this software without specific prior written permission.
// //
// //  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
// //  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
// //  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
// //  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// //  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// //  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
// //  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
// //  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// //  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// //  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// //
// //////////////////////////////////////////////////////////////////////////////////////
// class LoadingUI extends egret.Sprite {
//     public constructor() {
//         super();
//         this.createView();
//     }
//     private textField:egret.TextField;
//     private createView():void {
//         this.textField = new egret.TextField();
//         this.addChild(this.textField);
//         this.textField.y = 300;
//         this.textField.width = 480;
//         this.textField.height = 100;
//         this.textField.textAlign = "center";
//     }
//     public setProgress(current:number, total:number):void {
//         this.textField.text = `Loading...${current}/${total}`;
//     }
// }
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
var canvas = document.getElementById("canvas");
var stage = engine.run(canvas);
console.log("loading");
setTimeout(function () {
    var main = new Main(stage);
    stage.addChild(main);
    console.log("loaded");
}, 5000);
var Main = (function (_super) {
    __extends(Main, _super);
    //public list = new CommandList();
    //public panel = new Panel();
    function Main(stage) {
        _super.call(this);
        this.stage = stage;
        this.createGameScene();
    }
    /**
 * 创建游戏场景
 * Create a game scene
 */
    Main.prototype.createGameScene = function () {
        var scene = new GameScene(this);
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
        for (var i = 0; i < NPCManager.getInstance().NPCList.length; i++) {
            this.addChild(NPCManager.getInstance().NPCList[i]);
        }
        for (var i = 0; i < SceneService.getInstance().monsterList.length; i++) {
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
    };
    return Main;
}(engine.DisplayObjectContainer));
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
        //bitmap.img.src = "resource/assets/" + data.image;
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
        this.map.img.src = "resource/assets/map.png";
        this.addChild(this.map);
        //this.touchEnabled = true;
    };
    TileMap.prototype.initEventListener = function (chara) {
        var _this = this;
        this.addEventListener(engine.TouchType.TOUCH_TAP, function (e) {
            //console.log(e.currentTarget);
            var startx = Math.floor((chara._body.x) / 50);
            var starty = Math.floor(chara._body.y / 50);
            var endx = Math.floor(e.offsetX / 50);
            var endy = Math.floor(e.offsetY / 50);
            //console.log("stageX:" + e.stageX + "stageY:" + e.stageY);
            //if (e.localX >= 450 && e.localX <= 500 && e.localY >= 100 && e.localY <= 150) {
            //    endx = 8;
            //    endy = 2;
            //}
            //console.log("endx:" + endx + "endy:" + endy);
            var path = _this.astarPath(startx, starty, endx, endy);
            if (path.length > 1) {
                if (startx != endx || starty != endy) {
                    CommandList.getInstance().addCommand(new WalkCommand(e.offsetX, e.offsetY, path, chara));
                    CommandList.getInstance().execute();
                }
            }
        });
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
var NPC = (function (_super) {
    __extends(NPC, _super);
    //private dialog: DialogPanel = new DialogPanel();
    function NPC(id, name, bitmap, emoji, tachie, x, y) {
        var _this = this;
        _super.call(this);
        this._bitmap = new engine.Bitmap;
        this._emoji = new engine.Bitmap;
        this._tachie = new engine.Bitmap;
        this._chara = new engine.Bitmap;
        this.npcRule = function () {
            return _this._id;
        };
        this._id = id;
        this._name = name;
        this._bitmap.img.src = bitmap;
        this._tachie.img.src = tachie;
        this.changeEmoji(emoji);
        this.x = x;
        this.y = y;
        this._bitmap.x = 0;
        this._bitmap.y = 0;
        //this._bitmap.anchorOffsetX = this._bitmap.width / 2;
        //this._bitmap.anchorOffsetY = this._bitmap.height / 2;
        //this._tachie.anchorOffsetX = this._tachie.width / 2;
        //this._tachie.anchorOffsetY = this._tachie.height / 2;
        //this._emoji.anchorOffsetX = this._emoji.width / 2;
        //this._emoji.anchorOffsetY = this._emoji.height / 2;
        this._emoji.x = this._bitmap.x + this._bitmap.width / 2 - 5;
        this._emoji.y = this._bitmap.y - (this._bitmap.height + this._emoji.height) / 4;
        this._taskList = TaskService.getInstance().getTaskByCustomRole(this.npcRule);
        this.addChild(this._bitmap);
        this.addChild(this._emoji);
        //this.addChild(this._tachie);
        this.addEventListener(engine.TouchType.TOUCH_TAP, this.onClick);
        //this.touchEnabled = true;
    }
    Object.defineProperty(NPC.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    NPC.prototype.onChange = function (task) {
        if (this._taskList.length > 0) {
            for (var i = 0; i < this._taskList.length; i++) {
                if (task == this._taskList[i]) {
                    //console.log("accept task fromNpcId:" + task.fromNpcId + " status:" + task.status);
                    //console.log("accept task fromNpcId:" + this._id + " status:" + TaskStatus.DURING);
                    this._taskList[i].status = task.status;
                    if (task.fromNpcId == this._id && task.status == TaskStatus.UNACCEPTABLE) {
                        this.changeEmoji(EmojiStatus.EMPTY);
                    }
                    else if (task.toNpcId == this._id && task.status == TaskStatus.DURING || task.status == TaskStatus.ACCEPTABLE || task.status == TaskStatus.CAN_ACCEPT) {
                        this.changeEmoji(EmojiStatus.QUESTION);
                    }
                    else if (task.toNpcId == this._id && task.status == TaskStatus.CAN_SUBMIT) {
                        this.changeEmoji(EmojiStatus.EXCLAMATION);
                    }
                    else if (task.toNpcId == this._id && task.status == TaskStatus.SUBMITTED) {
                        this.changeEmoji(EmojiStatus.EMPTY);
                    }
                }
            }
        }
    };
    NPC.prototype.changeEmoji = function (status) {
        switch (status) {
            case EmojiStatus.EMPTY:
                this._emoji.img.src = "resource/assets/empty.png";
                break;
            case EmojiStatus.QUESTION:
                this._emoji.img.src = "resource/assets/question.png";
                break;
            case EmojiStatus.EXCLAMATION:
                this._emoji.img.src = "resource/assets/exclamation.png";
                break;
            default:
                break;
        }
    };
    NPC.prototype.onClick = function (e) {
        var startx = Math.floor((GameScene.chara._body.x) / 50);
        var starty = Math.floor(GameScene.chara._body.y / 50);
        var endx = Math.floor(e.offsetX / 100);
        var endy = Math.floor(e.offsetY / 100);
        var path = GameScene.map.astarPath(startx, starty, endx, endy);
        console.log("target:npc startx " + startx + "starty " + starty + "endx " + endx + "endy " + endy);
        path.pop(); //去掉NPC所在的点
        if (path.length > 1) {
            if (startx != endx || starty != endy) {
                if (!CommandList.getInstance().currentCommand) {
                    CommandList.getInstance().addCommand(new WalkCommand(e.offsetX, e.offsetY, path, GameScene.chara));
                    CommandList.getInstance().addCommand(new TalkCommand(this));
                    CommandList.getInstance().execute();
                }
            }
        }
        //for (var i: number = 0; i < this._taskList.length; i++) {
        //    console.log("taskId: " + this._taskList[i].id + " status: " + this._taskList[i].status);
        //    if (this._taskList[i].status == TaskStatus.ACCEPTABLE) {
        //        TaskService.getInstance().accept(this._taskList[i].id);
        //        CommandList.getInstance().addCommand(new TalkCommand(this._taskList[i].id));
        //        CommandList.getInstance().execute();
        //        //NPCManager.getInstance().openDialog(this._taskList[i].id);
        //       break;
        //    }
        //}
    };
    return NPC;
}(engine.DisplayObjectContainer));
var NPCManager = (function () {
    function NPCManager() {
        this.NPCList = [];
        this.dialog = new DialogPanel();
    }
    NPCManager.getInstance = function () {
        if (NPCManager.instance == null) {
            NPCManager.instance = new NPCManager;
        }
        return NPCManager.instance;
    };
    NPCManager.prototype.init = function () {
        //this.dialog = new DialogPanel();
        var data = gameconfig_json;
        for (var i = 0; i < data.npcs.length; i++) {
            var npc = new NPC(data.npcs[i].id, data.npcs[i].name, data.npcs[i].bitmap, data.npcs[i].emoji, data.npcs[i].tachie, data.npcs[i].x, data.npcs[i].y);
            this.NPCList.push(npc);
        }
    };
    NPCManager.prototype.commandTalk = function (taskId, callback) {
        this.openDialog(taskId);
        this.callback = callback;
    };
    NPCManager.prototype.openDialog = function (taskId) {
        this.dialog.onAwake(taskId);
        console.log("NPCManager onClick");
    };
    NPCManager.prototype.changeDialog = function () {
        this.dialog.onChange();
    };
    NPCManager.prototype.closeDialog = function () {
        this.dialog.onSleep();
        this.callback();
    };
    return NPCManager;
}());
var EmojiStatus;
(function (EmojiStatus) {
    EmojiStatus[EmojiStatus["EMPTY"] = 0] = "EMPTY";
    EmojiStatus[EmojiStatus["QUESTION"] = 1] = "QUESTION";
    EmojiStatus[EmojiStatus["EXCLAMATION"] = 2] = "EXCLAMATION";
})(EmojiStatus || (EmojiStatus = {}));
var Player = (function () {
    function Player() {
        this.cash = 0;
        this.gold = 0;
        this.exp = 0;
        this.level = 10;
        this.heroes = [];
    }
    Player.prototype.addHero = function (hero) {
        this.heroes.push(hero);
    };
    Object.defineProperty(Player.prototype, "heroesInTeam", {
        get: function () {
            //return this.heroes.filter(hero => hero.isInTeam);
            return this.heroes[0]; //暂时只做一个英雄
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.getFightPower = function () {
        var result = 0;
        //this.heroesInTeam.map(hero => result += hero.fightPower);
        result += this.heroesInTeam.fightPower;
        return result;
    };
    return Player;
}());
/*var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
    const getter = desc.get;
    desc.get = function () {
        return getter.apply(this);
    }
    return desc;
}*/
var panelConfig = [
    { name: "bg", image: "resource/assets/panelBg.png", x: 0, y: 0 },
];
var heroConfig = [
    { name: "hero_0", image: "resource/assets/hero_1.png", x: 0, y: 0 }
];
var equipmentConfig = [
    { name: WeaponConfig[0].name, image: WeaponConfig[0].image, x: 0, y: 120 },
    { name: WeaponConfig[1].name, image: WeaponConfig[1].image, x: 0, y: 120 },
    { name: WeaponConfig[2].name, image: WeaponConfig[2].image, x: 0, y: 120 }
];
var jewelConfig = [
    { name: JewelConfig[0].name, image: JewelConfig[0].image, x: 0, y: 200 }
];
var PlayerPanel = (function (_super) {
    __extends(PlayerPanel, _super);
    function PlayerPanel(stage, player) {
        _super.call(this);
        this.weapon = [];
        this.weapon_desc = [];
        this.player = player;
        this.bg = new engine.Bitmap();
        this.hero = new engine.Bitmap();
        this.weapon.push(new engine.Bitmap());
        //this.jewel.push(new egret.Bitmap());
        //this.player_desc = new egret.TextField();
        this.hero_desc = new engine.TextField();
        this.weapon_desc.push(new engine.TextField());
        //this.jewel_desc.push(new egret.TextField());
        //this.help = new egret.TextField();
        this.body = new engine.Shape();
        this.addChild(this.bg);
        this.addChild(this.hero);
        //stage.addChild(this.jewel);
        //stage.addChild(this.player_desc);
        this.addChild(this.hero_desc);
        //stage.addChild(this.weapon_desc);
        //stage.addChild(this.jewel_desc);
        //this.addChild(this.help);
        this.setPanel();
        //this.setButton();
        this.touchEnabled = true;
    }
    PlayerPanel.prototype.addWeapon = function () {
        this.weapon.push(new engine.Bitmap());
    };
    PlayerPanel.prototype.updatePlayer = function (player) {
        this.player = player;
    };
    PlayerPanel.prototype.setPanel = function () {
        //console.log("武器数量："+this.player.heroesInTeam.getWeapon.length);
        for (var i = 0; i < this.player.heroesInTeam.weapons.length; i++) {
            this.weapon[i] = new engine.Bitmap();
            this.addChild(this.weapon[i]);
            console.log("武器数量：" + this.player.heroesInTeam.weapons.length);
        }
        //for(var i = 0;i<this.jewel.length;i++){
        //    this.addChild(this.jewel[i]);
        //}
        for (var i = 0; i < this.player.heroesInTeam.weapons.length; i++) {
            this.weapon_desc[i] = new engine.TextField();
            this.addChild(this.weapon_desc[i]);
        }
        //for(var i = 0;i<this.jewel_desc.length;i++){
        //    this.addChild(this.jewel_desc[i]);
        //}
        this.bg.img.src = panelConfig[0].image;
        this.bg.x = panelConfig[0].x;
        this.bg.y = panelConfig[0].y;
        this.bg.width = 200;
        this.bg.height = 300;
        this.hero.img.src = heroConfig[0].image;
        this.hero.x = heroConfig[0].x;
        this.hero.y = heroConfig[0].y;
        //this.hero.width = 100;
        //this.hero.height = 150;
        for (var i = 0; i < this.player.heroesInTeam.weapons.length; i++) {
            this.weapon[i].img.src = equipmentConfig[i].image;
            this.weapon[i].x = equipmentConfig[i].x + 10;
            this.weapon[i].y = equipmentConfig[i].y + i * 60;
        }
        //for(var i = 0;i<this.jewel.length;i++){
        //    this.jewel[i].texture = RES.getRes(jewelConfig[0].image);
        //    this.jewel[i].x = jewelConfig[0].x;
        //    this.jewel[i].y = jewelConfig[0].y;
        //}
        for (var i = 0; i < this.player.heroesInTeam.weapons.length; i++) {
            this.weapon_desc[i].text = "武器：" + this.player.heroesInTeam.weapons[i].name
                + " \n稀有度：" + this.player.heroesInTeam.weapons[i].quality
                + " \n攻击力：" + this.player.heroesInTeam.weapons[i].attack
                + " \n战斗力：" + this.player.heroesInTeam.weapons[i].fightPower;
            this.weapon_desc[i].x = this.weapon[i].x + this.weapon[i].width + 20;
            this.weapon_desc[i].y = this.weapon[i].y;
        }
        //for(var i = 0;i<this.jewel_desc.length;i++){
        //    this.jewel_desc[i].text = "宝石：" + this.Hero.weapons[0].jewels[0].name
        //    + " \n稀有度：" + this.Hero.weapons[i].jewels[0].quality
        //    + " \n攻击力：" + this.Hero.weapons[i].jewels[0].attack
        //    + " \n战斗力：" + this.Hero.weapons[i].jewels[0].fightPower;
        //    this.jewel_desc[i].x = jewelConfig[0].x + this.jewel[i].width;
        //    this.jewel_desc[i].y = jewelConfig[0].y;
        //    this.jewel_desc[i].size = 16;
        //}
        this.hero_desc.text = "英雄：" + this.player.heroesInTeam.name
            + " \n等级：" + this.player.heroesInTeam.level
            + " \n生命值：" + this.player.heroesInTeam.maxHp
            + " \n攻击力：" + this.player.heroesInTeam.attack
            + " \n战斗力：" + this.player.heroesInTeam.fightPower;
        this.hero_desc.x = heroConfig[0].x + this.hero.width;
        this.hero_desc.y = heroConfig[0].y + 28;
        //this.hero_desc.font = "微软雅黑";
        //this.hero_desc.size = 13;
        //this.help.text = "点击查看武器和镶嵌的宝石信息";
        //this.help.x = equipmentConfig[0].x;
        //this.help.y = equipmentConfig[0].y - this.weapon[0].height;
        //this.help.size = 16;
    };
    return PlayerPanel;
}(engine.DisplayObjectContainer));
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
// class Property {
//     configId: string;
//     name: string;
// } 
var SceneService = (function () {
    function SceneService() {
        this.observerList = [];
        this.taskList = [];
        this.monsterList = [];
    }
    //private monsterPanel: MonsterPanel = new MonsterPanel();;
    SceneService.getInstance = function () {
        if (SceneService.instance == null) {
            SceneService.instance = new SceneService;
        }
        return SceneService.instance;
    };
    SceneService.prototype.init = function () {
        var data = gameconfig_json;
        for (var i = 0; i < data.monsters.length; i++) {
            this.monsterList.push(new Monster(data.monsters[i].image, data.monsters[i].id, data.monsters[i].linkTaskId));
            var task = TaskService.getInstance().taskList[data.monsters[i].linkTaskId];
            this.taskList.push(task);
        }
        //this.monsterList.push(new Monster("monster_jpg","0","1"));
        //this.taskList.push(TaskService.getInstance().taskList[1]); //临时往里面塞一个任务触发用
        for (var i = 0; i < this.monsterList.length; i++) {
            this.observerList.push(this.monsterList[i]);
        }
        this.observerList.push(new KillMonsterTaskCondition());
    };
    SceneService.prototype.wakeUpMonster = function (id) {
        for (var i = 0; i < this.monsterList.length; i++) {
            if (this.monsterList[i].id == id) {
                this.monsterList[i].onAwake();
            }
        }
    };
    SceneService.prototype.killMonster = function (id) {
        //console.log(id);
        for (var i = 0; i < this.monsterList.length; i++) {
            if (this.monsterList[i].id == id) {
                this.monsterList[i].onSleep();
                this.callback();
            }
        }
    };
    SceneService.prototype.addObserver = function (o) {
        this.observerList.push(o);
    };
    SceneService.prototype.notify = function (task) {
        for (var i = 0; i < SceneService.getInstance().observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    };
    SceneService.prototype.commandFight = function (linkTaskId, callback) {
        this.callback = callback;
        this.accept(linkTaskId);
        //console.log("commandFight");
    };
    SceneService.prototype.accept = function (id) {
        //console.log("accept monster:"+id);
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == id) {
                console.log("accept success");
                var task = this.taskList[i];
                this.notify(task);
                break;
            }
        }
        //this.notify(this.taskList[0]);  //这个是临时的任务
    };
    SceneService.prototype.submit = function (id) {
    };
    return SceneService;
}());
/*class MonsterPanel extends engine.DisplayObjectContainer {
    private bg: engine.Bitmap = new engine.Bitmap;
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
        this.bg.addEventListener(engine.TouchEvent.TOUCH_TAP, this.onClick, this);
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
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(image, id, taskId) {
        _super.call(this);
        this._image = new engine.Bitmap;
        this._count = new engine.Shape;
        this.isFight = false;
        this.count = 9;
        this._id = id;
        this._linkTaskId = taskId;
        this._image.img.src = "resource/assets/" + image;
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
        this.addEventListener(engine.TouchType.TOUCH_TAP, this.onClick);
    }
    Object.defineProperty(Monster.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monster.prototype, "linkTaskId", {
        get: function () {
            return this._linkTaskId;
        },
        enumerable: true,
        configurable: true
    });
    Monster.prototype.onClick = function (e) {
        var startx = Math.floor((GameScene.chara._body.x) / 50);
        var starty = Math.floor(GameScene.chara._body.y / 50);
        var endx = Math.floor(e.offsetX / 50);
        var endy = Math.floor(e.offsetY / 50);
        var path = GameScene.map.astarPath(startx, starty, endx, endy);
        //console.log("startx " + startx + "starty " + starty + "endx " + endx + "endy " + endy);
        path.pop(); //去掉Monster所在的点
        if (path.length > 0 && !this.isFight) {
            CommandList.getInstance().addCommand(new WalkCommand(e.offsetX, e.offsetY, path, GameScene.chara));
            CommandList.getInstance().addCommand(new FightCommand(this._linkTaskId));
            CommandList.getInstance().execute();
            this.isFight = true;
        }
        else if (this.isFight) {
            CommandList.getInstance().addCommand(new FightCommand(this._linkTaskId));
            CommandList.getInstance().execute();
            this.count--;
            this._count.graphics.clear();
            this._count.graphics.beginFill(0xff0000, 1.0);
            this._count.graphics.drawRect(0, 0, 50 * (this.count / 9), 5);
            this._count.graphics.endFill();
        }
        //SceneService.getInstance().accept(this._linkTaskId);//移至Command
    };
    Monster.prototype.onAwake = function () {
        this.addChild(this._image);
        this.addChild(this._count);
    };
    Monster.prototype.onSleep = function () {
        this.removeChild(this._image);
        this.removeChild(this._count);
    };
    Monster.prototype.onChange = function (task) {
    };
    return Monster;
}(engine.DisplayObjectContainer));
var GameScene = (function () {
    function GameScene(main) {
        GameScene.map = new TileMap();
        main.addChild(GameScene.map);
        GameScene.chara = new Character(main);
        main.addChild(GameScene.chara);
        GameScene.chara.idle();
        GameScene.map.initEventListener(GameScene.chara);
    }
    GameScene.replaceScene = function (scene) {
        GameScene.scene = scene;
    };
    GameScene.getCurrentScene = function () {
        return GameScene.scene;
    };
    GameScene.prototype.moveTo = function (x, y, callback) {
        console.log("开始移动");
        setInterval(function () {
            console.log("结束移动");
            callback();
        }, this, 500);
    };
    GameScene.prototype.stopMove = function (callback) {
        console.log("取消移动");
        callback();
    };
    return GameScene;
}());
//状态机
var StateMachine = (function () {
    function StateMachine() {
    }
    //设置状态
    StateMachine.prototype.setState = function (e) {
        if (this.currentState != null) {
            this.currentState.onExit();
        }
        this.currentState = e;
        e.onEnter();
    };
    return StateMachine;
}());
var CharacterState = (function (_super) {
    __extends(CharacterState, _super);
    function CharacterState(character) {
        _super.call(this);
        this._character = character;
    }
    CharacterState.prototype.onEnter = function () { };
    CharacterState.prototype.onExit = function () { };
    return CharacterState;
}(StateMachine));
var CharacterIdleState = (function (_super) {
    __extends(CharacterIdleState, _super);
    function CharacterIdleState() {
        _super.apply(this, arguments);
    }
    //进入时设置Character类的变量
    CharacterIdleState.prototype.onEnter = function () {
        this._character._ifidle = true;
    };
    //离开时同理
    CharacterIdleState.prototype.onExit = function () {
        this._character._ifidle = false;
    };
    return CharacterIdleState;
}(CharacterState));
var CharacterMoveState = (function (_super) {
    __extends(CharacterMoveState, _super);
    function CharacterMoveState() {
        _super.apply(this, arguments);
    }
    CharacterMoveState.prototype.onEnter = function () {
        this._character._ifmove = true;
    };
    CharacterMoveState.prototype.onExit = function () {
        this._character._ifmove = false;
    };
    return CharacterMoveState;
}(CharacterState));
var NpcTalkTaskCondition = (function () {
    function NpcTalkTaskCondition() {
    }
    NpcTalkTaskCondition.getInstance = function () {
        if (NpcTalkTaskCondition.instance == null) {
            NpcTalkTaskCondition.instance = new NpcTalkTaskCondition;
        }
        return NpcTalkTaskCondition.instance;
    };
    NpcTalkTaskCondition.prototype.onAccept = function (task) {
        task.current++;
        NPCManager.getInstance().changeDialog();
        task.checkStatus();
    };
    NpcTalkTaskCondition.prototype.onSubmit = function () {
    };
    return NpcTalkTaskCondition;
}());
var KillMonsterTaskCondition = (function () {
    function KillMonsterTaskCondition() {
    }
    KillMonsterTaskCondition.getInstance = function () {
        if (KillMonsterTaskCondition.instance == null) {
            KillMonsterTaskCondition.instance = new KillMonsterTaskCondition;
        }
        return KillMonsterTaskCondition.instance;
    };
    KillMonsterTaskCondition.prototype.onAccept = function (task) {
        task.current++;
        task.killMonsterCheckStatus();
    };
    KillMonsterTaskCondition.prototype.onSubmit = function () {
    };
    KillMonsterTaskCondition.prototype.onChange = function (task) {
        this.onAccept(task);
    };
    return KillMonsterTaskCondition;
}());
var Task = (function () {
    function Task(id, name, status, desc, fromNpcId, toNpcId, condition, current, total) {
        this.current = 0;
        this.total = -1;
        this._id = id;
        this._name = name;
        this._status = status;
        this._desc = desc;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
        this.condition = condition;
        this.current = current;
        this.total = total;
    }
    Object.defineProperty(Task.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            this._status = status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Task.prototype, "desc", {
        get: function () {
            return this._desc;
        },
        enumerable: true,
        configurable: true
    });
    Task.prototype.onAccept = function () {
        this.condition.onAccept(this);
    };
    Task.prototype.checkStatus = function () {
        //if(this.current > this.total){
        //    console.warn();
        //}
        //console.log("current: " + this.current);
        if (this._status == TaskStatus.DURING &&
            this.current >= this.total + 1) {
            this._status = TaskStatus.CAN_SUBMIT;
            //console.log(this._status);
            TaskService.getInstance().submit(this._id);
            TaskService.getInstance().enforceAccept("1"); //用于启动下一个任务
            SceneService.getInstance().wakeUpMonster("0"); //用于唤醒怪物
            NPCManager.getInstance().closeDialog();
            console.log("submitted");
        }
    };
    Task.prototype.killMonsterCheckStatus = function () {
        if (this._status == TaskStatus.DURING &&
            this.current >= this.total + 1) {
            //this._status = TaskStatus.CAN_SUBMIT;
            //console.log(this._status);
            TaskService.getInstance().complete(this._id);
            SceneService.getInstance().killMonster("0"); //用于清除怪物
            console.log("submitted");
        }
    };
    return Task;
}());
var TaskService = (function () {
    function TaskService() {
        this.observerList = [];
        this.taskList = [];
    }
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService;
        }
        return TaskService.instance;
    };
    TaskService.prototype.init = function () {
        this.initTask();
        this.initObserver();
    };
    TaskService.prototype.initTask = function () {
        var data = gameconfig_json;
        for (var i = 0; i < data.tasks.length; i++) {
            var taskType = data.tasks[i].type == "dialog" ? NpcTalkTaskCondition.getInstance() : KillMonsterTaskCondition.getInstance();
            var task = new Task(data.tasks[i].id, data.tasks[i].name, data.tasks[i].status, data.tasks[i].desc, data.tasks[i].fromNpcId, data.tasks[i].toNpcId, taskType, 
            //NpcTalkTaskCondition.getInstance(),
            data.tasks[i].current, data.tasks[i].total);
            this.taskList.push(task);
        }
    };
    TaskService.prototype.initObserver = function () {
        NPCManager.getInstance().init();
        for (var i = 0; i < NPCManager.getInstance().NPCList.length; i++) {
            this.observerList.push(NPCManager.getInstance().NPCList[i]);
        }
        for (var i = 0; i < this.taskList.length; i++) {
            this.notify(this.taskList[i]);
        }
    };
    TaskService.prototype.addObserver = function (o) {
        this.observerList.push(o);
    };
    TaskService.prototype.notify = function (task) {
        for (var i = 0; i < TaskService.getInstance().observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    };
    TaskService.prototype.activate = function (id) {
        var task = this.taskList[id];
        if (task.status == TaskStatus.CAN_ACCEPT) {
            task.status = TaskStatus.ACCEPTABLE;
            console.log('activate task:' + id);
        }
        this.notify(task);
    };
    TaskService.prototype.enforceAccept = function (id) {
        var task = this.taskList[id];
        if (task.status == TaskStatus.UNACCEPTABLE) {
            task.status = TaskStatus.DURING;
            task.onAccept();
            console.log('enforce accept:' + id);
            console.log("enforce accept status: " + this.taskList[id]._status);
        }
        this.notify(task);
    };
    TaskService.prototype.accept = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        //console.log(this.taskList[id]);
        var task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        //console.log(task.status);
        //console.log(TaskStatus.DURING);
        if (task.status == TaskStatus.ACCEPTABLE) {
            task.status = TaskStatus.DURING;
            task.onAccept();
            console.log('accept:' + id);
            console.log("accept status: " + this.taskList[id]._status);
        }
        this.notify(task);
    };
    TaskService.prototype.complete = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        var task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        if (task.status == TaskStatus.DURING) {
            task.status = TaskStatus.CAN_SUBMIT;
            console.log('complete:' + id);
        }
        this.notify(task);
    };
    TaskService.prototype.submit = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        var task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        //console.log('submit task:' + id);
        if (task.status == TaskStatus.CAN_SUBMIT) {
            task.status = TaskStatus.SUBMITTED;
            console.log('submit:' + id);
            console.log("submit status: " + this.taskList[id]._status);
        }
        this.notify(task);
    };
    TaskService.prototype.getTaskByCustomRole = function (rule) {
        var task = [];
        var npcId = rule();
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].fromNpcId == npcId /*|| this.taskList[i].toNpcId == npcId*/) {
                task.push(this.taskList[i]);
            }
        }
        return task;
    };
    return TaskService;
}());
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
    ErrorCode[ErrorCode["MISSING_TASK"] = 1] = "MISSING_TASK";
})(ErrorCode || (ErrorCode = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
    TaskStatus[TaskStatus["CAN_ACCEPT"] = 5] = "CAN_ACCEPT";
})(TaskStatus || (TaskStatus = {}));
var TaskTextElement = (function (_super) {
    __extends(TaskTextElement, _super);
    function TaskTextElement(id, name, status, desc) {
        _super.call(this);
        this.taskNameText = new engine.TextField;
        this.taskStatusText = new engine.TextField;
        this.taskDescText = new engine.TextField;
        this.button = new engine.TextField;
        this._taskid = id;
        this.taskNameText.text = "任务 : " + name;
        // this.taskNameText.size = 14;
        // this.taskNameText.font = "微软雅黑";
        // this.taskNameText.color = "0xffff00";
        //this.taskNameText.textAlign = engine.HorizontalAlign.LEFT;
        //this.taskNameText.type = engine.TextFieldType.DYNAMIC;
        this.taskNameText.x = 10;
        this.taskNameText.y = 10;
        //this.taskNameText.width = 180;
        //this.taskNameText.height = 20;
        //this.taskNameText.lineSpacing = 6;
        //this.taskNameText.multiline = true;
        this.taskDescText.text = desc;
        // this.taskDescText.size = 14;
        // this.taskDescText.font = "微软雅黑";
        //this.taskDescText.textAlign = engine.HorizontalAlign.LEFT;
        //this.taskDescText.type = engine.TextFieldType.DYNAMIC;
        this.taskDescText.x = 10;
        this.taskDescText.y = 30;
        //this.taskDescText.width = 180;
        //this.taskDescText.height = 40;
        //this.taskDescText.lineSpacing = 6;
        //this.taskDescText.multiline = true;
        this.taskStatusText.text = "当前状态 : " + ChineseTaskStatus[status];
        // this.taskStatusText.size = 14;
        // this.taskStatusText.font = "微软雅黑";
        //this.taskStatusText.textAlign = engine.HorizontalAlign.LEFT;
        //this.taskStatusText.type = engine.TextFieldType.DYNAMIC;
        this.taskStatusText.x = 10;
        this.taskStatusText.y = 70;
        //this.taskStatusText.width = 180;
        //this.taskStatusText.height = 40;
        //this.taskStatusText.lineSpacing = 6;
        //this.taskStatusText.multiline = true;
        this.button.x = 160;
        this.button.y = 80;
        this.button.text = "接受";
        // this.button.size = 14;
        // this.button.font = "微软雅黑";
        // this.button.touchEnabled = true;
        // this.button.addEventListener(engine.TouchEvent.TOUCH_TAP, this.onClick, this);
        // this.button.visible = false;
        this.addChild(this.taskNameText);
        this.addChild(this.taskDescText);
        this.addChild(this.taskStatusText);
        this.addChild(this.button);
    }
    TaskTextElement.prototype.changeText = function (task) {
        this.taskNameText.text = "任务 : " + task.name;
        this.taskStatusText.text = "当前状态 : " + ChineseTaskStatus[task.status];
        this.taskDescText.text = task.desc;
        //console.log("panel taskinfo change success");
    };
    Object.defineProperty(TaskTextElement.prototype, "taskId", {
        get: function () {
            return this._taskid;
        },
        enumerable: true,
        configurable: true
    });
    return TaskTextElement;
}(engine.DisplayObjectContainer));
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        _super.call(this);
        this.taskTextList = [];
        this.bg = new engine.Bitmap;
        this.bgShape = new engine.Shape;
        this.bgShape.x = 0;
        this.bgShape.y = 0;
        //this.bgShape.graphics.clear();
        //this.bgShape.graphics.beginFill(0x000000, .5);
        //this.bgShape.graphics.drawRect(0, 0, 200, 200);
        //this.bgShape.graphics.endFill();
        this.addChild(this.bgShape);
        for (var i = 0; i < TaskService.getInstance().taskList.length; i++) {
            var taskText = new TaskTextElement(TaskService.getInstance().taskList[i].id, TaskService.getInstance().taskList[i].name, TaskService.getInstance().taskList[i].status, TaskService.getInstance().taskList[i].desc);
            this.taskTextList.push(taskText);
            this.taskTextList[i].y = i * 100;
            this.addChild(taskText);
        }
    }
    TaskPanel.prototype.onChange = function (task) {
        for (var i = 0; i < this.taskTextList.length; i++) {
            if (task.id == this.taskTextList[i].taskId) {
                this.taskTextList[i].changeText(task);
                if (task.status == TaskStatus.ACCEPTABLE) {
                    this.taskTextList[i].button.text = "接受";
                }
                else if (task.status == TaskStatus.CAN_SUBMIT) {
                    this.taskTextList[i].button.text = "提交";
                }
                else {
                }
            }
        }
    };
    return TaskPanel;
}(engine.DisplayObjectContainer));
var DialogPanel = (function (_super) {
    __extends(DialogPanel, _super);
    function DialogPanel() {
        _super.call(this);
        this.charaName = new engine.TextField;
        this.desc = new engine.TextField;
        this.bg = new engine.Bitmap;
        this.dialogue = [];
        this.dialogueCount = 0;
        this.dialogueTotal = 0;
        this.tachie_left = new engine.Bitmap;
        this.tachie_right = new engine.Bitmap;
        //button: engine.Shape = new engine.Shape;
        this.currentTaskId = "-1";
        /*this.button.x = 250;
        this.button.y = 250;
        this.button.graphics.clear();
        this.button.graphics.beginFill(0x000000, 1.0);
        this.button.graphics.drawRect(0, 0, 50, 30);
        this.button.graphics.endFill();  */
        this.bg.img.src = "resource/assets/dialog.png";
        this.bg.x = 0;
        this.bg.y = 0;
        //this.tachie_left.texture = RES.getRes("npc_1_tachie_png");
        this.tachie_left.x = 0;
        this.tachie_left.y = 0;
        //this.tachie_left.width = 200;
        //this.tachie_left.height = 250;
        this.tachie_right.img.src = "resource/assets/npc_0_tachie.png";
        this.tachie_right.x = 0;
        this.tachie_right.y = 0;
        //this.addChild(this.tachie_right);
        //this.tachie_right.width = 200;
        //this.tachie_right.height = 250;
        this.desc.text = "确定";
        // this.desc.size = 16;
        // this.desc.font = "微软雅黑";
        this.desc.x = 75;
        this.desc.y = 420;
        // this.desc.width = 300;
        // this.desc.height = 50;
        // this.desc.textAlign = engine.HorizontalAlign.LEFT;
        // this.desc.type = engine.TextFieldType.DYNAMIC;
        // this.desc.lineSpacing = 6;
        // this.desc.multiline = true;
        this.charaName.text = "Lisbeth";
        // this.charaName.size = 18;
        // this.charaName.font = "微软雅黑";
        //this.charaName.anchorOffsetX = this.charaName.width / 2;
        //this.charaName.anchorOffsetY = this.charaName.height / 2;
        this.charaName.x = 128;
        this.charaName.y = 394;
        //this.anchorOffsetX = this.width / 2;
        //this.anchorOffsetY = this.height / 2;
        //this.x = 150;
        //this.y = 0;
        //console.log("Dialog Panel button x: "+this.button.x+"y: "+this.button.y);
        //this.touchEnabled = true;
        //this.addEventListener(engine.TouchEvent.TOUCH_TAP, this.onClick, this);
    }
    DialogPanel.prototype.onAwake = function (taskId) {
        this.currentTaskId = taskId;
        var data = dialogue_json;
        for (var i = 0; i < data.dialogue.length; i++) {
            if (data.dialogue[i].taskId == taskId) {
                this.dialogue.push(data.dialogue[i]);
                this.dialogueTotal++;
            }
        }
        this.onChange();
        this.addChild(this.tachie_left);
        this.addChild(this.tachie_right);
        this.addChild(this.bg);
        this.addChild(this.desc);
        this.addChild(this.charaName);
        console.log("dialog panel awake");
        console.log(this.bg);
        //console.log("DialogPanel onAwake by task: "+ taskId);
    };
    DialogPanel.prototype.onChange = function () {
        if (this.dialogueTotal == 0) {
        }
        else if (this.dialogueCount < this.dialogueTotal) {
            this.charaName.text = this.dialogue[this.dialogueCount].actorName;
            this.desc.text = this.dialogue[this.dialogueCount].content;
            if (this.dialogue[this.dialogueCount].side == "left") {
                this.tachie_left.img.src = this.dialogue[this.dialogueCount].tachie;
                this.tachie_right.img.src = "";
            }
            else if (this.dialogue[this.dialogueCount].side == "right") {
                this.tachie_right.img.src = this.dialogue[this.dialogueCount].tachie;
                this.tachie_left.img.src = "";
            }
            this.dialogueCount++;
        }
    };
    DialogPanel.prototype.onSleep = function () {
        this.removeChild(this.bg);
        this.removeChild(this.desc);
        this.removeChild(this.charaName);
        this.removeChild(this.tachie_left);
        this.removeChild(this.tachie_right);
        this.dialogue = [];
        this.dialogueCount = 0;
        this.dialogueTotal = 0;
    };
    DialogPanel.prototype.onClick = function () {
        //console.log("onclick");
        if (this.currentTaskId == "-1") {
            console.log("no task on dialogPanel");
        }
        else {
            var task = TaskService.getInstance().taskList[this.currentTaskId];
            task.onAccept();
        }
    };
    return DialogPanel;
}(engine.DisplayObjectContainer));
var ChineseTaskStatus = {
    0: "不可接受",
    1: "可接受",
    2: "进行中",
    3: "可提交",
    4: "已提交",
    5: "未接受"
};
var gameconfig_json = {
    "tasks": [
        {
            "id": "0",
            "name": "被抢走的武器",
            "type": "dialog",
            "status": 5,
            "desc": "莉兹贝特好像有什么事情想和你商量，去找她聊聊吧。",
            "fromNpcId": "npc_0",
            "toNpcId": "npc_0",
            "current": 0,
            "total": 10,
            "nextTaskId": "1"
        },
        {
            "id": "1",
            "name": "夺回传说级武器",
            "type": "killMonster",
            "status": 0,
            "desc": "杀死狼人，得到其身上掉落的武器，向艾基尔汇报。",
            "fromNpcId": "npc_1",
            "toNpcId": "npc_1",
            "current": 0,
            "total": 10,
            "nextTaskId": null
        }
    ],
    "npcs": [
        {
            "id": "npc_0",
            "name": "莉兹贝特",
            "bitmap": "resource/assets/npc_0.png",
            "emoji": 0,
            "tachie": "resource/assets/npc_0_tachie.jpg",
            "x": 475,
            "y": 125
        },
        {
            "id": "npc_1",
            "name": "艾基尔",
            "bitmap": "resource/assets/npc_1.png",
            "emoji": 0,
            "tachie": "resource/assets/npc_1_tachie.jpg",
            "x": 25,
            "y": 225
        }
    ],
    "monsters": [
        {
            "id": "0",
            "linkTaskId": "1",
            "image": "resource/assets/monster.jpg"
        }
    ]
};
var dialogue_json = {
    "dialogue": [
        {
            "id": 1,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "啊，桐人，你来得正好！"
        },
        {
            "id": 2,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "怎么了？"
        },
        {
            "id": 3,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "实际上……我昨天做了一把传说级武器……"
        },
        {
            "id": 4,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "喔，那不是很好嘛。"
        },
        {
            "id": 5,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "……然后想拿去卖，结果半路上被一只狼人抢走了……"
        },
        {
            "id": 6,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "……"
        },
        {
            "id": 7,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "……"
        },
        {
            "id": 8,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "好吧，我去会会那家伙。"
        },
        {
            "id": 9,
            "actorName": "Lisbeth",
            "tachie": "resource/assets/npc_0_tachie.png",
            "side": "right",
            "taskId": 0,
            "content": "谢谢！啊拿回来以后顺便帮我送到艾基尔那儿去吧~"
        },
        {
            "id": 10,
            "actorName": "Kirito",
            "tachie": "resource/assets/npc_1_tachie.png",
            "side": "left",
            "taskId": 0,
            "content": "还要免费跑腿啊……"
        }
    ]
};
