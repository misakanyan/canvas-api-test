var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = engine.run(canvas);
var bitmap = new engine.Bitmap();
stage.addChild(bitmap);
let speed = 10;

engine.Ticker.getInstance().register((deltaTime) => {
    console.log("aaa")
    bitmap.x += 1;
});

