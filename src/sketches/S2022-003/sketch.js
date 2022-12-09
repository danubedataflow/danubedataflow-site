'use strict';

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    pixelDensity(1);
    readControls();
    let img = createImage(width, height);
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            img.set(x, y, color(random(255)));
        }
    }
    img.updatePixels();
    img.resize(width * pixelDensity(), height * pixelDensity());
    image(img, 0, 0);
    noLoop();
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    if (key == 's') saveCanvasAsPNG();
    if (key == 'r') redraw();
}
