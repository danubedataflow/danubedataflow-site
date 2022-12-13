'use strict';

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSlider('scale', 'Scale', 0, 1, 0.9, 0.1),
        makeSlider('strokeWeight', 'Stroke weight', 1, 20, 10),
    );
}

function draw() {
    readControls();
    let dim = width; // square canvas

    translate(dim / 2, dim / 2);
    scale(ctrl.scale);

    // From now on all coordinates are scaled. For example, `width / 2`
    // corresponds to `ctrl.scale * width / 2` because of the scale factor.

    translate(-dim / 2, -dim / 2);
    background(220);
    strokeWeight(ctrl.strokeWeight);
    strokeCap(SQUARE);
    rect(0, 0, dim, dim);

    // Note that the green and red stroke caps show that the black rectangle's
    // stroke is centered.
    stroke('red');
    line(0, dim / 2, dim, dim / 2);
    stroke('green');
    line(dim / 2, 0, dim / 2, dim);

    noLoop();
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
