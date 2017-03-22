var panelConfig = [
    { name: "bg", image: "resource/assets/panelBg.png", x: 0, y: 0 },
]

var heroConfig = [
    { name: "hero_0", image: "resource/assets/hero_1.png", x: 0, y: 0 }
]

var equipmentConfig = [
    { name: WeaponConfig[0].name, image: WeaponConfig[0].image, x: 0, y: 120 },
    { name: WeaponConfig[1].name, image: WeaponConfig[1].image, x: 0, y: 120 },
    { name: WeaponConfig[2].name, image: WeaponConfig[2].image, x: 0, y: 120 }
]

var jewelConfig = [
    { name: JewelConfig[0].name, image: JewelConfig[0].image, x: 0, y: 200 }
]


class PlayerPanel extends engine.DisplayObjectContainer{

    bg: engine.Bitmap;
    hero: engine.Bitmap;
    weapon: engine.Bitmap[] = [];
    //jewel: egret.Bitmap[] = [];

    player_desc: engine.TextField
    hero_desc: engine.TextField;
    weapon_desc: engine.TextField[] = [];
    //jewel_desc: egret.TextField[] = [];
    //help: egret.TextField;

    body: engine.Shape;

    //stage: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

    player:Player;

    constructor(stage: engine.DisplayObjectContainer, player:Player) {
        super();
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

    addWeapon(){
        this.weapon.push(new engine.Bitmap());
    }

    updatePlayer(player:Player){
        this.player = player;
    }

    setPanel() {
        //console.log("武器数量："+this.player.heroesInTeam.getWeapon.length);
        for(var i = 0;i<this.player.heroesInTeam.weapons.length;i++){
            this.weapon[i] = new engine.Bitmap();
            this.addChild(this.weapon[i]);
            console.log("武器数量："+this.player.heroesInTeam.weapons.length);
        }
        //for(var i = 0;i<this.jewel.length;i++){
        //    this.addChild(this.jewel[i]);
        //}
        for(var i = 0;i<this.player.heroesInTeam.weapons.length;i++){
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

        for(var i = 0;i<this.player.heroesInTeam.weapons.length;i++){
            this.weapon[i].img.src= equipmentConfig[i].image;
            this.weapon[i].x = equipmentConfig[i].x + 10;
            this.weapon[i].y = equipmentConfig[i].y + i*60;
        }
        //for(var i = 0;i<this.jewel.length;i++){
        //    this.jewel[i].texture = RES.getRes(jewelConfig[0].image);
        //    this.jewel[i].x = jewelConfig[0].x;
        //    this.jewel[i].y = jewelConfig[0].y;
        //}
        for(var i = 0;i<this.player.heroesInTeam.weapons.length;i++){
            this.weapon_desc[i].text = "武器：" + this.player.heroesInTeam.weapons[i].name
            + " \n稀有度：" + this.player.heroesInTeam.weapons[i].quality
            + " \n攻击力：" + this.player.heroesInTeam.weapons[i].attack
            + " \n战斗力：" + this.player.heroesInTeam.weapons[i].fightPower;
            this.weapon_desc[i].x = this.weapon[i].x + this.weapon[i].width + 20;
            this.weapon_desc[i].y = this.weapon[i].y;
            //this.weapon_desc[i].size = 12;
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
    }

    /*private setButton() {
        this.weapon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showWeaponPanel, this);
        this.weapon.touchEnabled = true;
    }

    private showWeaponPanel() {
        this.body.graphics.beginFill(0x000000, 0.5);
        this.body.graphics.drawRect(0, 0, 200, 100);
        this.body.graphics.endFill();

        this.stage.addChild(this.jewel);
        this.stage.addChild(this.weapon_desc);
        this.stage.addChild(this.jewel_desc);


    }*/

}