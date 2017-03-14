class Player {

    cash: number = 0;
    gold: number = 0;
    exp: number = 0;
    level: number = 10;
    heroes: Hero[] = []

    addHero(hero: Hero) {
        this.heroes.push(hero);
    }

    get heroesInTeam() {
        //return this.heroes.filter(hero => hero.isInTeam);
        return this.heroes[0]; //暂时只做一个英雄
    }

    getFightPower() {
        var result = 0;
        //this.heroesInTeam.map(hero => result += hero.fightPower);
        result += this.heroesInTeam.fightPower;
        return result;
    }

}


/*var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
    const getter = desc.get;
    desc.get = function () {
        return getter.apply(this);
    }
    return desc;
}*/
