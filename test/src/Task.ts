interface TaskCondition {
    onAccept(task: Task);
    onSubmit();
}

interface TaskConditionContext {
    current: number;
    checkStatus();
    killMonsterCheckStatus();
}

class NpcTalkTaskCondition implements TaskCondition {

    private static instance;

    public static getInstance() {
        if (NpcTalkTaskCondition.instance == null) {
            NpcTalkTaskCondition.instance = new NpcTalkTaskCondition;
        }
        return NpcTalkTaskCondition.instance;
    }

    onAccept(task: TaskConditionContext) {
        task.current++;
        NPCManager.getInstance().changeDialog();
        task.checkStatus();
    }


    onSubmit() {

    }
}

class KillMonsterTaskCondition implements TaskCondition, SceneObserver {
    private static instance;

    public static getInstance() {
        if (KillMonsterTaskCondition.instance == null) {
            KillMonsterTaskCondition.instance = new KillMonsterTaskCondition;
        }
        return KillMonsterTaskCondition.instance;
    }

    onAccept(task: TaskConditionContext) {
        task.current++;
        task.killMonsterCheckStatus();
    }


    onSubmit() {

    }

    onChange(task: Task) {
        this.onAccept(task);
    }
}


class Task implements TaskConditionContext {

    private _id: string;
    private _name: string;
    private _status: TaskStatus;
    private _desc: string;
    public fromNpcId: string;
    public toNpcId: string;

    public current: number = 0;
    public total: number = -1;

    public condition: TaskCondition;


    constructor(id: string,
        name: string,
        status: TaskStatus,
        desc: string,
        fromNpcId: string,
        toNpcId: string,
        condition: TaskCondition,
        current: number,
        total: number
    ) {
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

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get status(): TaskStatus {
        return this._status;
    }

    public set status(status: TaskStatus) {
        this._status = status;
    }

    public get desc(): string {
        return this._desc;
    }

    public onAccept() {
        this.condition.onAccept(this);
    }

    public checkStatus() {
        //if(this.current > this.total){
        //    console.warn();
        //}
        //console.log("current: " + this.current);
        if (this._status == TaskStatus.DURING &&
            this.current >= this.total + 1) {  //不加1对话的最后一句会被吞掉
            this._status = TaskStatus.CAN_SUBMIT;
            //console.log(this._status);
            TaskService.getInstance().submit(this._id);
            TaskService.getInstance().enforceAccept("1"); //用于启动下一个任务
            SceneService.getInstance().wakeUpMonster("0") //用于唤醒怪物
            NPCManager.getInstance().closeDialog();
            console.log("submitted");
        }
    }

    public killMonsterCheckStatus() {
        if (this._status == TaskStatus.DURING &&
            this.current >= this.total + 1) {  //不加1对话的最后一句会被吞掉
            //this._status = TaskStatus.CAN_SUBMIT;
            //console.log(this._status);
            TaskService.getInstance().complete(this._id);
            SceneService.getInstance().killMonster("0");//用于清除怪物
            console.log("submitted");
        }
    }

}

class TaskService {

    private observerList: Observer[] = [];
    public taskList: Task[] = [];
    private static instance;

    public static getInstance() {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService;
        }
        return TaskService.instance;
    }

    init() {
        this.initTask();
        this.initObserver();
    }

    private initTask() {
        var data = gameconfig_json;
        for (var i = 0; i < data.tasks.length; i++) {
            var taskType = data.tasks[i].type == "dialog" ? NpcTalkTaskCondition.getInstance() : KillMonsterTaskCondition.getInstance();
            var task: Task = new Task(data.tasks[i].id,
                data.tasks[i].name,
                data.tasks[i].status,
                data.tasks[i].desc,
                data.tasks[i].fromNpcId,
                data.tasks[i].toNpcId,
                taskType,
                //NpcTalkTaskCondition.getInstance(),
                data.tasks[i].current,
                data.tasks[i].total
            );
            this.taskList.push(task);
        }
    }

