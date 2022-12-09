'use strict';

makeForm(
    makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
    makeSlider('exponent', 'Exponent', 0, 5, 2, 0.1),
);

function initSketch() {
    background('white');
    noStroke();
    fill('black');
    rectMode(CENTER);
}

function draw() {
    readControls();
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
