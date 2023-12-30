'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 2, 20, 10),
        makeSlider('numRects', 2, 20, 10),
        makeSlider('scale', 0.5, 1, 0.9, 0.1),
        makeSlider('strokeWeightRange', 1, 20, [10, 12]),
        makeSlider('alphaRange', 0, 255, [200, 255]),
    );
}

function drawSketch() {
    background('white');
    noFill();
    rectMode(CORNER);

    // Scale down to create a margin so the outermost strokes won't be clipped.
    let dim = width; // width == height because of square canvas
    translate(dim / 2, dim / 2);
    scale(ctrl.scale);
    translate(-dim / 2, -dim / 2);

    let tileDim = width / ctrl.numTiles;

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = randomIntRange(0, ctrl.numTiles - 1);
        let ulY = randomIntRange(0, ctrl.numTiles - 1);
        let spanX = randomIntRange(1, ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, ctrl.numTiles - ulY);

        strokeWeight(randomIntRange(...ctrl.strokeWeightRange));
        stroke(0, randomIntRange(...ctrl.alphaRange));
        rect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
}
