'use strict';

const config = new Config()
    .title('E997')
    .maxIterations(1);

makeForm(
    makeSlider('numTiles', 'Number of tiles', 2, 20, 10),
    makeSlider('numRects', 'Number of rectangles', 2, 20, 10),
    makeSlider('scale', 'Scale', 0, 1, 0.9, 0.1),
    makeSlider('strokeWeight', 'Stroke weight', 1, 20, 10),
);

let palette;

function initSketch() {
    background('white');
    noFill();
    stroke('black');
    strokeWeight(ctrl.strokeWeight);
}

function drawSketch() {
    // Scale down to create a margin so the outermost strokes won't be clipped.
    let dim = width;  // width == height because of square canvas
    translate(dim / 2, dim / 2);
    scale(ctrl.scale);
    translate(-dim / 2, -dim / 2);

    let tileDim = width / ctrl.numTiles;

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = randomIntRange(0, ctrl.numTiles - 1);
        let ulY = randomIntRange(0, ctrl.numTiles - 1);
        let spanX = randomIntRange(1, ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, ctrl.numTiles - ulY);

        rect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
}
