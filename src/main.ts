window.onload = () => {

    var stage = new DisplayObjectContainer();

    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");

    

    context2D.fillStyle = "#FFFF0000";
    context2D.strokeStyle = "#00FF00";

    context2D.setTransform(1,0,0,1,50,50);
    context2D.rect(0, 0, 100, 100);
    context2D.fill();

    //var image = new Bitmap();
    //image.image.src = "/assets/monster.jpg"
    //image.draw(context2D);

    setInterval(() => {
            context2D.clearRect(0, 0, canvas.width, canvas.height);
            stage.draw(context2D);
    }, 30);

    var text = new TextField();
    text.text = "喵喵喵喵喵";
    text.draw(context2D);

    var image = document.createElement("img");
    image.src = "assets/monster.jpg"
   
    image.onload = () => {

        var exo = new Bitmap();
        exo.image = image;
        exo.width = 100;
        exo.height = 100;
        
        stage.addChild(exo);
        stage.addChild(text);

    }

    context2D.clearRect(0, 0, 400, 400);

    console.log(canvas);

};

interface Drawable {

    draw(context2D: CanvasRenderingContext2D);

}

class DisplayObject implements Drawable{

    x:number = 0;
    y:number = 0;

    draw(context2D: CanvasRenderingContext2D){

    }

}

class Bitmap extends DisplayObject {

    image: HTMLImageElement;
    width:number = 0;
    height:number = 0;

    draw(context2D: CanvasRenderingContext2D) {
        context2D.drawImage(this.image, this.x,this.y,this.width,this.height);
    }
}



class TextField extends DisplayObject{

    text: string = "";
    color:string = "";

    draw(context2D: CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.font = "18px 微软雅黑";
        context2D.fillText(this.text, this.x, 0);
    }
}

class DisplayObjectContainer implements Drawable {

    array: Drawable[] = [];

    draw(context2D) {
        for (let Drawable of this.array) {
            Drawable.draw(context2D);
        }
    }

    addChild(child: Drawable) {
        this.array.push(child);
    }

}