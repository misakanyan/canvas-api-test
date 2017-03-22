var WeaponConfig = [
    { id: "0", name: "阐释者", quality: 2, forge: 6, weight: 12, image: "weapon_1_png" },
    { id: "1", name: "永恒长枪", quality: 3, forge: 12, weight: 20, image: "weapon_2_png" },
    { id: "2", name: "血腥砍刀", quality: 4, forge: 20, weight: 30, image: "weapon_3_png" }
]

class Property {

    configId: string;
    name: string;

}

class WeaponProperty extends Property {

    quality: number = 5;
    forge: number = 0;
    weight: number = 0;

    constructor(id: string, name: string, quality: number, forge: number, weight: number) {
        super();
        this.configId = id;
        this.name = name;
        this.quality = quality;
        this.forge = forge;
        this.weight = weight;
    }

}

class Weapon {

    property: WeaponProperty;
    //jewels: Jewel[] = [];

    constructor(id: number) {
        if (id < WeaponConfig.length) {
            this.property = new WeaponProperty(
                WeaponConfig[id].id,
                WeaponConfig[id].name,
                WeaponConfig[id].quality,
                WeaponConfig[id].forge,
                WeaponConfig[id].weight
            )
        } else {
            console.log("this weapon does not exist")
        }
    }

    //addJewel(j: Jewel) {
    //    this.jewels.push(j);
    //}

    //getJewel(){
    //    return this.jewels;
    //}

    get attack() {
        var result = 0;
        //this.jewels.forEach(e => result += e.attack);
        result += this.property.forge * 10 * this.property.quality - this.property.weight;
        return result;
    }

    get name() {
        return this.property.name;
    }

    get quality() {
        return this.property.quality;
    }


    get fightPower() {
        var result = 0;
        //this.jewels.forEach(e => result += e.fightPower);
        result += this.attack * 5;
        return result;
    }

}