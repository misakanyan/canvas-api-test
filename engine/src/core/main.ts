/*window.onload = () => {

    var stage = new DisplayObjectContainer();
    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");

    //var blank = new DisplayObjectContainer();
    //blank.addEventListener("onclick", () => {
    //    console.log("click:blank");
    //}, this, false);
    //stage.addChild(blank);

    var image = new Bitmap();
    image.src = "assets/monster.jpg";
    image.scaleX = 2;
    image.scaleY = 2;
    image.x = 60;
    image.y = 10;
    image.relativeAlpha = 0.9;
    image.rotation = 15;
    image.addEventListener("onclick", () => {
        alert("click:image");
    }, this, false);
    image.addEventListener("onmove",()=>{
        console.log("move:image");
        let dx = currentX - lastX;
        image.x+=dx;
        let dy = currentY - lastY;
        image.y+=dy;
    },this,false);
    //stage.addChild(image);
    stage.addChild(image);

    let text = new TextField();
    text.text = "喵喵喵喵喵";
    text.x = 20;
    text.y = 100;
    text.relativeAlpha = 0.5;
    //text.addEventListener("onclick", () => {
     //   alert("click:text");
    //}, this, false);
    /*text.addEventListener("onmove",()=>{
        console.log("move:text");
        let dx = currentX - lastX;
        image.x+=dx;
        let dy = currentY - lastY;
        image.y+=dy;
    },this,false);*/
//blank.addChild(text);*/

/*setInterval(() => {
    context2D.setTransform(1, 0, 0, 1, 0, 0);
    context2D.clearRect(0, 0, canvas.width, canvas.height);
    //text.x++;
    //image.x++;
    //image.y++;
    stage.draw(context2D);
}, 30)

var hitResult: DisplayObject;
var currentX: number;
var currentY: number;
var lastX: number;
var lastY: number;
var isMouseDown: boolean = false;

window.onmousedown = (e) => {
    console.log("mousedown");
    isMouseDown = true;
    let targetArray = EventManager.getInstance().targets;
    targetArray.splice(0, targetArray.length);
    hitResult = stage.hitTest(e.offsetX, e.offsetY);
    console.log(hitResult);
    currentX = e.offsetX;
    currentY = e.offsetY;
    console.log("hit:" + currentX + " " + currentY);
}
window.onmousemove = (e) => {
    let targetArray = EventManager.getInstance().targets;
    lastX = currentX;
    lastY = currentY;
    currentX = e.offsetX;
    currentY = e.offsetY;
    if (isMouseDown) {
        for (let i = 0; i < targetArray.length; i++) {
            for (let x of targetArray[i].eventArray) {
                if (x.type.match("onmove") &&
                    x.ifCapture == true) {
                    x.func(e);
                    console.log("moving");
                }
            }
        }
        for (let i = targetArray.length - 1; i >= 0; i--) {
            for (let x of targetArray[i].eventArray) {
                if (x.type.match("onmove") &&
                    x.ifCapture == false) {
                    x.func(e);
                }
            }
        }
    }
}
window.onmouseup = (e) => {
    isMouseDown = false;
    let targetArray = EventManager.getInstance().targets;
    targetArray.splice(0, targetArray.length);
    let newHitRusult = stage.hitTest(e.offsetX, e.offsetY)
    for (let i = targetArray.length - 1; i >= 0; i--) {
        for (let x of targetArray[i].eventArray) {
            if (x.type.match("onclick") &&
                newHitRusult == hitResult) {
                x.func(e);
            }
        }
    }
}

};

