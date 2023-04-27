'use strict';

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSlider('greyValue', '[% t.sl('Grey value', 'Grauwert', '灰色値') %]', 0, 255, 128),
    );
    stroke('black');
    rectMode(CORNERS);
    noLoop();
}

function draw() {
    readControls();
    fill(ctrl.greyValue);
    rect(0, 0, width, height);
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
