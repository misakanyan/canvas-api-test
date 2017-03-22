var JewelConfig = [
    { id: "0", name: "红宝石", quality: 1, edge: 3, purity: 0.50, image: "jewel_0_jpg" },
    { id: "1", name: "jewel_1", quality: 2, edge: 4, purity: 0.65, image: "jewel_1_jpg" },
    { id: "2", name: "jewel_2", quality: 3, edge: 5, purity: 0.75, image: "jewel_2_jpg" },
    { id: "3", name: "jewel_3", quality: 4, edge: 8, purity: 0.90, image: "jewel_3_jpg" }
]


class JewelProperty {

    name: string;
    quality: number = 0;
    edge: number = 0;
    purity: number = 0;

    constructor(name: string, quality: number, edge: number, purity: number) {
        this.name = name;
        this.quality = quality;
        this.edge = edge;
        this.purity = purity;
    }

    /*get attack() {
        var result = 0;
        result += this.edge * this.edge * (this.purity + 1) * this.quality / 10;
        return result;
    }

    get fightPower() {
        var result = 0;
        result += this.edge * this.edge * (this.purity + 1) * this.quality;
        return result;
    }*/

}

class Jewel {

    public property: JewelProperty

    constructor(id: number) {
        this.property = new JewelProperty(
            JewelConfig[id].name,
            JewelConfig[id].quality,
            JewelConfig[id].edge,
            JewelConfig[id].purity
        )
    }

    get attack() {
        var result = 0;
        result += this.property.edge * this.property.edge * (this.property.purity + 1) * this.property.quality / 10;
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
        result += this.attack * 5;
        return result;
    }

}