    private initObserver() {

    NPCManager.getInstance().init();
    for (var i: number = 0; i < NPCManager.getInstance().NPCList.length; i++) {
        this.observerList.push(NPCManager.getInstance().NPCList[i]);
    }
    for(var i:number = 0;i<this.taskList.length;i++){
        this.notify(this.taskList[i]);
    }

    }

    addObserver(o: Observer) {
        this.observerList.push(o);
    }

    notify(task: Task) {
        for (var i: number = 0; i < TaskService.getInstance().observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    }

    activate(id: string){
        let task = this.taskList[id];
        if (task.status == TaskStatus.CAN_ACCEPT) {
            task.status = TaskStatus.ACCEPTABLE;
            console.log('activate task:' + id);
        }
        this.notify(task);
    }

    enforceAccept(id: string) {
        let task = this.taskList[id];
        if (task.status == TaskStatus.UNACCEPTABLE) {
            task.status = TaskStatus.DURING;
            task.onAccept();
            console.log('enforce accept:' + id);
            console.log("enforce accept status: " + this.taskList[id]._status);
        }
        this.notify(task);
    }

    accept(id: string) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        //console.log(this.taskList[id]);
        let task = this.taskList[id];
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

    }

    complete(id: string) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }

        let task = this.taskList[id];
        if (!task) {
            return ErrorCode.MISSING_TASK;
        }
        if (task.status == TaskStatus.DURING) {
            task.status = TaskStatus.CAN_SUBMIT;
            console.log('complete:' + id);

        }
        this.notify(task);
    }

    submit(id: string) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }

        let task = this.taskList[id];
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
    }

    getTaskByCustomRole(rule: Function): Task[] {
        var task: Task[] = [];
        var npcId = rule();
        for (var i: number = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].fromNpcId == npcId /*|| this.taskList[i].toNpcId == npcId*/) {//取消两个id设置
                task.push(this.taskList[i]);
            }
        }
        return task;
    }
}

enum ErrorCode {

    SUCCESS,
    MISSING_TASK

}

enum TaskStatus {

    UNACCEPTABLE,
    ACCEPTABLE,
    DURING,
    CAN_SUBMIT,
    SUBMITTED,
    CAN_ACCEPT

}

interface Observer {

    onChange(task: Task);

}

interface Strategy {

    selector: Function;

}

class TaskTextElement extends engine.DisplayObjectContainer {

    private _taskid: string;
    taskNameText: engine.TextField = new engine.TextField;
    taskStatusText: engine.TextField = new engine.TextField;
    taskDescText: engine.TextField = new engine.TextField;
    button:engine.TextField = new engine.TextField;

    constructor(id: string, name: string, status: TaskStatus, desc: string) {
        super();
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

    changeText(task: Task) {
        this.taskNameText.text = "任务 : " + task.name;
        this.taskStatusText.text = "当前状态 : " + ChineseTaskStatus[task.status];
        this.taskDescText.text = task.desc;
        //console.log("panel taskinfo change success");
    }

    public get taskId(): string {
        return this._taskid;
    }

    // private onClick(e:engine.TouchEvent){
    //     if(e.currentTarget.text == "接受" || e.currentTarget.text == "提交"){
    //         console.log("任务id为"+this.taskId+"的按钮被按下");
    //         console.log(this._taskid);
    //         for(var i = 0;i<NPCManager.getInstance().NPCList.length;i++){
    //             for(var j = 0;j<NPCManager.getInstance().NPCList[i]._taskList.length;j++){
    //                 console.log(NPCManager.getInstance().NPCList[i]._taskList[j].id);
    //                 if(this._taskid == NPCManager.getInstance().NPCList[i]._taskList[j].id){
    //                     CommandList.getInstance().addCommand(new TalkCommand(NPCManager.getInstance().NPCList[i]));
    //                     CommandList.getInstance().execute();
    //                     console.log("发送谈话命令");
    //                 }
    //             }
    //         }
    //     }
    // }


}

class TaskPanel extends engine.DisplayObjectContainer implements Observer {

