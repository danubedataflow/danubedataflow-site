'use strict';

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSelectColorMap(),
        makeSlider('numColors', '[% t.numColors %]', 2, 32, 16),
        makeSlider('chanceColor', 'Chance of any color (%)', 0, 100, 50),
        makeSlider('numTiles', '[% t.numTiles %]', 4, 40, 10),
    );
    noStroke();
    rectMode(CORNERS);
    noLoop();
}

function draw() {
    readControls();

    background("white");
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            push();
            translate((x - 1) * dim, (y - 1) * dim);

            let ul = [0, 0];
            let ur = [dim, 0];
            let ll = [0, dim];
            let lr = [dim, dim];

            // upper mid, right mid, bottom mid, left mid
            let um = [dim / 2, 0];
            let rm = [dim, dim / 2];
            let bm = [dim / 2, dim];
            let lm = [0, dim / 2];
            let center = [dim / 2, dim / 2];

            let c;

            if (random(100) < ctrl.chanceColor) {
                c = random(palette);
                fill(c);
            } else {
                c = "white"
            }
            rect(...ul, ...lr);

            if (random(100) < ctrl.chanceColor) {
                c = random(palette);
                fill(c);
            } else {
                c = "white"
            }
            triangle(...um, ...center, ...lm);


            if (random(100) < ctrl.chanceColor) {
                c = random(palette);
                fill(c);
            } else {
                c = "white"
            }
            triangle(...um, ...center, ...rm);

            if (random(100) < ctrl.chanceColor) {
                c = random(palette);
                fill(c);
            } else {
                c = "white"
            }
            triangle(...bm, ...center, ...lm);

            if (random(100) < ctrl.chanceColor) {
                c = random(palette);
                fill(c);
            } else {
                c = "white"
            }
            triangle(...bm, ...center, ...rm);

            pop();
        }
    }
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
