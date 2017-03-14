class Point{
    public x: number;
    public y: number;
    public f: number;
    public g:number;
    public h:number;
    public walkable:boolean = true;
    public parent:Point;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.walkable = config[x+y*10].walkable; //通过config数组获取walkable
        //console.log(this.walkable);
    }

}