    private taskTextList: TaskTextElement[] = [];
    private bg: engine.Bitmap = new engine.Bitmap;
    private bgShape: engine.Shape = new engine.Shape;

    constructor() {
        super();
        this.bgShape.x = 0;
        this.bgShape.y = 0;
        //this.bgShape.graphics.clear();
        //this.bgShape.graphics.beginFill(0x000000, .5);
        //this.bgShape.graphics.drawRect(0, 0, 200, 200);
        //this.bgShape.graphics.endFill();
        this.addChild(this.bgShape);
        for (var i: number = 0; i < TaskService.getInstance().taskList.length; i++) {
            var taskText = new TaskTextElement(TaskService.getInstance().taskList[i].id, TaskService.getInstance().taskList[i].name, TaskService.getInstance().taskList[i].status, TaskService.getInstance().taskList[i].desc);
            this.taskTextList.push(taskText);
            this.taskTextList[i].y = i * 100;
            this.addChild(taskText);
        }
    }

    onChange(task: Task) {
        for (var i: number = 0; i < this.taskTextList.length; i++) {
            if (task.id == this.taskTextList[i].taskId) {
                this.taskTextList[i].changeText(task);
                if(task.status == TaskStatus.ACCEPTABLE){
                    this.taskTextList[i].button.text = "接受";
                    //this.taskTextList[i].button.visible = true;
                }else if(task.status == TaskStatus.CAN_SUBMIT){
                    this.taskTextList[i].button.text = "提交";
                    //this.taskTextList[i].button.visible = true;
                }else{
                    //this.taskTextList[i].button.visible = false;
                }
            }
        }
    }

}

class DialogPanel extends engine.DisplayObjectContainer {

    charaName: engine.TextField = new engine.TextField;
    desc: engine.TextField = new engine.TextField;
    bg: engine.Bitmap = new engine.Bitmap;
    dialogue: any[] = [];
    dialogueCount: number = 0;
    dialogueTotal: number = 0;
    tachie_left: engine.Bitmap = new engine.Bitmap;
    tachie_right: engine.Bitmap = new engine.Bitmap;
    //button: engine.Shape = new engine.Shape;
    private currentTaskId: string = "-1";

    constructor() {
        super();

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

    onAwake(taskId) {
        this.currentTaskId = taskId;
        var data = dialogue_json;
        for (var i: number = 0; i < data.dialogue.length; i++) {
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
    }

    onChange() {
        if (this.dialogueTotal == 0) {
            //console.log("未传入dialogueTotal参数");
        } else if (this.dialogueCount < this.dialogueTotal) {
            this.charaName.text = this.dialogue[this.dialogueCount].actorName;
            this.desc.text = this.dialogue[this.dialogueCount].content;
            if (this.dialogue[this.dialogueCount].side == "left") {
                this.tachie_left.img.src = this.dialogue[this.dialogueCount].tachie;
                this.tachie_right.img.src = "";
            } else if (this.dialogue[this.dialogueCount].side == "right") {
                this.tachie_right.img.src = this.dialogue[this.dialogueCount].tachie;
                this.tachie_left.img.src = "";
            }
            this.dialogueCount++;
        }
    }

    onSleep() {
        this.removeChild(this.bg);
        this.removeChild(this.desc);
        this.removeChild(this.charaName);
        this.removeChild(this.tachie_left);
        this.removeChild(this.tachie_right);
        this.dialogue = [];
        this.dialogueCount = 0;
        this.dialogueTotal = 0;
    }

    private onClick() {
        //console.log("onclick");
        if (this.currentTaskId == "-1") {
            console.log("no task on dialogPanel");
        } else {
            let task = TaskService.getInstance().taskList[this.currentTaskId];
            task.onAccept();
        }
    }
}

var ChineseTaskStatus = {
    0: "不可接受",
    1: "可接受",
    2: "进行中",
    3: "可提交",
    4: "已提交",
    5: "未接受"
}


