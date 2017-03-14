var HeroConfig = [
    { id: "0", name: "Kiriko", quality: 1, level: 5, strength: 10 }
]


class HeroProperty extends Property {

    quality = 1;
    level = 1;
    strength = 5;

    constructor(id: string, name: string, quality: number, level: number, strength: number) {
        super();
        this.configId = id;
        this.name = name;
        this.quality = quality;
        this.level = level;
        this.strength = strength;
    }

}

class Hero {

    property: HeroProperty;
    isInTeam: boolean = true;
    weapons: Weapon[] = [];

    constructor(id: number) {
        if (id < WeaponConfig.length) {
            this.property = new HeroProperty(
                HeroConfig[id].id,
                HeroConfig[id].name,
                HeroConfig[id].quality,
                HeroConfig[id].level,
                HeroConfig[id].strength
            )
        } else {
            console.log("this hero does not exist")
        }
    }

    addWeapon(w: Weapon) {
        this.weapons.push(w);
    }

    //使用这个方法不知为何拿不到武器
    //getWeapon(){     
    //    return this.weapons;
    //}

    setInTeamStatus(status: boolean) {
        this.isInTeam = status;
    }

    //@Cache
    get maxHp() {
        return this.property.level * 100 * this.property.quality;
    }

    get name() {
        return this.property.name;
    }

    get attack() {
        var result = 0;
        this.weapons.forEach(e => result += e.attack);
        result += this.property.level * 1.5 * this.property.strength * this.property.quality;
        return result;

    }

    get level() {
        return this.property.level;
    }

    get fightPower() {
        var result = 0;
        this.weapons.forEach(e => result += e.attack);
        result += this.attack * 5;
        result += this.maxHp * 10;
        return result;
    }

}