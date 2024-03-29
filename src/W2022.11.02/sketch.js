'use strict';

function setupForm() {
    makeForm(
        makeSlider('horizontalSineFactor', 1, 5, 2.5, 0.1),
        makeSlider('alpha', 1, 255, 70),
        makeSlider('angleStep', 0.1, 10, 0.5, 0.1),
        makeSlider('squareSizeRange', 1, 100, [30, 50]),
    );
}

function drawSketch() {
    stroke(0, ctrl.alpha);
    strokeWeight(1);
    noFill();
    rectMode(CENTER);

    background(255);
    translate(width / 2, height / 2);
    for (let i = 0; i < 360; i += ctrl.angleStep) {

        // x-factor 2 produces the "infinity sign"

        let x = sin(i * ctrl.horizontalSineFactor) * (width / 3);
        let y = sin(i) * (height / 3);

        // Draw random squares around each point, drawn at 10% alpha, produces
        // a fuzzy shape.

        let dim = random(...ctrl.squareSizeRange);
        rect(x, y, dim, dim);
    }
}
