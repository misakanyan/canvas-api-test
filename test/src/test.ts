var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = engine.run(canvas);
var image = new engine.Bitmap();
image.src = "monster.jpg";
    image.scaleX = 2;
    image.scaleY = 2;
    image.x = 60;
    image.y = 10;
    image.relativeAlpha = 0.9;
    image.rotation = 15;
stage.addChild(image);
let speed = 10;

engine.Ticker.getInstance().register((deltaTime) => {
    console.log("aaa")
    image.x += 1;
});

