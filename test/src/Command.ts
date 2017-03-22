
interface Command {

    execute(callback: Function): void;

    cancel(callback: Function): void;

}

class WalkCommand implements Command {
    private x:number;
    private y:number;
    private path:Point[]
    private chara:Character;
    constructor(x: number, y: number,path:Point[],chara:Character) {
        this.x = x;
        this.y = y;
        this.path = path;
        this.chara = chara;
    }

    execute(callback: Function): void {
        this.chara.commandMove(this.x,this.y,this.path,function(){
            callback();
            //console.log(callback);
        });
    }

    cancel(callback: Function) {
        this.chara.commandStop();
        callback();
        //GameScene.getCurrentScene().stopMove(function () {
        //    callback();
        //})
    }
}

class FightCommand implements Command {
    /**
     * 所有的 Command 都需要有这个标记，应该如何封装处理这个问题呢？
     */
    private _hasBeenCancelled = false;
    private _linkTaskId:string;

    constructor(_linkTaskId:string){
        this._linkTaskId = _linkTaskId;
    }

    execute(callback: Function): void {

        console.log("开始战斗")
        SceneService.getInstance().commandFight(this._linkTaskId,function(){
            callback();
        });
        //egret.setTimeout(() => {
        //    if (!this._hasBeenCancelled) {
        //        console.log("结束战斗")
        //        callback();
        //    }
        //}, this, 500)
    }

    cancel(callback: Function) {
        console.log("脱离战斗")
        this._hasBeenCancelled = true;
        setInterval(function () {
            callback();
        }, this, 100)

    }
}

class TalkCommand implements Command {

    private npc:NPC;

    constructor(npc:NPC){
        this.npc = npc;
    }

    execute(callback: Function): void {
        console.log("打开对话框")
        for (var i: number = 0; i < this.npc._taskList.length; i++) {
            console.log("taskId: " + this.npc._taskList[i].id + " status: " + this.npc._taskList[i].status);
            if (this.npc._taskList[i].status == TaskStatus.ACCEPTABLE) {
                TaskService.getInstance().accept(this.npc._taskList[i].id);
                NPCManager.getInstance().commandTalk(this.npc._taskList[i].id,function(){
                    callback();
                })
                //CommandList.getInstance().addCommand(new TalkCommand(this.npc._taskList[i].id));
                //CommandList.getInstance().execute();
                //NPCManager.getInstance().openDialog(this._taskList[i].id);
                break;
            }else if(this.npc._taskList[i].status == TaskStatus.CAN_SUBMIT){
                TaskService.getInstance().submit(this.npc._taskList[i].id);
            }else if(this.npc._taskList[i].status == TaskStatus.CAN_ACCEPT){
                TaskService.getInstance().activate(this.npc._taskList[i].id);
            }
        }
        
        /*egret.setTimeout(function () {
            console.log("结束对话")
            callback();
        }, this, 500)*/
    }

    cancel(callback: Function) {
        console.log("关闭对话框");
    }
}

class CommandList {

    private static instance;

    public static getInstance() {
        if (CommandList.instance == null) {
            CommandList.instance = new CommandList;
        }
        return CommandList.instance;
    }

    private _list: Command[] = [];
    public currentCommand: Command;
    private _frozen = false;

    addCommand(command: Command) {
        this._list.push(command);
    }

    cancel() {
        this._frozen = true;
        var command = this.currentCommand;
        setInterval(() => {
            if (this._frozen) {
                this._frozen = false;
            }

        }, this, 2000);
        if (command) {
            command.cancel(() => {
                this._frozen = false;
            });
            this._list = [];
        }

    }

    execute() {
        if (this._frozen) {
            setInterval(this.execute, this, 100);
            return;
        }

        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
            console.log("执行下一命令", command)
            command.execute(() => {
                this.execute()
            })

        }
        else {
            console.log("全部命令执行完毕")
        }
    }

}