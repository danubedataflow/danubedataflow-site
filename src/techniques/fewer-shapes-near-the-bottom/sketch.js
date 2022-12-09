'use strict';

makeForm(
    makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
    makeSlider('exponent', 'Exponent', 0, 5, 2, 0.1),
);

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    readControls();

    background('white');
    noStroke();
    fill('black');
    rectMode(CENTER);

    simpleGrid({
        numTiles: ctrl.numTiles,
        margin: width / 10,
        callback: (config) => {
            let {
                dim,
                y
            } = config;

            /* 0 < yPercent < 1, so the higher the exponent the more
             * likely a rectangle will be drawn.
             */
            let yPercent = map(y, 1, ctrl.numTiles, 0, 1);
            scale(0.9);
            if (random() > pow(yPercent, ctrl.exponent)) rect(0, 0, dim, dim);
        }
    });
    noLoop();
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    if (key == 's') saveCanvasAsPNG();
    if (key == 'r') redraw();
}
