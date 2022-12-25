'use strict';

let canvas;

function setup() {
    canvas = createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSlider('resolutionFactor', 'Resolution factor', 1, 16, 8),
        makeSlider('lineDensity', 'Line density', 1, 10, 5),
    );
    noLoop();
}

function draw() {
    readControls();

    let pgDim = width / ctrl.resolutionFactor;
    let pg = createGraphics(pgDim, pgDim);
    // frameRate(24);

    canvas.imageSmoothingEnabled = false;
    pg.noSmooth();
    pg.strokeWeight(1);
    pg.stroke(0, 255, 0);
    pg.pixelDensity(1);
    pg.background('black');

    for (let y = 0; y <= 2 * pg.height; y += pg.height / ctrl.lineDensity) {
        pg.line(0, 0, pg.width, y);
        pg.line(pg.width, 0, 0, y);
    }
    imageMode(CORNER);
    image(pg, 0, 0, width, height);
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
