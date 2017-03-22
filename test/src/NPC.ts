class NPC extends engine.DisplayObjectContainer implements Observer {

    private _id: string;
    private _name: string;
    private _bitmap: engine.Bitmap = new engine.Bitmap;
    private _emoji: engine.Bitmap = new engine.Bitmap;
    private _tachie: engine.Bitmap = new engine.Bitmap;
    public _taskList: Task[];
    private _chara: engine.Bitmap = new engine.Bitmap;

    //private dialog: DialogPanel = new DialogPanel();

    constructor(id: string, name: string, bitmap: string, emoji: EmojiStatus, tachie: string, x: number, y: number) {
        super();
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

    public get id(): string {
        return this._id;
    }


    onChange(task: Task) {
        if (this._taskList.length > 0) {
            for (var i: number = 0; i < this._taskList.length; i++) {
                if (task == this._taskList[i]) {
                    //console.log("accept task fromNpcId:" + task.fromNpcId + " status:" + task.status);
                    //console.log("accept task fromNpcId:" + this._id + " status:" + TaskStatus.DURING);
                    this._taskList[i].status = task.status;
                    if (task.fromNpcId == this._id && task.status == TaskStatus.UNACCEPTABLE) {
                        this.changeEmoji(EmojiStatus.EMPTY);
                        //console.log("取消叹号");
                    } else if (task.toNpcId == this._id && task.status == TaskStatus.DURING || task.status == TaskStatus.ACCEPTABLE || task.status == TaskStatus.CAN_ACCEPT) {
                        this.changeEmoji(EmojiStatus.QUESTION);
                    } else if (task.toNpcId == this._id && task.status == TaskStatus.CAN_SUBMIT) {
                        this.changeEmoji(EmojiStatus.EXCLAMATION);
                    } else if (task.toNpcId == this._id && task.status == TaskStatus.SUBMITTED) {
                        this.changeEmoji(EmojiStatus.EMPTY);
                    }
                }
            }
        }
    }

    private changeEmoji(status: EmojiStatus): void {
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
    }

    private onClick(e:MouseEvent) {

        var startx: number = Math.floor((GameScene.chara._body.x) / 50);
        var starty: number = Math.floor(GameScene.chara._body.y / 50);
        var endx: number = Math.floor(e.offsetX / 100);
        var endy: number = Math.floor(e.offsetY / 100);
        var path: Point[] = GameScene.map.astarPath(startx, starty, endx, endy);
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
    }

    private npcRule = () => {
        return this._id;
    }

}

class NPCManager {

    NPCList: NPC[] = [];
    private static instance;
    dialog: DialogPanel = new DialogPanel();
    private callback: Function;

    static getInstance() {
        if (NPCManager.instance == null) {
            NPCManager.instance = new NPCManager;
        }
        return NPCManager.instance;
    }

    init() {
        //this.dialog = new DialogPanel();
        var data = gameconfig_json;
        for (var i: number = 0; i < data.npcs.length; i++) {
            var npc = new NPC(data.npcs[i].id,
                data.npcs[i].name,
                data.npcs[i].bitmap,
                data.npcs[i].emoji,
                data.npcs[i].tachie,
                data.npcs[i].x,
                data.npcs[i].y
            );
            this.NPCList.push(npc);
            //console.log("init npc");
        }
    }

    commandTalk(taskId: string, callback: Function) {
        this.openDialog(taskId);
        this.callback = callback;
    }

    openDialog(taskId) {
        this.dialog.onAwake(taskId);
        console.log("NPCManager onClick");
    }

    changeDialog() {
        this.dialog.onChange();
    }

    closeDialog() {
        this.dialog.onSleep();
        this.callback();
    }

}

enum EmojiStatus {

    EMPTY,
    QUESTION,
    EXCLAMATION

}