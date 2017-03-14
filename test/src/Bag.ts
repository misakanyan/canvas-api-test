class BagPanel extends egret.DisplayObjectContainer {
    public bagBg:egret.Bitmap = new egret.Bitmap;
    private items:egret.TextField[] = [new egret.TextField];

    constructor(){
        super();
        this.bagBg.texture = RES.getRes("bg2_jpg");
        this.bagBg.x = 0;
        this.bagBg.y = 300;
        this.bagBg.width = 200;
        this.bagBg.height = 100;
        this.addChild(this.bagBg);

        if(this.items.length>0){
            for(var i:number = 0;i<this.items.length;i++){
                this.items[i].text = "血腥砍刀";
                this.items[i].x = 0;
                this.items[i].y = 300+i*20;
                this.items[i].size = 14;
                this.items[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.addItem, this)
                this.items[i].touchEnabled = true;
                this.addChild(this.items[i]);
            }
        }
    }

    private addItem(e:egret.TouchEvent){
        if(e.target.text == "佛丁二号"){
            
        }
    }
}

class Bag extends egret.DisplayObjectContainer {

    private static instance;

    private switchButton:egret.Bitmap = new egret.Bitmap;
    private switch:egret.TextField = new egret.TextField;
    //private BagPanel = new BagPanel();
    private playerPanel:PlayerPanel;
    private isShow:boolean = false;

    public bagBg:egret.Bitmap = new egret.Bitmap;
    private items:egret.TextField[] = [];

    private player:Player;
    private hero:Hero;

    public static getInstance() {
        if (Bag.instance == null) {
            Bag.instance = new Bag;
        }
        return Bag.instance;
    }

    public initBag(){
        this.initPanel();
        console.log("init bag");
        //this.initPanel();
        this.switchButton.texture = RES.getRes("button_jpg");
        this.switchButton.x = 400;
        this.switchButton.y = 475;
        this.switchButton.width = 100;
        this.switchButton.height = 25;
        this.addChild(this.switchButton);

        this.switch.text = "打开背包";
        this.switch.size = 14;
        this.switch.fontFamily = "微软雅黑";
        this.switch.anchorOffsetX = this.switch.width / 2;
        this.switch.anchorOffsetY = this.switch.height / 2;
        this.switch.x = 450;
        this.switch.y = 487.5;
        this.addChild(this.switch);

        this.bagBg.texture = RES.getRes("panelBg_png");
        this.bagBg.x = 0;
        this.bagBg.y = 300;
        this.bagBg.width = 200;
        this.bagBg.height = 100;
        this.addChild(this.bagBg);
        this.bagBg.visible = false;
        
        if(this.items.length>0){
            for(var i:number = 0;i<this.items.length;i++){
                this.items[i].text = "";
                this.items[i].x = 0;
                this.items[i].y = 300+i*20;
                this.items[i].size = 14;
                this.items[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.addItemToHero, this)
                this.items[i].touchEnabled = true;
                this.addChild(this.items[i]);
                this.items[i].visible = false;
            }
        }

        this.switchButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkStatus, this);
        this.switchButton.touchEnabled = true;
    }

    private initPanel(){

        console.log("initPanel");
        this.player = new Player();
        //console.log("英雄数量："+this.player.heroes.length);
        this.hero = new Hero(0);
        var weapon = new Weapon(0);
        var weapon2 = new Weapon(1);
        //var Ruby = new Jewel(0);
        //Ashbringer.addJewel(Ruby);
        this.hero.addWeapon(weapon);
        //console.log("武器数量："+this.hero.weapons.length);
        this.hero.addWeapon(weapon2);
        this.player.addHero(this.hero);

        this.playerPanel = new PlayerPanel(this.stage, this.player);

        //this.playerPanel.addWeapon();
        this.playerPanel.setPanel();
        //console.log("武器数量："+this.hero.weapons.length);
        this.addChild(this.playerPanel);
        this.playerPanel.visible = false;
    }

    private checkStatus(){
        if(!this.isShow){
            this.showPanel();
            this.switch.text = "关闭背包";
            this.isShow = true;
        }else{
            this.hidePanel();
            this.switch.text = "打开背包";
            this.isShow = false;
        }
    }

    private showPanel(){
        this.playerPanel.visible = true;
        this.bagBg.visible = true;
        for(var i:number = 0;i<this.items.length;i++){
            this.items[i].visible = true;
        }
        //this.addChild(this.BagPanel);
    }

    private hidePanel(){
        this.playerPanel.visible = false;
        this.bagBg.visible = false;
        for(var i:number = 0;i<this.items.length;i++){
            this.items[i].visible = false;
        }
        //this.removeChild(this.BagPanel);
    }

    private addItemToHero(e:egret.TouchEvent){
        console.log("add");
        if(e.target.text == "血腥砍刀"){
            console.log("addsuccess");
            this.player.heroesInTeam.addWeapon(new Weapon(2));
            this.playerPanel.updatePlayer(this.player);
            this.playerPanel.setPanel();
            e.target.text = null;
        }
    }

    public addItemToBag(item:string){
        this.items.push(new egret.TextField());
        this.items[this.items.length - 1].text = item;
        this.items[this.items.length - 1].size = 16;
        this.items[this.items.length - 1].x = 0;
        this.items[this.items.length - 1].y = 300 + (this.items.length - 1)*20;
        this.items[this.items.length - 1].addEventListener(egret.TouchEvent.TOUCH_TAP, this.addItemToHero, this)
        this.items[this.items.length - 1].touchEnabled = true;
        this.addChild(this.items[this.items.length - 1]);
        this.items[this.items.length - 1].visible = false;
    }

}