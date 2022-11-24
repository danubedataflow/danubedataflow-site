'use strict';

const config = new Config()
    .title('E2022-002')
    .maxIterations(1);

makeForm(
    makeSlider('xFactor', 'Horizontal factor', 1, 5, 2.5, 0.1),
    makeSlider('alpha', 'Alpha', 1, 255, 70),
    makeSlider('angleStep', 'Angle step', 0.1, 10, 0.5, 0.1),
    makeSlider('squareSize', 'Square size', 1, 100, [30, 50]),
);

function initSketch() {
    stroke(0, ctrl.alpha);
    strokeWeight(1);
    noFill();
    rectMode(CENTER);
}

function drawSketch() {
    background(255);
    translate(width / 2, height / 2);
    for (let i = 0; i < 360; i += ctrl.angleStep) {

        // x-factor 2 produces the "infinity sign"

        let x = sin(i * ctrl.xFactor) * (width / 3);
        let y = sin(i) * (height / 3);

        // Draw random squares around each point, drawn at 10% alpha, produces
        // a fuzzy shape.

        let dim = random(...ctrl.squareSize);
        rect(x, y, dim, dim);
    }
}
