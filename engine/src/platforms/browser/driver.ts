namespace engine {
    export let run = (canvas: HTMLCanvasElement) => {

        var stage = new DisplayObjectContainer();
        let context2D = canvas.getContext("2d");
        let render=new CanvasRenderer(stage,context2D);
        let lastNow = Date.now();
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.update();
            render.render();
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

        let hitResult: DisplayObject;
        let currentX: number;
        let currentY: number;
        let lastX: number;
        let lastY: number;
        let isMouseDown = false;

        window.onmousedown = (e) => {
            isMouseDown = true;
            let targetArray = EventManager.getInstance().targets;
            targetArray.splice(0, targetArray.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            currentX = e.offsetX;
            currentY = e.offsetY;
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
                        if (x.type.match("onmousemove") &&
                            x.ifCapture == true) {
                            x.func(e);
                        }
                    }
                }
                for (let i = targetArray.length - 1; i >= 0; i--) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.type.match("onmousemove") &&
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
            let newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
            for (let i = 0; i < targetArray.length; i++) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.type.match("onclick") &&
                            newHitRusult == hitResult &&
                            x.ifCapture == true) {
                            x.func(e);
                        }
                    }
            }
            for (let i = targetArray.length - 1; i >= 0; i--) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.type.match("onclick") &&
                            newHitRusult == hitResult &&
                            x.ifCapture == false) {
                            x.func(e);
                        }
                    }
            }
        }
        return stage;
    }

    class CanvasRenderer {

        constructor(private stage: DisplayObjectContainer, private context2D: CanvasRenderingContext2D) {

        }

        render() {
            let stage = this.stage;
            let context2D = this.context2D;
            this.renderContainer(stage);
        }

        renderContainer(container: DisplayObjectContainer) {
            for (let child of container.array) {
                let context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                let m = child.globalMatrix;
                context2D.setTransform(m.m11, m.m12, m.m21, m.m22, m.dx, m.dy);

                if (child.type == "Bitmap") {
                    this.renderBitmap(child as Bitmap);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child as TextField);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child as DisplayObjectContainer);
                }
            }
        }

        renderBitmap(bitmap: Bitmap) {
             if (bitmap.image == null) {
                let img = new Image();
                img.src = bitmap.texture;
                img.onload = () => {
                    this.context2D.drawImage(img, 0, 0);
                    bitmap.image = img;
                }
            } else {
                bitmap.image.src=bitmap.texture;
                this.context2D.drawImage(bitmap.image, 0, 0);
            }
        }

        renderTextField(textField: TextField) {
            this.context2D.fillText(textField.text, 0, 10);
            textField._measureTextWidth = this.context2D.measureText(textField.text).width;
        }
    }

}
